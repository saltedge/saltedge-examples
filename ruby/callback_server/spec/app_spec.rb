require "rspec"
require "sinatra"
require "rack/test"
require "json"
require "base64"
require_relative "../app" # Assuming your Sinatra app is defined in "app.rb"

RSpec.describe "Signature Verification" do
  include Rack::Test::Methods

  def app
    Sinatra::Application
  end

  def sign_request(data)
    Base64.encode64(@private_key.sign(OpenSSL::Digest.new("SHA256"), data)).delete("\n")
  end

  before(:all) do
    # Prepare test data and keys
    @public_key  = OpenSSL::PKey::RSA.new(File.open("../public.pem"))
    @private_key = OpenSSL::PKey::RSA.new(File.open("../private.pem"))
    @data        = {
      data: {
        connection_id: "111111111111111111",
        customer_id:   "222222222222222222",
        custom_fields: { key: "value" },
        stage:         "finish",
      },
    }
  end

  context "when verifying a valid signature" do
    it "returns true" do
      signature_body  = "http://localhost:9292/api/callbacks/success|#{@data.to_json}"
      valid_signature = sign_request(signature_body)

      post "/api/callbacks/success", JSON.generate(@data), "HTTP_SIGNATURE" => valid_signature, "CONTENT_TYPE" => "application/json"

      expect(last_response.status).to eq(200)
    end
  end

  context "when verifying an invalid signature" do
    it "returns false" do
      invalid_signature = Base64.strict_encode64("some_invalid_signature")

      post "/api/callbacks/success", @data, "HTTP_SIGNATURE" => invalid_signature

      expect(last_response.status).to eq(400)
    end
  end

  context "when verifying an empty signature" do
    it "returns false" do
      post "/api/callbacks/success", @data

      expect(last_response.status).to eq(400)
    end
  end
end

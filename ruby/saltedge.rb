require "json"
require "base64"
require "openssl"
require "digest"
require "rest-client"

class Saltedge
  EXPIRATION_TIME = 60

  attr_reader :app_id, :secret, :private_key

  def initialize(app_id, secret, private_pem_path)
    @app_id      = app_id
    @secret      = secret
    @private_key = OpenSSL::PKey::RSA.new(File.open(private_pem_path))
  end

  def request(method, url, params = {})
    hash = {
      method:     method,
      url:        url,
      expires_at: (Time.now + EXPIRATION_TIME).to_i,
      params:     params.to_json,
    }

    RestClient::Request.execute(
      method:  hash[:method],
      url:     hash[:url],
      payload: hash[:params],
      log:     Logger.new(STDOUT),
      headers: {
        "Accept"       => "application/json",
        "Content-type" => "application/json",
        "Expires-at"   => hash[:expires_at],
        "Signature"    => sign_request(hash),
        "App-Id"       => app_id,
        "Secret"       => secret,
      }
    )
  rescue RestClient::Exception => e
    pp JSON.parse(e.response)
  end

  private

  def sign_request(hash)
    data = "#{hash[:expires_at]}|#{hash[:method].to_s.upcase}|#{hash[:url]}|#{hash[:params]}"
    Base64.encode64(private_key.sign(OpenSSL::Digest.new('SHA256'), data)).delete("\n")
  end
end

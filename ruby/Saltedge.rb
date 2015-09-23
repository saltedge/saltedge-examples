require "rest-client"
require "base64"
require "openssl"
require "active_support"
require "active_support/core_ext"
require "digest/sha1"
require "pry"

class Saltedge

  def initialize(client_id, service_secret)
    @client_id      = client_id
    @service_secret = service_secret
  end

  def self.expires_at
    (Time.now + 60.days).to_i
  end

  def post(some_url)

  end

  def rsa_key(file)
    OpenSSL::PKey::RSA.new(File.read(file))
  end

  def digest
    OpenSSL::Digest::SHA1.new
  end

  def get(some_url)
    expires = Saltedge.expires_at
    signature = Base64.encode64(rsa_key("private.pem").sign(digest, "#{expires}|GET|#{some_url}"))

    pp response = RestClient::Request.execute(
      :url            => some_url,
      :method         => :get,
      :headers        => {
        # "Expires-at"     => expires,
        # "Signature"      => signature,
        "Accept"         => "application/json",
        "Content-type"   => "application/json",
        "Client-id"      => @client_id,
        "Service-secret" => @service_secret
      },
      :ssl_client_cert  =>  OpenSSL::X509::Certificate.new(File.read("saltedge.pem")),
      # :ssl_ca_file      => File.expand_path("saltedge.pem"),
      :ssl_version      => "SSLv3",
      # :verify_ssl       => false
    )
  end
end


sdk = Saltedge.new("qYAUAjxz1zB0PqL5viGTwA", "hzzvj4DSgL_HGojGDtQAjp_PtWejH6RKWsjObweYd6o")
sdk.get("https://www.saltedge.com/api/v2/countries")
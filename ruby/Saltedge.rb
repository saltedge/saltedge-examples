require "json"
require "base64"
require "openssl"
require "digest/sha1"
require "rest-client"
require "active_support"
require "active_support/core_ext"

class Saltedge  attr_reader :expires_at, :client_id, :service_secret, :url, :method, :params

  def initialize(client_id, service_secret, private_pem_path)
    @client_id        = client_id
    @service_secret   = service_secret
    @private_pem_path = private_pem_path
  end

  def expires_at
    @expires_at ||= (Time.now + 1.minute).to_i
  end

  def signature
    Base64.encode64(rsa_key(@private_pem_path).sign(digest, "#{expires_at}|#{@method}|#{@url}|#{@params}"))
  end

  def rsa_key(file)
    OpenSSL::PKey::RSA.new(File.read(file))
  end

  def digest
    OpenSSL::Digest::SHA1.new
  end

  def request(method, url, params="")
    @method = method
    @params = params.to_json
    @url    = url

    RestClient::Request.execute(
      method:  method,
      url:     url,
      payload: @params,
      headers: {
        "Accept"         => "application/json",
        "Content-type"   => "application/json",
        "Expires-at"     => expires_at,
        "Signature"      => signature.delete("\n"),
        "Client-id"      => @client_id,
        "Service-secret" => @service_secret
      }
    )
  end
end
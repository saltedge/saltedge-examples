require "json"
require "base64"
require "openssl"
require "digest/sha1"
require "rest-client"
require "active_support"
require "active_support/core_ext"

# Example:
#   api = Saltedge.new("CLIENT_ID", "SERVICE_SECRET", "private_pem_path")
#   api.request("GET", "https://www.saltedge.com/api/v2/countries")
#   api.request("POST", "https://www.saltedge.com/api/v2/customers/", {\"data\":{\"identifier\":\"my_unique_identifier\"}})

class Saltedge
  attr_reader :client_id, :service_secret, :url, :method, :params, :private_pem_path

  def initialize(client_id, service_secret, private_pem_path)
    @client_id        = client_id
    @service_secret   = service_secret
    @private_pem_path = private_pem_path
  end

  def signature(expires_at)
    Base64.encode64(rsa_key(@private_pem_path).sign(digest, "#{expires_at}|#{@method}|#{@url}|#{@params}"))
  end

  def rsa_key
    OpenSSL::PKey::RSA.new(File.read(@private_pem_path))
  end

  def digest
    OpenSSL::Digest::SHA1.new
  end

  def request(method, url, params="")
    @method    = method
    @params    = params.to_json
    @url       = url
    expires_at = (Time.now + 1.minute).to_i

    RestClient::Request.execute(
      method:  method,
      url:     url,
      payload: @params,
      headers: {
        "Accept"         => "application/json",
        "Content-type"   => "application/json",
        "Expires-at"     => expires_at,
        "Signature"      => signature(expires_at).delete("\n"),
        "Client-id"      => @client_id,
        "Service-secret" => @service_secret
      }
    )
  end
end
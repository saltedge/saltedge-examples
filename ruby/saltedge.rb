require "json"
require "base64"
require "openssl"
require "digest/sha1"
require "rest-client"

class Saltedge
  attr_reader :client_id, :service_secret, :private_pem_path

  def initialize(client_id, service_secret, private_pem_path)
    @client_id        = client_id
    @service_secret   = service_secret
    @private_pem_path = private_pem_path
  end

  def request(method, url, params={})
    hash = {
      method:     method,
      url:        url,
      expires_at: (Time.now + 60).to_i,
      params:     !params.empty? ? params.to_json : ""
    }

    RestClient::Request.execute(
      method:  method,
      url:     url,
      payload: hash[:params],
      headers: {
        "Accept"         => "application/json",
        "Content-type"   => "application/json",
        "Expires-at"     => hash[:expires_at],
        "Signature"      => signature(hash).delete("\n"),
        "Client-id"      => client_id,
        "Service-secret" => service_secret
      }
    )
  end

private

  def signature(hash)
    Base64.encode64(rsa_key.sign(digest, "#{hash[:expires_at]}|#{hash[:method]}|#{hash[:url]}|#{hash[:params]}"))
  end

  def rsa_key
    @rsa_key ||= OpenSSL::PKey::RSA.new(@private_pem_path)
  end

  def digest
    OpenSSL::Digest::SHA1.new
  end
end
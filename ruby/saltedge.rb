require "json"
require "base64"
require "openssl"
require "digest"
require "rest-client"

class Saltedge
  attr_reader :app_id, :secret, :private_key
  EXPIRATION_TIME = 60

  def self.verify_signature(public_key, data, signature)
    public_key.verify(OpenSSL::Digest::SHA256.new, Base64.decode64(signature), data)
  end

  def initialize(app_id, secret, private_pem_path)
    @app_id      = app_id
    @secret      = secret
    @private_key = OpenSSL::PKey::RSA.new(File.open(private_pem_path))
  end

  def request(method, url, params={})
    hash = {
      method:     method,
      url:        url,
      expires_at: (Time.now + EXPIRATION_TIME).to_i,
      params:     as_json(params)
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
        "Secret"       => secret
      }
    )
  rescue RestClient::Exception => error
    pp JSON.parse(error.response)
  end

private

  def sign_request(hash)
    data = "#{hash[:expires_at]}|#{hash[:method].to_s.upcase}|#{hash[:url]}|#{hash[:params]}"
    pp data
    Base64.encode64(private_key.sign(OpenSSL::Digest::SHA256.new, data)).delete("\n")
  end

  def as_json(params)
    return "" if params.empty?
    params.to_json
  end
end

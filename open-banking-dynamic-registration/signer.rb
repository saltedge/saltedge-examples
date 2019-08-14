require "securerandom"
require "base64"
require "jwt"

class Signer
  PS256 = "PS256"
  RS256 = "RS256"

  def initialize(settings)
    @signing_key    = settings.fetch(:signing_key)
    @signing_key_id = settings.fetch(:signing_key_id)
    @alg            = settings.fetch(:alg, PS256)
  end

  def sign_claims(payload, headers = {})
    now     = Time.now.to_i
    payload = payload.merge(iat: now, exp: now + 3600, jti: SecureRandom.uuid)
    sign(payload, headers)
  end

  def sign_detached(payload, headers = {})
    sign(payload, headers.merge(typ: "JOSE")).sub(/\..+?\./, "..")
  end

  def sign(payload, headers = {})
    headers = { alg: @alg, kid: @signing_key_id, typ: "JWT" }.merge(headers)

    if @alg == RS256
      return JWT.encode(payload, @signing_key, RS256, headers)
    end

    encoded_headers = encode(headers.to_json)
    encoded_payload = encode(payload.to_json)

    to_sign   = [encoded_headers, encoded_payload].join(".")
    signature = @signing_key.sign_pss("SHA256", to_sign, salt_length: 32, mgf1_hash: "SHA256")
    encoded_signature = encode(signature)

    [
      encoded_headers,
      encoded_payload,
      encoded_signature
    ].join(".")
  end

private

  def encode(string)
    Base64.strict_encode64(string).tr("+/", "-_").delete("=")
  end
end

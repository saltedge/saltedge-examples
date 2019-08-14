require "json"
require "yaml"
require "rest-client"
require "pry"

require_relative "keychain"
require_relative "signer"

payload = {
  aud:                             "<openid-config.issuer>", # CHANGE REQUIRED
  iss:                             Keychain.ssid,
  software_id:                     Keychain.ssid,
  software_statement:              Keychain.ssa.strip,
  scope:                           Keychain.scope,
  token_endpoint_auth_method:      "tls_client_auth", # Change method according to available methods in the openid-configuration
  tls_client_auth_dn:              Keychain.transport_cert.subject.to_utf8,
  request_object_signing_alg:      "PS256",
  token_endpoint_auth_signing_alg: "PS256",
  id_token_signed_response_alg:    "PS256",
  application_type:                "web",
  response_types:                  ["code id_token"],
  redirect_uris: Keychain.redirect_uris,
  grant_types: [
    "authorization_code",
    "refresh_token",
    "client_credentials"
  ]
}

jwt = Signer.new(
  signing_key:    Keychain.signing_key,
  signing_key_id: Keychain.signing_key_id
).sign_claims(payload)

options = {
  method: :post,
  url: "<openid-config.registration_endpoint>", # CHANGE REQUIRED
  payload: jwt,
  headers: {
    "Content-Type": "application/jwt",
    "Accept":       "application/json"
  },
  ssl_client_cert: Keychain.transport_cert,
  ssl_client_key:  Keychain.transport_key,
  # verify_ssl: false
}

begin
  response = RestClient::Request.execute(options)
rescue => error
  binding.pry
end

puts "===============SAVE THE FOLLOWING OUTPUT==============="
puts response.body


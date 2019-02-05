require 'jwt'
require 'rest-client'
require 'json'
require 'yaml'
require 'pp'
require 'pry'

CERT_DIR = File.join(File.dirname(__FILE__), "certificates")
config   = YAML.load_file(File.join(CERT_DIR, "config.yml"))

software_statement_id = config["software_statement_id"]
kid                   = config["sign_kid"]
ssa                   = File.read(File.join(CERT_DIR, "SSA")).strip

sign_key       = OpenSSL::PKey::RSA.new(File.read(File.join(CERT_DIR, "sign.key")))
transport_key  = OpenSSL::PKey::RSA.new(File.read(File.join(CERT_DIR, "transport.key")))
transport_cert = OpenSSL::X509::Certificate.new(File.read(File.join(CERT_DIR, "transport.pem")))

payload = {
  "exp": Time.now.to_f + (60 * 5),
  "scope": "openid accounts payments fundsconfirmations",
  "redirect_uris": config["redirect_uris"],
  "grant_types": [
    "authorization_code",
    "refresh_token",
    "client_credentials"
  ],
  "response_types": [
    "code id_token"
  ],
  "software_statement":              ssa,
  "token_endpoint_auth_method":      "private_key_jwt",
  "token_endpoint_auth_signing_alg": "RS256",
  "id_token_signed_response_alg":    "RS256",
  "request_object_signing_alg":      "RS256",
  "request_object_encryption_alg":   "RSA-OAEP-256",
  "request_object_encryption_enc":   "A128CBC-HS256"
}.to_json

jwt = RestClient::Request.execute(
  method: :post,
  url:    "https://jwkms.ob.forgerock.financial:443/api/crypto/signClaims",
  headers: {
    'Content-Type': 'application/json',
    'issuerId':     software_statement_id
  },
  payload: payload,
  ssl_client_cert: transport_cert,
  ssl_client_key:  transport_key
).to_s

begin
  response = RestClient::Request.execute(
    method: :post,
    url: 'https://matls.as.aspsp.ob.forgerock.financial:443/open-banking/registerTPP',
    payload: jwt,
    headers: { 'Content-Type': 'application/jwt' },
    ssl_client_cert: transport_cert,
    ssl_client_key: transport_key
  )
rescue => error
  puts "#{error.class}: #{error.message}"
  response = error.response.body
end

pp response
pp JSON.parse(response)

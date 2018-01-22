Client      = require("node-rest-client").Client;
NodeRSA     = require("node-rsa");
fs          = require("fs");
credentials = require("./credentials.json")

key     = new NodeRSA(fs.readFileSync("private.pem"), 'private');
client  = new Client();

function signedHeaders(url, method, params) {
  expires_at = Math.floor(new Date().getTime() / 1000 + 60)
  payload    = expires_at + "|" + method + "|" + url + "|"

  if (method == "POST") { payload += JSON.stringify(params) }

  return {
    "Accept":         "application/json",
    "Content-Type":   "application/json",
    "App-id":         credentials.app_id,
    "Secret":         credentials.service_secret,
    "Expires-at":     expires_at,
    "Signature":      key.sign(payload, "base64")
  }
}

url = "https://www.saltedge.com/api/v4/countries"
client.get(url, { headers: signedHeaders(url, "GET") }, function (data, response) {
  console.log(data);
});


url    = "https://www.saltedge.com/api/v4/customers"
params = {
  data: {
    identifier: "my_unique_sdidentifier"
  }
}

client.post(url, { headers: signedHeaders(url, "POST", params), data: params }, function (data, response) {
  console.log(data);
});


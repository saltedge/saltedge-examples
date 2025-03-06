var fs          = require("fs");
var credentials = require("./credentials.json");
var https       = require("https");
var util        = require("util");
var crypto      = require("crypto");

function signedHeaders(url, method, params) {
  expires_at = Math.floor(new Date().getTime() / 1000 + 60)
  payload    = expires_at + "|" + method + "|" + url + "|"

  if (method == "POST") { payload += JSON.stringify(params) }

  var privateKey = fs.readFileSync('private.pem');
  var signer = crypto.createSign('sha256');
  signer.update(payload);

  return {
    "Accept":       "application/json",
    "Content-Type": "application/json",
    "App-id":       credentials.app_id,
    "Secret":       credentials.secret,
    "Expires-at":   expires_at,
    "Signature":    signer.sign(privateKey,'base64'),
  }
}

// Use this function to verify signature in callbacks
// https://docs.saltedge.com/v6/#callbacks-request-identification
//
// signature - could be obtained from headers['signature']
// callback_url - url that you add in SE dashboard
// post_body - request body as string
function verifySignature(signature, callback_url, post_body) {
  payload = callback_url + "|" + post_body

  var publicKey = fs.readFileSync('../spectre_public.pem');
  var verifier = crypto.createVerify('sha256');
  verifier.update(payload);

  return verifier.verify(publicKey, signature,'base64');
}

function request(options) {
  options.headers = signedHeaders(options.url, options.method, options.data);

  return new Promise((resolve, reject) => {
    var req = https.request(options.url, options, (response) => {
      var chunks = [];

      response.on('data', chunk => chunks.push(chunk))
      response.on('end', ()=> {
        var data = Buffer.concat(chunks).toString();
        response.statusCode == 200 ? resolve(data) : reject(data);
      })
      response.on('error', ()=> {
        var data = Buffer.concat(chunks).toString();
        reject(data);
      })
    })


    if (options.data && options.method != "GET") {
      req.write(JSON.stringify(options.data));
    }

    req.end();
  });
}

url = "https://www.saltedge.com/api/v6/countries"

request({
  method:  "GET",
  url:     url
}).then((data)=> {
  console.log(data)
}).catch((data) => {
  console.error(data)
})


url    = "https://www.saltedge.com/api/v6/customers"
params = {
  data: {
    identifier: "my_unique_sdidentifier"
  }
}

request({
  method:  "POST",
  url:     url,
  data:    params
}).then((data)=> {
  console.log(data)
}).catch((data) => {
  console.error(data)
})

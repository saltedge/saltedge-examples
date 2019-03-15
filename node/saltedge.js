var NodeRSA     = require("node-rsa");
var fs          = require("fs");
var credentials = require("./credentials.json");
var https       = require("https");
var util        = require("util");

var key = new NodeRSA(fs.readFileSync("private.pem"), 'private');

function signedHeaders(url, method, params) {
  expires_at = Math.floor(new Date().getTime() / 1000 + 60)
  payload    = expires_at + "|" + method + "|" + url + "|"

  if (method == "POST") { payload += JSON.stringify(params) }

  return {
    "Accept":         "application/json",
    "Content-Type":   "application/json",
    "App-id":         credentials.app_id,
    "Secret":         credentials.secret,
    "Expires-at":     expires_at,
    "Signature":      key.sign(payload, "base64")
  }
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

url = "https://www.saltedge.com/api/v5/countries"

request({
  method:  "GET",
  url:     url
}).then((data)=> {
  console.log(data)
}).catch((data) => {
  console.error(data)
})


url    = "https://www.saltedge.com/api/v5/customers"
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


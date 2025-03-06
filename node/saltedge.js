const fs          = require("fs");
const https       = require("https");
const crypto      = require("crypto");
const credentials = require("./credentials.json");

function signedHeaders(url, method, params) {
  const expiresAt = Math.floor(new Date().getTime() / 1000 + 60);
  let payload     = expiresAt + "|" + method + "|" + url + "|";

  if (method === "POST") {
    payload += JSON.stringify(params);
  }

  const privateKey = fs.readFileSync("./private.pem");
  const signer     = crypto.createSign("sha256");

  signer.update(payload);
  signer.end();

  return {
    "Accept":       "application/json",
    "App-id":       credentials.app_id,
    "Content-Type": "application/json",
    "Expires-at":   expiresAt,
    "Secret":       credentials.secret,
    "Signature":    signer.sign(privateKey, "base64"),
  }
}

// Use this function to verify signature in callbacks. The verification can be performed on connect_session callbacks.
// https://docs.saltedge.com/v6/#callbacks-request-identification
//
// signature   - could be obtained from headers["signature"]
// callbackUrl - url that you add in SE dashboard, as example: https://client-app.com/aisp/callbacks/success
// postBody    - request body as string
//
// Example (server.js):
// const app        = require("express")();
// const bodyParser = require("body-parser");
//
// const callbackUrl = [callbackUrl];
// const port        = [port];
// app.post("/aisp/callbacks/success", function (req, res) {
//   verifySignature(req.headers.signature, callbackUrl, JSON.stringify(req.body))
//   res.end();
// });
// app.listen(port);

function verifySignature(signature, callbackUrl, postBody) {
  const payload = callbackUrl + "|" + postBody;

  const publicKey = fs.readFileSync("../spectre_public.pem");
  const verifier  = crypto.createVerify("sha256");

  verifier.update(payload);
  verifier.end();

  return verifier.verify(publicKey, signature, "base64");
}

function request(options) {
  options.headers = signedHeaders(options.url, options.method, options.data);

  return new Promise((resolve, reject) => {
    const req = https.request(options.url, options, (response) => {
      const chunks = [];

      response.on("data", chunk => chunks.push(chunk));
      response.on("end", () => {
        const data = Buffer.concat(chunks).toString();
        response.statusCode === 200 ? resolve(data) : reject(data);
      });
      response.on("error", () => {
        const data = Buffer.concat(chunks).toString();
        reject(data);
      });
    })

    if (options.data && options.method !== "GET") {
      req.write(JSON.stringify(options.data));
    }

    req.end();
  });
}

// get countries
let url = "https://www.saltedge.com/api/v6/countries"

request({
  method:  "GET",
  url:     url
}).then(data => console.log(data))
  .catch(data => console.error(data))

// create a customer
url    = "https://www.saltedge.com/api/v6/customers"
params = {
  data: {
    identifier: "my_unique_sdidentifier" // customer email
  }
}

request({
  method:  "POST",
  url:     url,
  data:    params
})
  .then(data => console.log(data))
  .catch(data => console.error(data))

// created customer data example:
// { "data": { "id": "[customer_id]", "identifier": "[customer_identifier]", "created_at": "2025-01-14T14:47:52Z", "updated_at": "2025-01-14T14:47:52Z", "secret": "[customer_secret]" } }

// create connect session (after create customer)
url = "https://www.saltedge.com/api/v6/connections/connect";

params = {
  data: {
    customer_id: "", // set customer id that was gotten after customer create
    consent: {
      scopes: ["accounts", "transactions"]
    },
    attempt: {
      return_to:    "https://www.example.com",
      fetch_scopes: ["accounts", "transactions"]
    },
    widget: {
      javascript_callback_type: "post_message" // We need to tell Salt Edge to use postMessage for callback notifications
    },
    provider: {
      include_sandboxes: true
    }
  }
}

request({
  method: "POST",
  url:    url,
  data:   params
}).then(data => console.log(data))
  .catch(data => console.error(data))

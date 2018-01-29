Example of integrating Salt Edge API with Node JS.
Note, right after you clone this code, you should generate RSA key pair as described in [docs.saltedge.com](https://docs.saltedge.com/guides/signature/)
Then paste private key's content into private.pem and create `credentials.json` with the following content:

```
{
  "app_id": "YOUR_APP_ID",
  "secret": "YOUR_SECRET"
}


```bash
$ cd saltedge-examples/node
$ npm install
$ node saltedge.js
```

# Example of integrating Salt Edge API with Node JS.

After you clone this code, you should:

1. Generate your private.pem and public.pem as described in [docs.saltedge.com](https://docs.saltedge.com/guides/signature/).

2. Put the public key content in your [dashboard](https://www.saltedge.com/keys_and_secrets).

3. Move to node example folder: `cd saltedge-examples/node`.

4. Paste private key's content into private.pem.

5. Put App Id and secret in `credentials.json`.

6. Run commands:
```bash
$ npm install
$ node saltedge.js
```

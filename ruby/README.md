Example of integrating Salt Edge API with Ruby.

```
api = Saltedge.new("CLIENT_ID", "SERVICE_SECRET", "private_pem_path")
api.request("GET", "https://www.saltedge.com/api/v2/countries")
api.request("POST", "https://www.saltedge.com/api/v2/customers/", {"data" => {"identifier" => "my_unique_identifier"}})
```
If you get Exception: SSL_connect returned=1 errno=0 state=SSLv3 read server hello A: sslv3 alert handshake failure (OpenSSL::SSL::SSLError), try updating to rest-client 1.8.3
And here is a link to our [documentation](https://docs.saltedge.com/), where you can find step-by-step instructions.
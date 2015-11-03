Example of integrating Salt Edge API with Ruby.

```
api = Saltedge.new("CLIENT_ID", "SERVICE_SECRET", "private_pem_path")
api.request("GET", "https://www.saltedge.com/api/v2/countries")
api.request("POST", "https://www.saltedge.com/api/v2/customers/", {"data" => {"identifier" => "my_unique_identifier"}})
```

And here is a link to our [documentation](https://docs.saltedge.com/), where you can find step-by-step instructions.
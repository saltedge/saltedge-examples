Example of integrating Salt Edge API with Ruby.
Note, right after you clone this code, you should generate your private.pem and public.pem as described in [docs.saltedge.com](https://docs.saltedge.com/guides/signature/) and put the public key content in your [dashboard](https://www.saltedge.com/keys_and_secrets)

```
api = Saltedge.new("APP_ID", "SECRET", "private_pem_path")
api.request(:get, "https://www.saltedge.com/api/v4/countries")
api.request(:post, "https://www.saltedge.com/api/v4/customers/", {"data" => {"identifier" => "my_unique_identifier"}})
```

And here is a link to our [documentation](https://docs.saltedge.com/), where you can find step-by-step instructions.

# NOTE
Please note that Rails’ default json encoder (`anything#to_json`) escapes some chars when generating json.

This is important because it might generate an invalid request signature in cases when data contains the ‘&’ character.

Use `JSON.generate` or `.to_json_without_active_support_encoder` when generating request signature.

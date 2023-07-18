Sure! Let's add the example of the success type of callback with the provided parameters to the `README.md`.

## Usage

### Starting the Server

Run the Sinatra application to start the server:

```
ruby app.rb
```

The server will be accessible at `http://localhost:9292`.

### API Callbacks

The application provides an API endpoint to receive incoming POST requests with different types of data.

#### Endpoint

```
POST /api/callbacks/:type
```

- `:type`: Specify the type of callback. This can be any string value representing the type of notification you want to receive. The full list of callback types can be found [here](https://docs.saltedge.com/account_information/v5/#callbacks).

#### Signature Verification

Before processing the incoming request, the application verifies the authenticity of the request using RSA signature verification. The signature is expected to be sent in the request headers as `HTTP_SIGNATURE`.

The verification process involves the following steps:

1. The application reads the request body.
2. Constructs a `signature_body` string using the request body and the current server address (`http://<server_address>:9292`).
3. Verifies the signature using the provided `public.pem` file in the root directory of the project.

If the signature verification fails, the server responds with a `400 Bad Request` status and logs a message indicating the failure. Otherwise, it proceeds to process the request.

### Example Request

Assuming the server is running on `http://localhost:9292`, you can send a POST request with a specific type of data and its corresponding signature as follows:

**Example of Success Type of Callback:**

```bash
curl -X POST \
  http://localhost:9292/api/callbacks/success \
  -H 'Content-Type: application/json' \
  -H 'Signature: <your_signature_here>' \
  -d '{
    "data": {
      "connection_id": "111111111111111111",
      "customer_id": "222222222222222222",
      "custom_fields": { "key": "value" },
      "stage": "finish"
    },
    "meta": {
      "version": "5",
      "time": "2023-07-03T08:45:32.233Z"
    }
  }'
```

Replace `<your_signature_here>` with the actual signature of the request.

In this example, the `data` field contains information about the successful callback with the following parameters:

- `connection_id`: The unique ID representing the connection related to this callback.
- `customer_id`: The unique ID representing the customer related to this callback.
- `custom_fields`: Additional custom fields associated with the callback (in this example, it contains a single key-value pair).
- `stage`: The stage of the callback, which is "finish" in this case.

The `meta` field provides additional metadata about the callback:

- `version`: The version of the callback (in this example, it's version "5").
- `time`: The timestamp when the callback occurred, represented in ISO 8601 format.

## Important Notes

1. This is a basic example of signature verification; in a real-world scenario, you might need to add additional security measures.

Example of how to configure your server for Mutual TLS. This will let you verify that incoming request was made from `Spectre API`

# Usage
1. Install Docker
2. Get or create your own CA certificate and place it under certs directory.
3. Generate server private key and certificate and place it under certs directory.
4. Generate client private key and certificate and place it under certs directory.
5. Build docker image and run it using: `docker build -t mutual-nginx . && docker run -p 4433:443 -p 8080:80 mutual-nginx`
6. Now you have configured nginx with mutual authentication enabled on your localhost on port 4433.

## How to create you own CA (Certificate Authority)
If you do not have any issued CA certificate. You can create own by your own.

```
openssl genrsa -des3 -out ca.key 4096
openssl req -new -x509 -days 365 -key ca.key -out ca.crt
```

## How to generate server private key and certificate
1. Generate CSR request:

    ```
    openssl genrsa -out server.key 4096
    openssl req -new -key server.key -out server.csr
    ```
2. Use CA to generate server certificate using CSR:

    ```
    openssl x509 -req -days 365 -in server.csr -CA ca.crt -CAkey ca.key -set_serial 01 -out server.crt
    ```

    If you create private key with a pass phrase add this pass phrase to keys.txt
## How to generate client private key and certificate
1. Generate CSR request:

    ```
    openssl genrsa -out client.key 2048
    openssl req -new -key client.key -out client.csr
    ```
2. Use CA to generate client certificate using CSR:

    ```
    openssl x509 -req -days 365 -in client.csr -CA ca.crt -CAkey ca.key -set_serial 01 -out client.crt
    ```


## How to test mutual TLS
You can make a request using client certificate and private key. If client certificate was generated using same CA certificate as prompted in `nginx.conf` `ssl_client_certificate` you will get a status `200 OK`

`curl -v -k --key certs/correct_client.key --cert certs/correct_client.crt https://localhost:4433/success`

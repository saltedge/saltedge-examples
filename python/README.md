# Salt Edge API Python3 Example
---
This is a basic example on how to use Salt Edge API with Python3.

## Install python dependencies

```sh
sudo pip3.9 install -r pip3-requirements.txt
```

## Generate openssl keys

Generate private.pem and public.pem as described in [docs.saltedge.com](https://docs.saltedge.com/guides/signature/).

```sh
openssl genrsa -out private.pem 2048
openssl rsa -pubout -in private.pem -out public.pem
```

## Create application

1. Create an API key with type *Service* in your [client dashboard](https://www.saltedge.com/clients/profile/secrets).
2. Add generated `public.pem` content to the API key in your client dashboard.
2. Set `APP_ID` and `SECRET` inside `credentials.py` in accordance with the API key settings.

## Run examples

```sh
python3.9 get_request.py
python3.9 post_request.py
python3.9 put_request.py
```

Note: Prior running `put_request.py`, create a connect session and assign a value of a *connection ID* from [client dashboard](https://www.saltedge.com/clients/logins) to `CONNECTION_ID` inside `credentials.py`.

More on [Salt Edge Docs](https://docs.saltedge.com/)


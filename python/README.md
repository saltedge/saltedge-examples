Example of integrating Salt Edge API with Python.
Note, right after you clone this code, you should generate your private.pem and public.pem as described in [docs.saltedge.com](https://docs.saltedge.com/guides/signature/) and put the public key content in your [dashboard](https://www.saltedge.com/keys_and_secrets)

### Install python dependencies

```sh
sudo pip3.6 install -r pip3-requirements.txt
```

### Generate openssl keys

```sh
openssl genrsa -out private.pem 2048
openssl rsa -pubout -in private.pem -out public.pem
```

### Run examples

```sh
python3.6 get_request.py
python3.6 post_request.py
```

More on [Spectre Documentation](https://docs.saltedge.com/)

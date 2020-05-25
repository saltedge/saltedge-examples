import OpenSSL.crypto as crypto
import requests
import base64
import time


class SaltEdge:
    digest = "sha256"

    @classmethod
    def verify(cls, path_to_public_key, message, signature):
        """
        Verifies the signature on a message.
        :param path_to_public_key: string, Absolute or relative path to Spectre public key
        :param message: string, The message to verify.
        :param signature: string, The signature on the message.
        :return:
        """
        x509 = crypto.X509()
        with open(path_to_public_key, "r") as public_key_data:
            public_key = crypto.load_publickey(crypto.FILETYPE_PEM, public_key_data)
        x509.set_pubkey(public_key)

        try:
            crypto.verify(x509, base64.b64decode(signature), message, cls.digest)
            return True
        except crypto.Error:
            return False

    def __init__(self, app_id, secret, private_path):
        self.app_id = app_id
        self.secret = secret

        with open(private_path, "rb") as private_key:
            keydata = private_key.read()

        self._private_key = crypto.load_privatekey(crypto.FILETYPE_PEM, keydata)

    def sign(self, message):
        """
        Signs a message.
        :param message: string, Message to be signed.
        :return: string, The signature of the message for the given key.
          """
        return base64.b64encode(crypto.sign(self._private_key, message, self.digest))

    def generate_signature(self, method, expire, some_url, payload=""):
        """
        Generates base64 encoded SHA256 signature of the string given params, signed with the client's private key.
        :param method: uppercase method of the HTTP request. Example: GET, POST, PATCH, PUT, DELETE, etc.;
        :param expire: request expiration time as a UNIX timestamp in UTC timezone. Recommended value is 1 minute from now. The maximum value is 1 hour from now.
        :param some_url: the full requested URL, with all its complementary parameters;
        :param payload: the request post body. Should be left empty if it is a GET request, or the body is empty;
        :return: base64 encoded SHA1 signature
        """
        message = "{expire}|{method}|{some_url}|{payload}".format(**locals())
        return self.sign(message)

    def generate_headers(self, expire):
        return {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Expires-at": expire,
            "App-id": self.app_id,
            "Secret": self.secret,
        }

    def expires_at(self):
        return str(time.time() + 60)

    def get(self, some_url):
        expire = self.expires_at()
        headers = self.generate_headers(expire)
        headers["Signature"] = self.generate_signature("GET", expire, some_url)
        return requests.get(some_url, headers=headers)

    def post(self, some_url, payload):
        expire = self.expires_at()
        headers = self.generate_headers(expire)
        headers["Signature"] = self.generate_signature(
            "POST", expire, some_url, payload
        )
        return requests.post(some_url, data=payload, headers=headers)

    def put(self, some_url, payload):
        expire = self.expires_at()
        headers = self.generate_headers(expire)
        headers["Signature"] = self.generate_signature("PUT", expire, some_url, payload)
        return requests.put(some_url, data=payload, headers=headers)

    def delete(self, some_url, payload):
        expire = self.expires_at()
        headers = self.generate_headers(expire)
        headers["Signature"] = self.generate_signature(
            "DELETE", expire, some_url, payload
        )
        return requests.delete(some_url, data=payload, headers=headers)

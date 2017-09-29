import OpenSSL.crypto as crypto
import requests
import base64
import time


class PEMKeyLoader:
    @staticmethod
    def load_public_key(path_to_file):
        """
        :param path_to_file: string
        :return: OpenSSL.crypto.PKey, The private key to verify with.
        """
        with open(path_to_file, "rb") as public_key:
            keydata = public_key.read()
        public_key = crypto.load_publickey(crypto.FILETYPE_PEM, keydata)
        return public_key

    @staticmethod
    def load_private_key(path_to_file):
        """
        :param path_to_file: string
        :return: OpenSSL.crypto.PKey, The private key to verify with.
        """
        with open(path_to_file, "rb") as private_key:
            keydata = private_key.read()
        private_key = crypto.load_privatekey(crypto.FILETYPE_PEM, keydata)
        return private_key


class SaltEdge:
    digest = "sha1"

    def __init__(self, client_id, service_secret, private_path, public_path):
        self.client_id = client_id
        self.service_secret = service_secret
        self._public_key = PEMKeyLoader.load_public_key(public_path)
        self._private_key = PEMKeyLoader.load_private_key(private_path)

    def sign(self, message):
        """
        Signs a message.
        :param message: string, Message to be signed.
        :return: string, The signature of the message for the given key.
          """
        return base64.b64encode(crypto.sign(self._private_key, message, self.digest))

    def generate_signature(self, method, expire, some_url, payload=""):
        """
        Generates base64 encoded SHA1 signature of the string given params, signed with the client's private key.
        :param method:  uppercase method of the HTTP request. Example: GET, POST, PATCH, PUT, DELETE, etc.;
        :param expire:  the full requested URL, with all its complementary parameters;
        :param some_url: the request post body. Should be left empty if it is a GET request, or the body is empty;
        :param payload: the uploaded file digested through MD5 algorithm. Should be left empty if it is a GET request, or no file uploaded.
        :return: base64 encoded SHA1 signature
        """
        message = "{expire}|{method}|{some_url}|{payload}".format(**locals())
        return self.sign(message)

    def verify(self, message, signature):
        """
        Verifies the signature on a message.
        :param message: string, The message to verify.
        :param signature: string, The signature on the message.
        :return:
        """
        return crypto.verify(self._public_key, base64.b64decode(signature), message, self.digest)

    @staticmethod
    def expires_at():
        return str(time.time() + 60)

    def get(self, some_url):
        expire = self.expires_at()
        headers = {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Signature': self.generate_signature("GET", expire, some_url),
            'Expires-at': expire,
            'Client-id': self.client_id,
            'Service-secret': self.service_secret
        }
        return requests.get(some_url, headers=headers)

    def post(self, some_url, payload):
        expire = self.expires_at()
        headers = {
            'accept': 'application/json',
            'content-type': 'application/json',
            'Signature': self.generate_signature("POST", expire, some_url, payload),
            'Expires-at': expire,
            'Client-id': self.client_id,
            'Service-secret': self.service_secret
        }
        return requests.post(some_url, data=payload, headers=headers)

    def put(self, some_url, payload):
        expire = self.expires_at()
        headers = {
            'accept': 'application/json',
            'content-type': 'application/json',
            'Signature': self.generate_signature("POST", expire, some_url, payload),
            'Expires-at': expire,
            'Client-id': self.client_id,
            'Service-secret': self.service_secret
        }
        return requests.put(some_url, data=payload, headers=headers)

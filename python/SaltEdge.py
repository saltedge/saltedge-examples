import Crypto.Signature.PKCS1_v1_5 as PKCS1_v1_5
import Crypto.PublicKey.RSA as RSA
import Crypto.Hash.SHA as SHA

import requests
import base64
import time


class SaltEdge:
    def __init__(self, client_id, service_secret, private_path, public_path):
        self.client_id = client_id
        self.service_secret = service_secret
        self.private_key = RSA.importKey(open(private_path).read())
        self.public_key = RSA.importKey(open(public_path).read())

    @staticmethod
    def expires_at():
        return int(time.time() + 60)

    def sign(self, string):
        signer = PKCS1_v1_5.new(self.private_key)
        string = SHA.new(string)
        return base64.b64encode(signer.sign(string))

    def verify(self, string, signature):
        verifier = PKCS1_v1_5.new(self.public_key)
        return verifier.verify(SHA.new(string), base64.b64decode(signature))

    def generate_signature(self, method, expire, some_url, payload=""):
        string = "{expire}|{method}|{some_url}|{payload}".format(**locals())
        return self.sign(string)

    def get(self, some_url):
        expire = self.expires_at()
        headers = {
            'Accept': 'application/json',
            'Content-type': 'application/json',
            'Signature': '%s' % self.generate_signature("GET", expire, some_url),
            'Expires-at': '%s' % expire,
            'Client-id': '%s' % self.client_id,
            'Service-secret': '%s' % self.service_secret
        }
        return requests.get(some_url, headers=headers)

    def post(self, some_url, payload):
        expire = self.expires_at()
        headers = {
            'accept': 'application/json',
            'content-type': 'application/json',
            'Signature': '%s' % self.generate_signature("POST", expire, some_url, payload),
            'Expires-at': '%s' % expire,
            'Client-id': '%s' % self.client_id,
            'Service-secret': '%s' % self.service_secret
        }
        return requests.post(some_url, data=payload, headers=headers)

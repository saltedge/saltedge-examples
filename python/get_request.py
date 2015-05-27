from SaltEdge import SaltEdge

app = SaltEdge('client-id', 'service-secret', 'private.pem', 'public.pem')

url = 'https://www.saltedge.com/api/v2/countries'
response = app.get(url)
data = response.json()
print data
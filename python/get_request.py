from saltedge import SaltEdge

app = SaltEdge('client-id', 'service-secret', 'private.pem', 'public.pem')

url = 'https://www.saltedge.com/api/v3/countries'
response = app.get(url)
data = response.json()
print(data)

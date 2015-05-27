from SaltEdge import SaltEdge

app = SaltEdge('client_id', 'service_secret')

url = 'https://www.saltedge.com/api/v2/countries'
response = app.get(url)
data = response.json()
print data
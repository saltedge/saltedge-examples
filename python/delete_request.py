from saltedge import SaltEdge

app = SaltEdge("client-id", "service-secret", "private.pem")

url = "https://www.saltedge.com/api/v5/connections/1234"
response = app.delete(url)
data = response.json()
print(data)

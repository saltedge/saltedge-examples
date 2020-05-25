from saltedge import SaltEdge
import json

app = SaltEdge("app-id", "service-secret", "./private.pem")

url = "https://www.saltedge.com/api/v5/connections/1234/refresh"
payload = json.dumps({"data": {"fetch_type": "recent"}})
response = app.put(url, payload)
data = response.json()
print(data)

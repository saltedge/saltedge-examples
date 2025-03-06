from saltedge import SaltEdge
from credentials import APP_ID, SECRET, PRIVATE_KEY_PATH, CONNECTION_ID
import json

app = SaltEdge(APP_ID, SECRET, PRIVATE_KEY_PATH)

url      = f"https://www.saltedge.com/api/v6/connections/{CONNECTION_ID}/refresh"
payload  = json.dumps({"data": {"attempt": {"fetch_scopes": ["accounts", "transactions"]}}})
response = app.request("post", url, payload)
data     = response.json()

print(data)

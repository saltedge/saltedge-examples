from saltedge import SaltEdge
from credentials import APP_ID, SECRET, PRIVATE_KEY_PATH, CONNECTION_ID
import json

app = SaltEdge(APP_ID, SECRET, PRIVATE_KEY_PATH)

url      = f"https://www.saltedge.com/api/v5/connections/{CONNECTION_ID}/refresh"
payload  = json.dumps({"data": {"fetch_type": "recent"}})
response = app.request("put", url, payload)
data     = response.json()

print(data)

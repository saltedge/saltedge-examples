from saltedge import SaltEdge
from credentials import APP_ID, SECRET, PRIVATE_KEY_PATH
import json

app = SaltEdge(APP_ID, SECRET, PRIVATE_KEY_PATH)

url      = "https://www.saltedge.com/api/v5/customers/"
payload  = json.dumps({ "data": { "identifier": "some_uniq_identifier" } })
response = app.request("post", url, payload)
data     = response.json()

print(data)

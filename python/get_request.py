from saltedge import SaltEdge
from credentials import APP_ID, SECRET, PRIVATE_KEY_PATH

app = SaltEdge(APP_ID, SECRET, PRIVATE_KEY_PATH)

url      = "https://www.saltedge.com/api/v6/countries"
response = app.request("get", url)
data     = response.json()

print(data)

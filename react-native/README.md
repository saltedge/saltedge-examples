# Salt Edge React Native Example

This is a basic example on how to use Salt Edge Connect with React Native.

## Assumptions

This example assumes that you use Salt Edge without a backend (directly from mobile app).
In case you do have a backend:
- API keys should not be stored on the device, but on backend, the latter acting as a proxy for API requests between the mobile app and Salt Edge API
- After having a customer created, the https://www.saltedge.com/api/v6/connections/connect endpoint should be called with `customer_id` in request body.

## Prerequisites

1. Create an API key with type "App" in your [client dashboard](https://www.saltedge.com/clients/api_keys)
2. Put App Id and secret in `credentials.json`
3. Create a customer using `request` function from `saltedge.js`
4. Put customer id in component state

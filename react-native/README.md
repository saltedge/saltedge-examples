# Salt Edge React Native Example

This is a basic example on how to use Salt Edge Connect with React Native.

## Assumptions

This example assumes that you use Salt Edge without a backend (directly from mobile app).
After having a customer created, the https://www.saltedge.com/api/v5/connect_sessions/create endpoint should be called with `customer_id` in request body.
In case you do have a backend:
- API keys should not be stored on the device, but on backend, the latter acting as a proxy for API requests between the mobile app and Salt Edge API

## Prerequisites

1. Create an API key with type "Service" in your [client dashboard](https://www.saltedge.com/clients/profile/secrets)
2. Put App Id and secret in `credentials.json`
3. Create a customer using `request` function from `saltedge.js`
4. Put customer id in component state

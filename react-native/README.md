# Salt Edge React Native Example

This is a basic example on how to use Salt Edge Connect with React Native.

## Assumptions

This example assumes that you use Salt Edge without a backend (directly from mobile app).
In case you do have a backend:
- the API key type that you use should be "Service" (see https://www.saltedge.com/clients/profile/secrets), and headers `Customer-Secret` and `Login-Secret` are not required for Authentication.
- API keys should not be stored on the device, but on backed, the latter acting as a proxy for API requests between the mobile app and Salt Edge API
- After having a customer created, the https://www.saltedge.com/api/v5/connect_sessions/create endpoint should be called with `customer_id` in request body, instead of having it set in headers.

## Prerequisites

1. Create an API key with type "App" in your [client dashboard](https://www.saltedge.com/clients/profile/secrets)
2. Put App Id and secret in `credentials.json`
3. Create a customer using `request` function from `saltedge.js`
4. Put customer secret in component state

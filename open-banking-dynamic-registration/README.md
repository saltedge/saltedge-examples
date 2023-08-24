# Open Banking Dynamic Registration
Implementation is based on Open Banking Specification of the Dynamic Client Registration [documentation](https://openbanking.atlassian.net/wiki/spaces/DZ/pages/937066600/Dynamic+Client+Registration+-+v3.1).
## Requirements

> **Everything (except the private keys) can be found on the software statement page!**

- Organization ID
- Software Statement ID
- Signing Key + Signing Certificate + Signing Key ID
- Transport Key + Transport Certificate + Transport Key ID
- SSA
- Your software scopes (AIS/PIS)
- Your redirect URIs

## Setup

1. Add all keys and certificates:
  1. Put your private signing key into the `cert` directory with the name `signing.key`
  2. Put your private transport key into the `cert` directory with the name `transport.key`
  3. Put your public signing certificate into the `cert` directory with the name `signing.pem`
  4. Put your public transport certificate into the `cert` directory with the name `transport.pem`
2. Generate an SSA on your software statement page and put its contents inside the `cert` directory
   in a file called `ssa.jwt`
3. Open `config.yml` and replace all values with correct ones
4. Edit the `main.rb` file:
  1. Replace `<openid-config.issuer>` with the `.well-known/openid-configuration`
      value for the `issuer` key of your ASPSP
  2. Replace `<openid-config.registration_endpoint>` with the `.well-known/openid-configuration`
      value for the `registration_endpoint` key of your ASPSP
  3. [OPTIONAL] Change the `token_endpoint_auth_method` inside the params if your ASPSP does
      not support `tls_client_auth`
5. Install dependencies: `$ bundle install`

## Registration

1. Run the script: `$ ruby main.rb`
2. Save the output of the program into a file.

> If there is an error when making the registration the request, the error is caught and you'll
> be put in a `pry` session. The error will be available for inspection under the `error` name.
> To see the response received from the ASPSP you can use `error.response.body` etc.

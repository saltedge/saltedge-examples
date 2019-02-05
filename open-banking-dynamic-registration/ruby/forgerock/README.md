## Setup

1. Open `certificates/config.yml` and replace all field values with your own (real) ones
2. Replace the contents of `certificates/sign.key` with the contents of your private signing key
3. Replace the contents of `certificates/transport.key` with the contents of your private transport key
4. Replace the contents of `certificates/sign.pem` with the contents of your signing certificate
5. Replace the contents of `certificates/transport.pem` with the contents of your transport certificate
6. Replace the contents of `certificates/SSA` with the contents of your Software Statement Assertion
7. Install bundler (if needed): `gem install bundler`
8. Install dependencies: `bundle`

## Registration

1. Run script `ruby main.rb`
2. Extract and save your Client ID and Client Secret from the console output.

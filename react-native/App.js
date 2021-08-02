import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { request, SEWebView } from './saltedge'

export default class App extends React.Component {
  constructor(props) {
    super(props)

    // NOTE: Customer secret is returned when you create a customer using
    // https://docs.saltedge.com/v5_apps/reference/#customers-create
    // https://docs.saltedge.com/general/#authentication

    this.state = {
      connecting:     false,
      customerSecret: ''
    }
  }

  onApiResponse(data) {
    this.setState({connecting: false})

    if (data.error_class) {
      this.setState({
        error:         true,
        error_class:   data.error_class,
        error_message: data.error_message
      })
    } else if (data.data.connect_url) {
      this.setState({
        connect_url: data.data.connect_url
      })
    } else {
      console.log(data)
    }
  }

  onConnect() {
    this.setState({connecting: true})

    request("https://www.saltedge.com/api/v5/connect_sessions/create", {
      method:         "POST",
      customerSecret: this.state.customerSecret,
      body: {
        data: {
          // We need to tell Salt Edge to use postMessage for callback notifications
          javascript_callback_type: 'post_message',
          consent: {
            scopes: ['account_details', 'transactions_details']
          },
          attempt: {
            return_to: "saltedge://sdk.example",
            fetch_scopes: ["accounts", "transactions"]
          },
          include_fake_providers: true
        }
      }
    }).then(this.onApiResponse.bind(this))
    .catch(error => console.error(error))
  }

  onCallback(data) {
    // {"data":{"login_id":"111","stage":"fetching","secret":"SECRET","custom_fields":{}}}
    // {"data":{"login_id":"111","stage":"success","secret":"SECRET","custom_fields":{}}}

    this.setState({
      login: data.data,
      stage: data.data.stage
    })
  }

  currentScreen() {
    if (this.state.connecting) {
      return <Text>Connecting...</Text>
    } else if (this.state.error) {
      return <Text>{this.state.error_class}: {this.state.error_message}</Text>
    } else if (this.state.stage == "success") {
      return (
        // NOTE: To retrieve login data, you need to call `request` function
        // with loginSecret set to this.state.login.secret, eg:
        // request("https://www.saltedge.com/api/v5/accounts", {
        //   method:         "GET",
        //   customerSecret: this.state.customerSecret,
        //   loginSecret:    this.state.login.secret
        // })

        <Text>
          Login with id {this.state.login.login_id} connected. You can now use it
          to query the API and retrieve its accounts and transactions.
          See https://docs.saltedge.com/v5_apps/reference/#accounts.
        </Text>
      )
    } else if (this.state.stage == "error") {
      return <Text>Connect failed.</Text>
    } else if (this.state.connect_url) {
      return <SEWebView
        url={this.state.connect_url}
        onCallback={this.onCallback.bind(this)}
      />
    } else {
      return <Button
        onPress={this.onConnect.bind(this)}
        title="Connect"
      />
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.currentScreen()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { request, SEWebView } from "./saltedge"

export default class App extends React.Component {
  constructor(props) {
    super(props)

    // NOTE: Customer id is returned when you create a customer using
    // https://docs.saltedge.com/v6/#authentication
    // https://docs.saltedge.com/v6/api_reference#ais-customers-create

    this.state = {
      connecting: false,
      customerId: "" // Set customer id after Customer creation
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
    }
    else if (data.connect_url) {
      this.setState({
        connect_url: data.connect_url
      })
    }
    else {
      console.log(data)
    }
  }

  onConnect() {
    this.setState({connecting: true})

    request("https://www.saltedge.com/api/v6/connections/connect", {
      method: "POST",
      body:   {
        data: {
          customer_id: this.state.customerId,
          consent:     {
            scopes: ["accounts", "transactions"]
          },
          attempt: {
            fetch_scopes: ["accounts", "transactions"],
            return_to:    "saltedge://sdk.example"
          },
          widget: {
            javascript_callback_type: "post_message" // We need to tell Salt Edge to use postMessage for callback notifications
          },
          provider: {
            include_sandboxes: true
          }
        }
      }
    }).then(this.onApiResponse.bind(this))
      .catch(error => console.error(error))
  }

  onCallback(data) {
    // {"data":{"connection_id":"111","stage":"fetching","customer_id":"111","custom_fields":{}}}
    // {"data":{"connection_id":"111","stage":"success","customer_id":"111","custom_fields":{}}}

    this.setState({
      login: data.data,
      stage: data.data.stage
    })
  }

  currentScreen() {
    if (this.state.connecting) {
      return <Text>Connecting...</Text>
    }

    if (this.state.error) {
      return <Text>{this.state.error_class}: {this.state.error_message}</Text>
    }

    if (this.state.stage == "success") {
      return (
        // NOTE: To retrieve login data, you need to call `request` function
        // with loginSecret set to this.state.login.secret, eg:
        // request("https://www.saltedge.com/api/v6/accounts", {
        //   method:        "GET",
        //   customer_id:   this.state.customerId,
        //   connection_id: this.state.login.connection_id
        // })

        <Text>
          Login with id {this.state.login.connection_id} connected. You can now use it
          to query the API and retrieve its accounts and transactions.
          See https://docs.saltedge.com/v6/api_reference#ais-accounts.
        </Text>
      )
    }

    if (this.state.stage == "error") {
      return <Text>Connect failed.</Text>
    }

    if (this.state.connect_url) {
      return <SEWebView
        url={this.state.connect_url}
        onCallback={this.onCallback.bind(this)}
      />
    }

    return <Button
      onPress={this.onConnect.bind(this)}
      title="Connect"
    />
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
    alignItems:      "center",
    backgroundColor: "#f4f8fa",
    flex:            1,
    justifyContent:  "center"
  },
});

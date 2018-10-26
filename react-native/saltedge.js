import React from 'react';
import { WebView, StyleSheet, Dimensions } from 'react-native';
import credentials from './credentials.json'

export function request(url, options) {
  var fetchOptions = {
    method: options.method,
    headers: {
      'Accept':          'application/json',
      'Content-Type':    'application/json',
      'App-Id':          credentials.app_id,
      'Secret':          credentials.secret,
    }
  }

  if (options.customerSecret) {
    fetchOptions.headers['Customer-Secret'] = options.customerSecret
  }

  if (options.loginSecret) {
    fetchOptions.headers['Login-Secret'] = options.loginSecret
  }

  if (options.method != 'GET' && options.body) {
    fetchOptions.body = JSON.stringify(options.body)
  }

  return fetch(url, fetchOptions).then((response) => response.json())
}

export class SEWebView extends React.Component {
  onMessage(event) {
    if (!this.props.onCallback) {
      return
    }

    this.props.onCallback(JSON.parse(event.nativeEvent.data))
  }

  render() {
    return (
      <WebView style={styles.container}
        source={{uri: this.props.url}}
        onMessage={this.onMessage.bind(this)}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
});

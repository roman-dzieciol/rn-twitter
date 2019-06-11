import React from 'react';
import { Text, View, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { resolve } from 'uri-js';
import { commonStyles } from '../../styles/common';
import { TwitterAPI } from '../../api/Twitter';

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.twitter = new TwitterAPI();
  }

  componentDidMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = () => {
    this.twitter.needsLogin().then(needsLogin => {
      this.props.navigation.navigate(needsLogin ? 'Auth' : 'App');
    });
  };

  render() {
    return (
      <View style={commonStyles.containerCenter}>
        <ActivityIndicator animating="true" />
        <StatusBar barStyle="default" />
        <Text>Auth Loading...</Text>
      </View>
    );
  }
}

export default AuthLoadingScreen;

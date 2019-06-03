import React from 'react';
import { View, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { commonStyles } from '../../styles/common';

class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'Please sign in'
  };

  render() {
    return (
      <View style={commonStyles.containerCenter}>
        <Button title="Sign in" onPress={this.handleSignIn} />
      </View>
    );
  }

  handleSignIn = () => {
    this.props.navigation.navigate('App');
  };
}

export default SignInScreen;

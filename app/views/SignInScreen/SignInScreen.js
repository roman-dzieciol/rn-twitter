import React from 'react';
import { View, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { commonStyles } from '../../styles/common';
import styled from 'styled-components/native';

const StyledView = styled.View`
  background-color: papayawhip;
`;

class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'Please sign in'
  };

  render() {
    return (
      <StyledView style={commonStyles.containerCenter}>
        <Button title="Sign in" onPress={this.handleSignIn} />
      </StyledView>
    );
  }

  handleSignIn = () => {
    this.props.navigation.navigate('App');
  };
}

export default SignInScreen;

import React from "react";
import { View, Button } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import commonStyles from '../../styles/common';

class SignInScreen extends React.Component {
  static navigationOptions = {
    title: "Please sign in"
  };
  render() {
    return (
      <View style={commonStyles.containerCenter}>
        <Button title="Sign in" onPress={this._signInAsync} />
      </View>
    );
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem("userToken", "AAAAAAAAAAAAAAAAAAAAAKOQ%2BgAAAAAASwVXdWGaQCo7ZPpGvBwXF0hxKQ0%3Dmm0BfYqc9rJ2mVuzanywj99YmQu1X2l4gbVaFNO8dODGE46ZPM");
    this.props.navigation.navigate("App");
  };
}

export default SignInScreen;

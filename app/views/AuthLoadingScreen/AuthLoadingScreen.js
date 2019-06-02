import React from "react";
import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  StatusBar
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { resolve } from "uri-js";
import { commonStyles } from "../../styles/common";

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    //await new Promise((resolve) => { setTimeout(resolve, 2000) })
    const userToken = await AsyncStorage.getItem("userToken");
    this.props.navigation.navigate(userToken ? "App" : "Auth");
  };

  render() {
    return (
      <View style={commonStyles.containerCenter}>
        <ActivityIndicator animating="true"/>
        <StatusBar barStyle="default"/>
        <Text>Auth Loading...</Text>
      </View>
    );
  }
}

export default AuthLoadingScreen;

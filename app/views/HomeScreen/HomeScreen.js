import React from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Button,
  ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import commonStyles from "../../styles/common";
import Config from "react-native-config";
import { LoadingView } from '../../components'
import HomeList from "./HomeList.js";

const HomeListWithLoading = LoadingView(HomeList);

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "Welcome"
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: null
    };
  }

  render() {
    return (
      <HomeListWithLoading
        isLoading={this.state.isLoading}
        data={this.state.data}
      />
    );
  }

  componentDidMount() {
    this._fetchUserTimeline();
  }

  _fetchUserTimeline = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      const screenName = "twitterdev";
      const maxTweets = 11;
      const url = `${
        Config.TWITTER_API_URL
      }/statuses/user_timeline.json?screen_name=${screenName}&count=${maxTweets}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      if (response.ok) {
        const responseJson = await response.json();
        console.log(responseJson);

        this.setState(
          {
            isLoading: false,
            data: responseJson
          },
          function() {}
        );
      } else {
        throw new Error(`HTTP status: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate("Auth");
  };
}

export default HomeScreen;

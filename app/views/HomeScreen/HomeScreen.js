import React from 'react';
import { StyleSheet, FlatList, View, Fragment, Button, ActivityIndicator } from 'react-native';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-community/async-storage';
import { commonStyles } from '../../styles/common';
import { withLoadingView } from '../../components';
import HomeList from './HomeList.js';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { Twitter } from '../../api/Twitter';

const HomeListWithLoading = withLoadingView(HomeList);

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: null
    };
    this.twitter = new Twitter();
  }

  render() {
    return <HomeListWithLoading isLoading={this.state.isLoading} data={this.state.data} />;
  }

  componentDidMount() {
    this._fetchUserTimeline();
  }

  _fetchUserTimeline = () => {
    return this.twitter
      .fetchUserTimeline()
      .then(data => this.setState({ data }))
      .catch(error => console.error(error))
      .finally(() => this.setState({ isLoading: false }));
  };

  _logout = async () => {
    await this.twitter.logout();
    this.props.navigation.navigate('Auth');
  };
}

hoistNonReactStatic(HomeScreen, HomeListWithLoading);

export default HomeScreen;

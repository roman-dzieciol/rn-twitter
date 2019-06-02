import React from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Button,
  ActivityIndicator
} from "react-native";
import { commonStyles } from "../../styles/common";
import Config from "react-native-config";


class HomeList extends React.Component {
  static navigationOptions = {
    title: "Home"
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.data}
          renderItem={this._renderItem}
          keyExtractor={({ item }, index) => index.toString()}
        />
      </View>
    );
  }

  _renderItem = ({ item }) => {
    return <Text style={styles.item}>{item.text}</Text>;
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22
  },
  item: {
    fontSize: 18,
    height: 44,
    padding: 10
  }
});

export default HomeList;

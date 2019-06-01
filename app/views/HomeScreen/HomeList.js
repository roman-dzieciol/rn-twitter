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

class HomeList extends React.Component {
  static navigationOptions = {
    title: "Welcome"
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Home</Text>
        <FlatList
          data={this.props.data}
          renderItem={this._renderItem}
          keyExtractor={({ item }, index) => index.toString()}
        />
        <Button title="Logout" onPress={this._signOutAsync} />
      </View>
    );
  }

  _renderItem = ({ item }) => {
    return <Text style={styles.item}>{item.text}</Text>;
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate("Auth");
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44
  }
});

export default HomeList;

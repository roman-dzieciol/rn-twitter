import React from "react";
import { SafeAreaView } from "react-native";

const RootView = WrappedComponent => {
  return class RootView extends React.Component {
    render() {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ccc" }}>
          <WrappedComponent {...this.props} />
        </SafeAreaView>
      );
    }
  };
};

export default RootView;

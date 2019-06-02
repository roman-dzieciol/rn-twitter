import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import hoistNonReactStatic from 'hoist-non-react-statics';
import { COLOR_BACKGROUND_LIGHT } from '../styles/common'

const RootView = WrappedComponent => {
  class RootView extends React.Component {
    render() {
      return (
        <SafeAreaView style={styles.container}>
          <WrappedComponent {...this.props} />
        </SafeAreaView>
      );
    }
  };
  hoistNonReactStatic(RootView, WrappedComponent)
  return RootView
};
const styles = StyleSheet.create({
  container: { backgroundColor: COLOR_BACKGROUND_LIGHT, flex: 1 }
});

export default RootView;

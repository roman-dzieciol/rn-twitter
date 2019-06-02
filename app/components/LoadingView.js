import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import hoistNonReactStatic from 'hoist-non-react-statics';

function LoadingView(Component) {
  function LoadingView({ isLoading, ...props }) {
    if (!isLoading) {
      return <Component {...props} />;
    }

    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  };
  hoistNonReactStatic(LoadingView, Component)
  return LoadingView
}


const styles = StyleSheet.create({
  container: { alignItems: "center", flex: 1, justifyContent: "center" }
});

export default LoadingView;

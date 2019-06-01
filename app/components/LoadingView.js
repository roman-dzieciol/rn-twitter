import React from "react";
import { ActivityIndicator, View } from "react-native";

function LoadingView(Component) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (!isLoading) {
      return <Component {...props} />;
    }

    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  };
}

export default LoadingView;

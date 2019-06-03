import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { COLOR_BACKGROUND_LIGHT } from '../styles/common';

const withRootView = WrappedComponent => {
  const result = function(props) {
    return (
      <SafeAreaView style={styles.container}>
        <WrappedComponent {...props} />
      </SafeAreaView>
    );
  };
  hoistNonReactStatic(result, WrappedComponent);
  return result;
};
const styles = StyleSheet.create({
  container: { backgroundColor: COLOR_BACKGROUND_LIGHT, flex: 1 }
});

export default withRootView;

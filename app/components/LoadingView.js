import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import hoistNonReactStatic from 'hoist-non-react-statics';
import PropTypes from 'prop-types';

function withLoadingView(Component) {
  const Inner = ({ isLoading, ...rest }) => {
    if (!isLoading) {
      return <Component {...rest} />;
    }

    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  };

  Inner.defaultProps = {
    isLoading: true,
    rest: {}
  };

  Inner.propTypes = {
    isLoading: PropTypes.bool,
    rest: PropTypes.any
  };

  hoistNonReactStatic(Inner, Component);
  return Inner;
}

withLoadingView.propTypes = {
  Component: PropTypes.element
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', flex: 1, justifyContent: 'center' }
});

export default withLoadingView;

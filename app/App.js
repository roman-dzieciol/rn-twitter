import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import HomeScreen from './views/HomeScreen/HomeScreen.js';
import AuthLoadingScreen from './views/AuthLoadingScreen/AuthLoadingScreen.js';
import SignInScreen from './views/SignInScreen/SignInScreen.js';
import { withRootView } from './components';

const AppStack = createStackNavigator({ Home: withRootView(HomeScreen) });
const AuthStack = createStackNavigator({ SignIn: withRootView(SignInScreen) });

const AppNavigator = createSwitchNavigator(
  {
    AuthLoading: withRootView(AuthLoadingScreen),
    App: AppStack,
    Auth: AuthStack
  },
  {
    initialRouteName: 'AuthLoading'
  }
);

export default createAppContainer(AppNavigator);

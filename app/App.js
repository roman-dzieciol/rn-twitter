import {
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer
} from "react-navigation";
import HomeScreen from "./views/HomeScreen/HomeScreen.js";
import AuthLoadingScreen from "./views/AuthLoadingScreen/AuthLoadingScreen.js";
import SignInScreen from "./views/SignInScreen/SignInScreen.js";

const AppStack = createStackNavigator({ Home: HomeScreen });
const AuthStack = createStackNavigator({ SignIn: SignInScreen });

const AppNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack
  },
  {
    initialRouteName: "AuthLoading"
  }
);

export default createAppContainer(AppNavigator);

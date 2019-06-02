import {
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer,
} from "react-navigation";
import HomeScreen from "./views/HomeScreen/HomeScreen.js";
import AuthLoadingScreen from "./views/AuthLoadingScreen/AuthLoadingScreen.js";
import SignInScreen from "./views/SignInScreen/SignInScreen.js";
import { RootView } from "./components";

const AppStack = createStackNavigator({ Home: RootView(HomeScreen) });
const AuthStack = createStackNavigator({ SignIn: RootView(SignInScreen) });

const AppNavigator = createSwitchNavigator(
  {
    AuthLoading: RootView(AuthLoadingScreen),
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: "AuthLoading",
  },
);

export default createAppContainer(AppNavigator);

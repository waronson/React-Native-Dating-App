console.ignoredYellowBox = [
  'Setting a timer'
]

import {Platform} from 'react-native'
import { StackNavigator, DrawerNavigator } from 'react-navigation'
import ProfileViewScreen from '../Containers/ProfileViewScreen'
import ChatScreen from '../Containers/ChatScreen'
import MatchesScreen from '../Containers/MatchesScreen'
import ProfileScreen from '../Containers/ProfileScreen'
import HomeScreen from '../Containers/HomeScreen'
import LoginScreen from '../Containers/LoginScreen'
import SignupScreen from '../Containers/DrawerTests/SignupScreen'
import ForgottenPasswordScreen from '../Containers/DrawerTests/ForgottenPasswordScreen'
import Screen1 from '../Containers/DrawerTests/Screen1'
import Screen2 from '../Containers/DrawerTests/Screen2'
import Screen3 from '../Containers/DrawerTests/Screen3'

import styles from './Styles/NavigationStyles'

const DrawerStack = DrawerNavigator({
	homeScreen: { screen: HomeScreen },
	profileScreen: { screen: ProfileScreen },
	matchesScreen: { screen: MatchesScreen },
})

const drawerButton = (navigation) =>
  <Text
    style={{padding: 5, color: 'white'}}
    onPress={() => {
      if (navigation.state.index === 0) {
        navigation.navigate('DrawerOpen')
      } else {
        navigation.navigate('DrawerClose')
      }
    }
  }>Menu</Text>


const DrawerNavigation = StackNavigator({
  DrawerStack: { screen: DrawerStack },
  ChatScreen: { screen: ChatScreen },
  ProfileViewScreen: { screen: ProfileViewScreen },
}, {
  headerMode: 'float',
  navigationOptions: ({navigation}) => ({
    headerStyle: {backgroundColor: '#8fffce', marginTop: Platform.OS === 'android' ? 24 : 0},
    title: 'PairTree',
    headerTintColor: 'white',
    //gesturesEnabled: false,
    //headerLeft: drawerButton(navigation)
  })
})


// login stack
const LoginStack = StackNavigator({
  loginScreen: { screen: LoginScreen },
  signupScreen: { screen: SignupScreen },
  forgottenPasswordScreen: { screen: ForgottenPasswordScreen, navigationOptions: { title: 'Forgot Password' } }
}, {
  headerMode: 'hidden',
  navigationOptions: {
    headerStyle: {backgroundColor: '#E73536'},
    title: 'You are not logged in',
    headerTintColor: 'white'
  }
})


// Manifest of possible screens
const PrimaryNav = StackNavigator({
  loginStack: { screen: LoginStack },
  drawerStack: { screen: DrawerNavigation },
}, {
  // Default config for all screens
  headerMode: 'none',
  title: 'Main',
  initialRouteName: 'loginStack',
  /*navigationOptions: {
    headerMode: 'none',
	title: 'Main',
	initialRouteName: 'loginStack',
	transitionConfig: noTransitionConfig
  }*/
})

export default PrimaryNav

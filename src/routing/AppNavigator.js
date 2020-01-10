/* eslint-disable react/display-name */
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import HomeScreen from '../screens/HomeScreen'
import EditScreen from '../screens/EditScreen'

const HomeStack = createStackNavigator({
  Home: { screen: HomeScreen },
  Edit: { screen: EditScreen },
})

const AppNavigator = createSwitchNavigator({
  HomeStack: { screen: HomeStack },
})

export default createAppContainer(AppNavigator)

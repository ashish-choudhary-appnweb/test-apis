import 'react-native-gesture-handler'
import React from 'react'
import { View, StyleSheet } from 'react-native'

import AppNavigator from './src/routing/AppNavigator'

const App = () => {
  console.disableYellowBox = true
  return (
    <View style={style.container}>
      <AppNavigator />
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default App

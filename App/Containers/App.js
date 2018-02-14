import '../Config'
import DebugConfig from '../Config/DebugConfig'
import React, { Component } from 'react'
import * as firebase from 'firebase'
import { Provider } from 'react-redux'
import RootContainer from './RootContainer'
import createStore from '../Redux'

// create our store
const store = createStore()

const firebaseConfig = {
  apiKey: "AIzaSyCyMphbiB8-kuo5Xzp17W14AQH4K1WmcNo",
  authDomain: "philanthrodate.firebaseapp.com",
  databaseURL: "https://philanthrodate.firebaseio.com",
  storageBucket: "gs://philanthrodate.appspot.com"
}

firebase.initializeApp(firebaseConfig)

class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <RootContainer />
      </Provider>
    )
  }
}

// allow reactotron overlay for fast design in dev mode
export default DebugConfig.useReactotron
  ? console.tron.overlay(App)
  : App

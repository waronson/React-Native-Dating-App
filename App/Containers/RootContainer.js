import React, { Component } from 'react'
import { View, StatusBar, BackHandler } from 'react-native'
import ReduxNavigation from '../Navigation/ReduxNavigation'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import StartupActions from '../Redux/StartupRedux'

// Styles
import styles from './Styles/RootContainerStyles'

class RootContainer extends Component {
  componentDidMount () {
    this.props.startup()

    /*BackHandler.addEventListener("hardwareBackPress", () => {
      if (this.props.navigation.getCurrentRoutes().length > 1) {
        this.props.navigation.pop()
        return true // do not exit app
      } else {
        return false // exit app
      }
    })*/
    this.sub = BackHandler.addEventListener('hardwareBackPress', () =>
        this.props.onback()
    )
  }

  componentWillUnmount() {
    this.sub.remove()
  }

  render () {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle='light-content' />
        <ReduxNavigation />
      </View>
    )
  }
}

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup()),
  onback: () => dispatch(NavigationActions.back())
})

export default connect(null, mapDispatchToProps)(RootContainer)

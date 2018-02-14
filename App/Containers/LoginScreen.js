import Expo from 'expo'
import firebase from 'firebase'
import React, {Component} from 'react'
import {View, StyleSheet, ActivityIndicator} from 'react-native'
import {NavigationActions} from 'react-navigation'
import FacebookButton from '../Components/FacebookButton'
import { connect, bindActionCreators } from 'react-redux'
import PairTreeActions from '../Redux/PairTreeRedux'

// Styles
import styles from './Styles/LoginScreenStyle'

class LoginScreen extends Component {

  state = {
    user: this.props.user,
    showSpinner: true,
  }

  componentDidMount() {
        //firebase.auth().signOut()
        firebase.auth().onAuthStateChanged(auth => {
              if (auth) {
                    this.firebaseRef = firebase.database().ref('users')
                    this.firebaseRef.child(auth.uid).on('value', snap => {
                          const user = snap.val()
                          if (user != null) {
                                this.firebaseRef.child(auth.uid).off('value')
                                console.log(user)
                                this.goHome(user)
                          }
                    })
              } else {
                    this.setState({showSpinner:false})
              }
        })
  }

  goHome(user) {
        /*const resetAction = NavigationActions.reset({
              index: 0,
              actions : [
                  NavigationActions.navigate({routeName: 'DrawerStack', params:{user}})
              ]
        })
        this.props.navigation.dispatch(resetAction)*/
        this.setState({user: user})
        this.props.setUser(user)
        //this.props.navigation.navigate('drawerStack', {user})
        this.props.navigation.dispatch(NavigationActions.reset(
            {
                  index: 0,
                  key: null,
                  actions: [
                        NavigationActions.navigate({routeName: 'drawerStack', params:{user:user}})
                  ]
            }))
  }

  authenticate = (token) => {
        const provider = firebase.auth.FacebookAuthProvider
        const credential = provider.credential(token)
        return firebase.auth().signInWithCredential(credential)
  }

  createUser = (uid, userData) => {
        const defaults = {
              uid,
              distance: 25,
              ageRange: [18, 30],
              showMen: userData.gender === 'female',
              showWomen: userData.gender === 'male',
              pictures: [`https://graph.facebook.com/${userData.id}/picture?height=500`]
        }
        firebase.database().ref('users').child(uid).update({...userData, ...defaults})
  }

  login = async() => {    //TODO: Some kind of check for internet access
        this.setState({showSpinner:true})
        const APP_ID = '1984968761761091'
        const options = {
              permissions: ['public_profile', 'email', 'user_birthday', 'user_work_history'],
        }
        const {type, token} = await Expo.Facebook.logInWithReadPermissionsAsync(APP_ID, options)
        if (type === 'success') {
              const fields = ['id', 'first_name', 'last_name', 'gender', 'birthday', 'work']
              const response = await fetch(`https://graph.facebook.com/me?fields=${fields.toString()}&access_token=${token}`)
              const userData = await response.json()
              const {uid} = await this.authenticate(token)

              firebase.database().ref('users').child(uid).on('value', snap => {
                  if (!snap.val())
                        this.createUser(uid, userData)
              })
              
        }
  }

  render() {
        return (
              <View style = {styles.container}>
                    {this.state.showSpinner ?
                          <ActivityIndicator animating = {this.state.showSpinner} size="large"/> :
                          <FacebookButton onPress={this.login} />
                    }
              </View>
        )
  }
}

const mapStateToProps = (state) => {
  return {
        user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
      return {
            setUser: (user) => dispatch(PairTreeActions.pairTreeSetUser(user))
      }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)

import Expo from "expo"
import React, { Component } from 'react'
import {Animated, View, Text, StyleSheet, Button} from 'react-native'
import * as firebase from 'firebase'
import GeoFire from 'geofire'
import PopupDialog, {ScaleAnimation} from 'react-native-popup-dialog'
import _ from 'lodash'
import Card from '../Components/Card'
import CircleImage from '../Components/CircleImage'
import filter from '../Services/Filter'
import {FontAwesome} from '@expo/vector-icons'
import { connect } from 'react-redux'
import FirebaseActions from '../Redux/FirebaseRedux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/HomeScreenStyle'

const scaleAnimation = new ScaleAnimation()

class HomeScreen extends Component {

  state = {
    profileIndex: 0,
    profiles: [],
    //user: this.props.navigation.state.params.user,
    lastMatchedUser: ""
  }

  static navigationOptions = {
    drawerLabel: 'Home',
  }


  componentWillMount() {
    const {uid} = this.props.user
    this.updateUserLocation(uid)
    firebase.database().ref('users').child(uid).on('value', snap => {
      const user = snap.val()
      this.setState({
        user,
        profiles:[],
        profileIndex:0,
      })
      this.getProfiles(user.uid, user.distance)
    })
  }

  getUser = (uid) => {
    return firebase.database().ref('users').child(uid).once('value')
  }

  getSwiped = (uid) => {
    return firebase.database().ref('relationships').child(uid).child('liked')
      .once('value')
      .then(snap => snap.val() || {})
  }

  getProfiles = async(uid, distance) => {
    const geoFireRef = new GeoFire(firebase.database().ref('geoData'))
    const userLocation = await geoFireRef.get(uid)
    const swipedProfiles = await this.getSwiped(uid)
    console.log('userLocation', userLocation)
    const geoQuery = geoFireRef.query({
      center: userLocation,
      radius: distance, //km
    })
    geoQuery.on('key_entered', async(uid, location, distance) => {
      console.log(uid + ' at ' + location + ' is ' + distance + 'km from the center')
      const user = await this.getUser(uid)
      console.log(user.val().first_name)
      const profiles = [...this.state.profiles, user.val()]
      const filtered = filter(profiles, this.props.user, swipedProfiles)

      this.setState({profiles: filtered})
    })
  }

  updateUserLocation = async(uid) => {
    const {Permissions, Location} = Expo
    const {status} = await Permissions.askAsync(Permissions.LOCATION)

    if (status === 'granted') { //TODO: Prompt user to enable location if disabled
      const location = await Location.getCurrentPositionAsync({enableHighAccuracy: false})
      //const {latitude, longitude} = location.coords
      const latitude = 37.39239     //demo lat
      const longitude = -122.09072  //demo long

      const geoFireRef = new GeoFire(firebase.database().ref('geoData'))
      geoFireRef.set(uid, [latitude, longitude])
      console.log('Permission Granted', location)
    } else {
      console.log('Permission Denied')
    }
  }

  relate = (userUid,  profileUid, status) => {
    let relationUpdate = {}
    relationUpdate[`${userUid}/liked/${profileUid}`] = status
    relationUpdate[`${profileUid}/likedBack/${userUid}`] = status
    firebase.database().ref('relationships').update(relationUpdate)

    firebase.database().ref('relationships').child(userUid).child('likedBack').child(profileUid).on('value', snap => {
      if (snap.val())
      {
        firebase.database().ref('users').child(profileUid).on('value', snap => {
          if (snap.val()) {
            this.setState({
              lastMatchedUser: snap.val()
            })
            this.popupDialog.show()
          }
        })
      }
    })
  }

  nextCard = (swipedRight, profileUid) => {
    const userUid = this.props.user.uid
    this.setState({profileIndex: this.state.profileIndex + 1})
    if (swipedRight) {
      this.relate(userUid, profileUid, true)
    } else {
      this.relate(userUid, profileUid, false)
    }
  }

  cardStack = () => {
    const {profileIndex} = this.state
    return (
      <View style={{flex:1, bottom:75}}>
        {this.state.profiles.slice(profileIndex, profileIndex + 3).reverse().map((profile) => {
          return (
            <Card
              key={profile.id}
              profile={profile}
              onSwipeOff={this.nextCard}
            />
          )
        })}
        
        <PopupDialog
          ref={(popupDialog) => { this.popupDialog = popupDialog; }}
          dialogAnimation={scaleAnimation}
        >
          <View style={styles.popup}>
            <CircleImage facebookID={this.props.user.id} size={120} />
            <CircleImage facebookID={this.state.lastMatchedUser.id} size={120} />
          </View>
        </PopupDialog>
      </View>
    )
  }

  render () {
    return (
      this.cardStack()
    )
  }
}


const mapStateToProps = (state) => {
  return {
    user: state.pairtree.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)

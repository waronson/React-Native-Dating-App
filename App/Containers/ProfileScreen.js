import {ImagePicker} from 'expo'
import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Switch,
  TextInput,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native'
import * as firebase from 'firebase'
import GridView from 'react-native-gridview'
import PropTypes from 'prop-types'

import Slider from 'react-native-multislider'
import CircleImage from '../Components/CircleImage'
import uploadFile from '../Services/UploadFile'
import { connect } from 'react-redux'
import PairTreeActions from '../Redux/PairTreeRedux'
import {FontAwesome} from '@expo/vector-icons'

// Styles
import styles from './Styles/ProfileScreenStyle'

const addImageURL = "http://cdn.onlinewebfonts.com/svg/img_154383.png"

class ProfileScreen extends Component {
  state = {
    user: this.props.user,
    ageRangeValues: this.props.user.ageRange,
    distanceValue: [this.props.user.distance],
    showMen: this.props.user.showMen,
    showWomen: this.props.user.showWomen,
    aboutMe: 'About You',
    uploadProgress: 1,
  }

  static navigationOptions = {
    drawerLabel: 'Profile',
  }

  //Update the user's entry in Firebase
  updateUser = (key, value) => {
      const {uid} = this.state.user
      firebase.database().ref('users').child(uid)
          .update({[key]:value})

      firebase.database().ref('users').child(uid).on('value', snap => {
        const user = snap.val()
        if (user != null)
          this.props.setUser(user)
      })
  }

  //Get a picture from the local gallery
  getPicture = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
    })
    if (result.uri)
      this.uploadPicture(result, 0)
  }

  //Upload picture to Firebase function
  uploadPicture = async (pickerResult, position) => {
    const {uid} = this.state.user

    const name = `picture.jpg`
    const body = new FormData()
    body.append("picture", {
      uri: pickerResult.uri,
      name,
      type: "image/jpg"
    })
    const res = await fetch("https://us-central1-philanthrodate.cloudfunctions.net/api/picture", {
      method: "POST",
      body,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      }
    });
    const url = await firebase.storage().ref(name).getDownloadURL();
    if (url)
    {
        firebase.database().ref('users').child(uid).child('pictures').child(`${position}`)
          .set(url)

        this.firebaseRef = firebase.database().ref('users')
        this.firebaseRef.child(uid).on('value', snap => {
            const user = snap.val()
            if (user != null)
              this.props.setUser(user)
        })
    }
  }
  
  render () {
    const {pictures} = this.state.user
    const {first_name, work, id} = this.state.user
    const {ageRangeValues, distanceValue, showMen, showWomen} = this.state
    const bio = (work && work[0] && work[0].position) ? work[0].position.name : null

    return (
      <View style={styles.container}>

        {
          //Todo: display all profile pictures here
        }

        <View style={styles.profile}>
          <CircleImage url={pictures[0]} size={120} />
          <Text style={{fontSize:20}}>{first_name}</Text>
          <Text style={{fontSize:15, color:'darkgrey'}}>{bio}</Text>
        </View>

        <View style={styles.label}>
          <Text>Distance</Text>
          <Text style={{color:'darkgrey'}}>{distanceValue}km</Text>
        </View>
        <Slider
          min={1}
          max={30}
          values={distanceValue}
          onValuesChange={val => this.setState({distanceValue:val})}
        />
        <View style={styles.label}>
          <Text>Age Range</Text>
          <Text style={{color:'darkgrey'}}>{ageRangeValues.join('-')}</Text>
        </View>
        <Slider
          min={18}
          max={70}
          values={ageRangeValues}
          onValuesChange={val => this.setState({ageRangeValues:val})}
        />
      </View>
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
    setUser: (user) => dispatch(PairTreeActions.pairTreeSetUser(user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)

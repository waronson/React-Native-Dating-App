import React, { Component } from 'react'
import { StyleSheet, View, ScrollView, Text, KeyboardAvoidingView, Image, Dimensions } from 'react-native'
import Swiper from 'react-native-swiper'
import { connect } from 'react-redux'
import moment from 'moment'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/ProfileViewScreenStyle'

const { width } = Dimensions.get('window')

class ProfileViewScreen extends Component {

  state = {
    profile: this.props.navigation.state.params.profile,
  }

  render () {
    const {pictures} = this.state.profile
    const {birthday, first_name, work, id} = this.state.profile
    const bio = (work && work[0] && work[0].position) ? work[0].position.name : null //TODO: Change this to something charity-related
    const profileBday = moment(birthday, 'MM/DD/YYYY')
    const profileAge = moment().diff(profileBday, 'years')

    return (
      <ScrollView style={styles.container}>
        <View style={styles.container}>
          <Swiper style={styles.galleryWrapper} height={300} horizontal={false}>
            {pictures.map((url, key) => (
              <Image
                style={{flex:1}}
                source={{uri: url}}
              />
            ))}
          </Swiper>
        </View>
        <View style={styles.infoContainer}>
          <View style={{margin:20}}>
            <Text style={{fontSize:20}}>{first_name}, {profileAge}</Text>
            {bio ? <Text style={{fontSize:15, color:'darkgrey'}}>{bio}</Text> : <View />}
          </View>
        </View>  
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileViewScreen)

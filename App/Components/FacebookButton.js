import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import {
  View,
  TouchableHighlight,
  Text,
  StyleSheet,
} from 'react-native'
import styles from './Styles/FacebookButtonStyle'
import {FontAwesome} from '@expo/vector-icons'

export default class FacebookButton extends Component {
  // // Prop type warnings
  // static propTypes = {
  //   someProperty: PropTypes.object,
  //   someSetting: PropTypes.bool.isRequired,
  // }
  //
  // // Defaults for props
  // static defaultProps = {
  //   someSetting: false
  // }

  render () {
    return (
      <TouchableHighlight 
      style = {styles.button}
      onPress = {this.props.onPress}>
        <View style = {styles.buttonContainer}>
              <FontAwesome name={'facebook-f'} size={20} color={'white'}/>
              <Text style = {styles.buttonText}>Login with Facebook</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

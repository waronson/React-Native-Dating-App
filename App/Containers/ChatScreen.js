import React, { Component } from 'react'
import {
  View,
  Platform,
} from 'react-native'
import Constants from 'expo'
import * as firebase from 'firebase'
import {GiftedChat} from 'react-native-gifted-chat'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/ChatScreenStyle'

class ChatScreen extends Component {

  static navigationOptions = {
    title: "Chat",
    //headerStyle: { marginTop: Platform.OS === 'android' ? 24 : 0 },
  }

  state = {
    message:[],
    user: this.props.navigation.state.params.user,
    profile: this.props.navigation.state.params.profile,
  }

  componentWillMount() {
    const {user, profile} = this.state
    this.chatID = user.uid > profile.uid ? user.uid + '-' + profile.uid : profile.uid + '-' + user.uid
    this.watchChat()
  }

  watchChat = () => {
    firebase.database().ref('messages').child(this.chatID).on('value', snap => {
          let messages = []
          snap.forEach(message => {
                messages.push(message.val())
          })
          messages.reverse()
          this.setState({messages})
    })
  }

  onSend = (message) => {
    firebase.database().ref('messages').child(this.chatID)
          .push({
                ...message[0],
                createdAt: new Date().getTime()     //Should be Server time?
          })
  }

  render () {
    const avatar = `https://graph.facebook.com/${this.state.user.id}/picture?height=80` //TODO: get picture from firebase
    return (
        <View style={{flex: 1}}>
              <GiftedChat
                    messages={this.state.messages}
                    user={{_id:this.state.user.uid, avatar}}
                    onSend={this.onSend}
              />
              <KeyboardSpacer/>
        </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen)

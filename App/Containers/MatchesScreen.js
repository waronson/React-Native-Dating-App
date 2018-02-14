import React, { Component } from 'react'
import {
  ListView,
  Text,
  View,
  TouchableHighlight,
} from 'react-native'
import * as firebase from 'firebase'
import _ from 'lodash'
import CircleImage from '../Components/CircleImage'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/MatchesScreenStyle'

class MatchesScreen extends Component {

  state = {
    user: this.props.user,
    dataSource: new ListView.DataSource({rowHasChanged: (oldRow, newRow) => oldRow !== newRow}),
    matches: [],
  }

  static navigationOptions = {
    drawerLabel: 'Matches',
  }

  componentWillMount() {
    //this.setState({dataSource:this.state.dataSource.cloneWithRows(demoProfiles)})
    this.getMatches(this.state.user.uid)
  }

  getOverlap = (liked, likedBack) => {
    const likedTrue = _.pickBy(liked, value => value)
    const likedBackTrue = _.pickBy(likedBack, value => value)
    return _.intersection(_.keys(likedTrue), _.keys(likedBackTrue))
  }

  getUser = (uid) => {
    return firebase.database().ref('users').child(uid).once('value')
          .then(snap => snap.val())
  }

  getMatches = (uid) => {
    firebase.database().ref('relationships').child(uid).on('value', snap => {
          const relations = snap.val()
          if (relations) {
                const allMatches = this.getOverlap(relations.liked, relations.likedBack)
                const promises = allMatches.map(profileUid => {
                      const foundProfile = _.find(this.state.matches, profile => profile.uid === profileUid)
                      return foundProfile ? foundProfile : this.getUser(profileUid)
                })
                Promise.all(promises).then(data => this.setState({
                      dataSource: this.state.dataSource.cloneWithRows(data),
                      matches: data,
                }))
          }
    })
  }

  renderRow = (rowData) => {
    const {id, first_name, work} = rowData
    const bio = (work && work[0] && work[0].position) ? work[0].position.name : null
    return (
          <TouchableHighlight
                onPress={() => this.props.navigation.navigate('ChatScreen', {user:this.state.user, profile:rowData})}>
                <View style={{flexDirection:'row', backgroundColor:'white', padding:10}}>
                      <CircleImage size={80} facebookID={id} onPress={() => this.props.navigation.navigate('ProfileViewScreen', {profile:rowData})}/>
                      <View style = {{justifyContent:'center', marginLeft:10}}>
                            <Text style={{fontSize:18}}>{first_name}</Text>
                            <Text style={{fontSize:15, color:'darkgrey'}}>{bio}</Text>
                      </View>
                </View>
          </TouchableHighlight>
    )
  }

  renderSeparator = (sectionID, rowID) => {
    return (
          <View key={rowID} style={{height:1, backgroundColor:'whitesmoke', marginLeft:100}} />
    )
  }

  render () {
    return (
      <ListView
        style={{flex:1, backgroundColor:'white'}}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        renderSeparator={this.renderSeparator}
        enableEmptySections={true}
      />
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

export default connect(mapStateToProps, mapDispatchToProps)(MatchesScreen)

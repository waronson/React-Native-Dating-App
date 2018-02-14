import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Image,
  Text,
  PanResponder,
  Animated,
  Dimensions,
  PixelRatio,
} from 'react-native'
import moment from 'moment'
import {FontAwesome} from '@expo/vector-icons'

const {width, height} = Dimensions.get('window')

const CARD_MARGIN = 10
const CARD_HEIGHT = height*.7
const CARD_WIDTH = width - (CARD_MARGIN*2)
const SWIPE_THRESHOLD = 120;
const OFFSCREEN_DX = width*1.2
const ratio = PixelRatio.get()

export default class Card extends Component {
  state = {
    cardX: 0
  }

  componentWillMount() {
    this.pan = new Animated.ValueXY()

    this.cardPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: Animated.event([
        null,
        {dx:this.pan.x, dy:this.pan.y},
      ]),
      onPanResponderRelease: (e, {dx}) => {
        const absDx = Math.abs(dx)
        const direction = absDx / dx
        const swipedRight = direction > 0

        this.setState({cardX: dx})

        if (absDx > SWIPE_THRESHOLD) {
          Animated.decay(this.pan, {
            velocity: {x:3 * direction, y:0},
            deceleration: 0.995,
          }).start(() => this.props.onSwipeOff(swipedRight, this.props.profile.uid ))
        } else {
          /*Animated.spring(this.pan, {
            toValue: {x:0, y:0},
            friction: 4.5,
          }).start()*/
          Animated.timing(this.pan, {
            toValue: {x:0, y:0},
            duration: 250
          }).start()
        }
      },
    })
  }

  clamp = (num, min, max) => {
    return num <= min ? min : num >= max ? max : num
  }


  render() {
    const {pictures} = this.props.profile
    const {birthday, first_name, work, id} = this.props.profile
    const bio = (work && work[0] && work[0].position) ? work[0].position.name : null //TODO: Change this to something charity-related
    const profileBday = moment(birthday, 'MM/DD/YYYY')
    const profileAge = moment().diff(profileBday, 'years')
    const fbImage = `https://graph.facebook.com/${id}/picture?height=500`
    const rotateCard = this.pan.x.interpolate({
      inputRange: [-200, 0, 200],
      outputRange: ['10deg', '0deg', '-10deg'],
      extrapolate: 'clamp',
    })
    const animatedStyle = {
      transform: [
        {translateX: this.pan.x},
        {translateY: this.pan.y},
        {rotate: rotateCard},
      ],
    }
    const likeStyle = {
      opacity: this.pan.x.interpolate({
        inputRange: [0, SWIPE_THRESHOLD],
        outputRange: [0, 1],
        extrapolate: 'clamp'
      })
    }
    const dislikeStyle = {
      opacity: this.pan.x.interpolate({
        inputRange: [-(SWIPE_THRESHOLD), 0],
        outputRange: [1, 0],
        extrapolate: 'clamp'
      })
    }

    return (
      <Animated.View
        {...this.cardPanResponder.panHandlers}
        style={[styles.card, animatedStyle]}>
        <Image
          style={{flex:1}}
          source={{uri: pictures[0]}}
        />

        <Animated.View style={[styles.likeContainer, likeStyle]}>
          <FontAwesome name={'thumbs-up'} size={80} color='green' style={{padding:25, backgroundColor: 'transparent',}}/>
        </Animated.View> 

        <Animated.View style={[styles.dislikeContainer, dislikeStyle]}>
          <FontAwesome name={'thumbs-down'} size={80} color='red' style={{padding:25, backgroundColor: 'transparent',}}/>
        </Animated.View>

        <View style={{margin:20}}>
          <Text style={{fontSize:20}}>{first_name}, {profileAge}</Text>
          {bio ? <Text style={{fontSize:15, color:'darkgrey'}}>{bio}</Text> : <View />}
        </View>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: width - 20,
    height: height * 0.7,
    top: (height * 0.3) / 2,
    overflow: 'hidden',
    backgroundColor: 'white',
    margin: 10,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 8,
  },
  likeContainer: {
    position: 'absolute',
    top: 60,
    left: CARD_MARGIN,
  },
  dislikeContainer: {
    position: 'absolute',
    top: 60,
    left: CARD_WIDTH - CARD_MARGIN - 161,
  },
})

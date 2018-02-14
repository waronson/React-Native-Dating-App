import React, {Component} from 'react'
import {Image, PixelRatio, TouchableHighlight} from 'react-native'

export default class CircleImage extends Component {
  render() {
    const {size, url, facebookID} = this.props
    const imageSize = PixelRatio.getPixelSizeForLayoutSize(size)
    const imgURL = facebookID ? `https://graph.facebook.com/${facebookID}/picture?height=${imageSize}` : url
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <Image
          source={{uri:imgURL}}  //TODO: Get image from firebase
          style={{width:size, height:size, borderRadius:size / 2}}
        />
      </TouchableHighlight>
    )
  }
}

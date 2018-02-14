import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex:1,
    backgroundColor:'white',
  },
  profile: {
    flex:0.5,
    alignItems:'center',
    justifyContent:'center',
  },
  images: {
    flex: 1,
    margin: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
    //flexDirection: 'row',
  },
  info: {
    flex:0.5,
    padding:5,
    justifyContent:'center',
  },
  label: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    marginLeft:20,
    marginRight:20,
  },
})

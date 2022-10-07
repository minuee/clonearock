import React from 'react';
import {StyleSheet,View,Modal} from 'react-native';
import FastImage from 'react-native-fast-image';
//공통상수
const MoreLoading = (props) =>{
    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={props.isLoading}
        style={{ zIndex: 5}}
        onRequestClose={() => { }}
    >
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <FastImage
              source={require('../../assets/loader.gif')}
              style={{ height: 80, width: 80 }}
              resizeMode="contain"
              resizeMethod="resize"
            />            
          </View>
        </View>
      </Modal>
    )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    //backgroundColor: '#rgba(0, 0, 0, 0.5)',
    //backgroundColor:'transparent',
    backgroundColor:'#000',opacity:0.5 ,
    zIndex: 5
  },
  activityIndicatorWrapper: {
    backgroundColor:'transparent',    
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});

export default MoreLoading;
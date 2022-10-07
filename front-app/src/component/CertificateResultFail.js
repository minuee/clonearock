import React from 'react';
import { StyleSheet,View, Text } from 'react-native';
import mConst from '../utils/Constants';

const CertificateResultFail = () => (    
    <View style={styles.container}>
        <Text style={styles.subText}>전화번호</Text>
    </View>
)

export default CertificateResultFail;

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    justifyContent:'center'
  },
  subText : {
    color:'#555',      
    fontWeight:'500',  
    fontSize: mConst.subTitle
},
});
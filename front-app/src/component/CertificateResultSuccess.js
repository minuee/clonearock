import React from 'react';
import { StyleSheet,View, Text, Dimensions,TouchableOpacity } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import mConst from '../utils/Constants';
import CommonUtils  from '../utils/CommonUtils';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const CertificateResultSuccess = ({actionAuth}) => (    
    <View style={styles.container}>
        <Text style={styles.subText}>
            인증이 완료되었습니다.
        </Text>
        <TouchableOpacity
            onPress={()=>actionAuth()}
            style={styles.clickAbleWrap}
        >
            <Text style={styles.actionText}>확인</Text>
        </TouchableOpacity>
    </View>
)

export default CertificateResultSuccess;

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
    clickAbleWrap  : {
        position:'absolute',
        left:0,
        
        zIndex:10,
        width:SCREEN_WIDTH,
        ...ifIphoneX({
            height: CommonUtils.scale(60),
            bottom:50
        }, {
            height: CommonUtils.scale(50),
            bottom:70
        }),
        backgroundColor:mConst.baseColor,
        justifyContent:'center',
        alignItems:'center'
    },
    actionText : {
        color:'#fff',      
        fontWeight:'bold',  
        fontSize: CommonUtils.scale(16)
    },
});
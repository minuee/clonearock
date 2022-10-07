import React, {useEffect, useState} from 'react';
import {TouchableOpacity, ActivityIndicator,ImageBackground, Dimensions, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import { Input } from 'react-native-elements';
import CommonUtils  from '../utils/CommonUtils';
import mConst  from '../utils/Constants';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import { ifIphoneX, getBottomSpace } from 'react-native-iphone-x-helper'
const backImage = require('../../assets/images/img_notice.png')

const AuthCodeScreen = (props) => {
    const [isLoading, setLoading] = useState(true);
    const [inputs, setInput] = useState({
        userName : '홍길순',
        userPhone : '01012345678'
    });

    useEffect(() => {    
        setTimeout(() => {            
            setLoading(false) 
        }, 1000);  
    }, []);
    
    const actionAuth = () => {
        if( CommonUtils.isEmpty(inputs.userName)) {
            CommonUtils.fn_call_toast('이름을 입력하세요');
            return;
        }else if( CommonUtils.isEmpty(inputs.userPhone)) {
            CommonUtils.fn_call_toast('전화번호를 입력하세요');
            return;
        }else{
            props.navigation.navigate('PinCodeSetup',{
                screenState : inputs
            });
        }
    }
      
    if ( isLoading ) {
        return (
          <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <ActivityIndicator />
          </View>
        )
    }else{    
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.commmonWrap}>
                    <ImageBackground source={backImage} style={styles.backImg} >
                        <Text style={styles.titleText}>본인인증</Text>
                        <Text style={styles.subText}>
                            휴대폰으로 본인인증을 준비하세요
                        </Text>
                    </ImageBackground>
                </View>
                <View style={styles.commmonWrap}>  
                    <View style={styles.modalCommonFlex1Wrap}>
                        <Text style={styles.subText}>이름입력</Text>
                    </View>
                    <Input 
                        value={inputs.userName}
                        placeholder={"10자 이내의 이름을 입력하세요"}
                        placeholderTextColor={"#555"}
                        maxLength={11}
                        onChangeText={text => setInput({...inputs,userName : text})} 
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={{color:'#555',fontSize:15}}
                    />
                    <View style={styles.modalCommonFlex1Wrap}>
                        <Text style={styles.subText}>전화번호</Text>
                    </View>
                    <Input 
                        value={inputs.userPhone}
                        placeholder={"전화번호를을 입력하세요(숫자만)"}
                        placeholderTextColor={"#555"}
                        maxLength={12}
                        onChangeText={text => setInput({...inputs,userPhone : text})} 
                        inputContainerStyle={styles.inputContainer}
                        inputStyle={{color:'#555',fontSize:15}}
                    />
                </View>
                <View style={styles.commmonWrap}></View>
                <TouchableOpacity
                    onPress={()=>actionAuth()}
                    style={styles.clickAbleWrap}
                >
                    <Text style={styles.actionText}>인증하기</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    commmonWrap : {
        flex:1,
        paddingHorizontal:30,
        paddingTop:130,
        justifyContent:'flex-start'
    },
    backImg : {
        flex:1,
        width:'100%'        
    },
    titleText : {
        color:'#000',
        fontWeight:'bold',
        fontSize: CommonUtils.scale(30),
        marginBottom:20
    },
    subText : {
        color:'#555',        
        fontSize: CommonUtils.scale(18),
        lineHeight: CommonUtils.scale(25)
    },
    redText : {
        color:mConst.baseColor,
        fontSize: CommonUtils.scale(18),
        lineHeight: CommonUtils.scale(25)
    },
    clickAbleWrap  : {
        position:'absolute',
        left:0,
        bottom:0,
        zIndex:10,
        width:SCREEN_WIDTH,
        ...ifIphoneX({
            height: CommonUtils.scale(60)
        }, {
            height: CommonUtils.scale(50)
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
    inputContainer : {        
        borderWidth:0,
        paddingHorizontal:10,        
        borderBottomColor:'#fff',
        backgroundColor:'#fff'
    }
   
});

export default AuthCodeScreen;
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, PixelRatio,Image, Dimensions, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import CommonUtils  from '../utils/CommonUtils';
import mConst  from '../utils/Constants';
import { useIsFocused } from '@react-navigation/native';
import { ifIphoneX, getBottomSpace } from 'react-native-iphone-x-helper'
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const BUTTON_CHECK_OFF =  require('../../assets/icons/btn_check_off.png');
const BUTTON_CHECK_ON =  require('../../assets/icons/btn_check_on.png');
const ICON_CHECK_OFF =  require('../../assets/icons/icon_check_off.png');
const ICON_CHECK_ON =  require('../../assets/icons/icon_check_on.png');
const ARROW_RIGHT =  require('../../assets/icons/arrow_right_gray.png');

const AgreeScreen = (props) => {
    const isFocused = useIsFocused();
    const [allCheck, setAllCheck] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [agree1Check, setAgree1Check] = useState(false);
    const [agree2Check, setAgree2Check] = useState(false);
    const [agree3Check, setAgree3Check] = useState(false);
    
    const fn_allCheck = async() => {        
        if ( allCheck ) { //모두해제
            setIsActive(false);
            setAgree1Check(false);
            setAgree2Check(false);
            setAgree3Check(false);            
        }else{//모두선택
            setIsActive(true);
            setAgree1Check(true);
            setAgree2Check(true);
            setAgree3Check(true);
        }
        //setAllCheck((prev) => !prev);
    }

    const agreeCheck = async(mode,bool) => {
        switch(mode) {
            case 1 : setAgree1Check(!bool);break;
            case 2 : setAgree2Check(!bool);break;
            case 3 : setAgree3Check(!bool);break;
            default : console.log('nothing');break;
        }        
    }

    useEffect(() => {        
        if ( !isFocused ) { // when blur then clear
            setIsActive(false);
            setAgree1Check(false);
            setAgree2Check(false);
            setAgree3Check(false);
        }        
    }, [isFocused]);

    useEffect(() => {
        if ( agree1Check && agree2Check ) {
            setAllCheck(true);
        }else{
            setAllCheck(false);
        }
    }, [agree1Check,agree2Check]);

    const nextNavigation = (nav, routeName) => {
        props.navigation.navigate(nav,{
            targetIdx : 1,
            routeName
        });
    }

    const nexStep = (nav) => {
        if ( agree1Check && agree1Check ) {
            props.navigation.navigate(nav);
        }else{
            CommonUtils.fn_call_toast('이용약관 및 수집 및 이용동의를 해주세요',2000)
        }
    }
   
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.commonFlex}>
                <View style={{paddingVertical:50}}>
                    <Text style={styles.titleText}>
                        회원가입을 위한
                    </Text>
                    <Text style={styles.titleText}>
                        약관에 동의해주세요
                    </Text>
                </View>
            </View>            
            <View style={styles.commonFlex2}>
                <TouchableOpacity style={{paddingHorizontal:5}} onPress={()=>fn_allCheck()}>
                    <Image source={allCheck ? BUTTON_CHECK_ON :  BUTTON_CHECK_OFF} style={styles.defaultIconImage30} />
                </TouchableOpacity>
                <View style={{paddingHorizontal:5}} >
                    <Text style={styles.subText}>
                        전체동의
                    </Text>
                </View>                
            </View> 
            <View style={styles.commonFlex3}>
                <TouchableOpacity 
                    style={{flex:1,justifyContent:'center'}} 
                    onPress={()=>agreeCheck(1,agree1Check)}
                >
                    <Image source={agree1Check ? ICON_CHECK_ON :ICON_CHECK_OFF} style={styles.defaultIconImage30} />
                </TouchableOpacity>
                <View style={{flex:5,justifyContent:'center'}}  >
                    <Text style={styles.subText}>
                        (필수)서비스 이용약관 동의
                    </Text>
                </View>
                <TouchableOpacity 
                    style={{flex:0.5,justifyContent:'center',alignItems:'flex-end'}} 
                    onPress={()=>nextNavigation('NotificationDetail', '서비스 이용약관')}
                >
                    <Image source={ARROW_RIGHT} style={styles.defaultIconImage30} />
                </TouchableOpacity>
            </View>
            <View style={styles.commonFlex3}>
                <TouchableOpacity 
                    style={{flex:1,justifyContent:'center'}} 
                    onPress={()=>agreeCheck(2,agree2Check)}
                >
                    <Image source={agree2Check ? ICON_CHECK_ON :ICON_CHECK_OFF} style={styles.defaultIconImage30} />
                </TouchableOpacity>
                <View style={{flex:5,justifyContent:'center'}}  >
                    <Text style={styles.subText}>
                        (필수)개인정보 수집 및 이용동의
                    </Text>
                </View>
                <TouchableOpacity 
                    style={{flex:0.5,justifyContent:'center',alignItems:'flex-end'}} 
                    onPress={()=>nextNavigation('NotificationDetail','개인정보 수집 및 이용')}
                >
                    <Image source={ARROW_RIGHT} style={styles.defaultIconImage30} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity                
                //onPress={()=>nexStep('AuthCodeScreen')}
                onPress={()=>nexStep('DreamCertification')}                
                style={styles.clickAbleWrap}
            >
                <Text style={styles.actionText}>약관동의</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
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
    
    titleText : {
        color:'#000',
        fontWeight:'bold',
        fontSize: CommonUtils.scale(20),
    },
    subText : {
        color:'#555',        
        fontSize: CommonUtils.scale(15),
        lineHeight: CommonUtils.scale(20)
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
    commonFlex : {
        paddingHorizontal:30,paddingVertical:20,
    },
    commonFlex2 : {
        paddingHorizontal:30,paddingVertical:10,flexDirection:'row',alignItems:'center',
    },
    commonFlex3 : {
        paddingHorizontal:30,paddingVertical:10,flexDirection:'row',alignItems:'center',
    },
    defaultIconImage30 : {
        width:PixelRatio.roundToNearestPixel(30),height:PixelRatio.roundToNearestPixel(30)
    },
    arrowWrap : {
        position:'absolute',right:0,top:0,width:50,height:'100%',
    }
});

export default AgreeScreen;
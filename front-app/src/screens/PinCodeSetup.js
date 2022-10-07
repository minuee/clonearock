import React, {useEffect, useState, useContext, useCallback} from 'react';
import {TouchableOpacity, ActivityIndicator,Platform, Dimensions, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import { useFocusEffect,useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();
import UserTokenContext from '../store/UserTokenContext';
import CommonUtils  from '../utils/CommonUtils';
import mConst  from '../utils/Constants';
import { apiObject } from '../api';
import localStorage from '../store/LocalStorage';

const STORAGE_KEY = localStorage.MyCertificate;
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const PinCodeSetup = (props) => {
    const isFocused = useIsFocused();
    const [isLoading, setLoading] = useState(true);
    const [authPincode, setPinCode] = useState(null);
    const [resultText, setResultText] = useState('');
    const [inputblankCode, setInputBlankCode] = useState([null,null,null,null,null,null]);
    const [inputCode, setInputCode] = useState([]);
    const [keyboardArray, setKeyboardArray] = useState(null);
    const {setUserInfo} = useContext(UserTokenContext);
    const [myCeritificate, setMyCeritificate] = useState({});
    useFocusEffect(
        useCallback(() => {
            async function fetchData () {
                const MyCertData = await AsyncStorage.getItem(STORAGE_KEY);
                const jsonCertifiData = JSON.parse(MyCertData);
                setMyCeritificate(jsonCertifiData)      
                setTimeout(() => {
                    setLoading(false) 
                }, 1000);   
            }            
            fetchData();            
        }, [isFocused])
    );

    useEffect(() => {        
        setKeyboardArray([
            {id:1, val: '1'},
            {id:2, val: '2'},
            {id:3, val: '3'},
            {id:4, val: '4'},
            {id:5, val: '5'},
            {id:6, val: '6'},
            {id:7, val: '7'},
            {id:8, val: '8'},
            {id:9, val: '9'},
            {id:10, val: 'select'},
            {id:11, val: '0'},
            {id:12, val: 'back'}
        ]); 
        
        
    }, []);
    
    
    const checkPinCode = async(code) => {
        const result = code.join('');
        if ( CommonUtils.isEmpty(authPincode) ) {
            setResultText('한번더 입력해주세요');
            setPinCode(result.toString());
            setInputCode([]);
        }else{
            if ( authPincode == result ) {
                await AsyncStorage.setItem('pinCodeData', result.toString());
                setResultText('설정되었습니다.');
                //여기서 멤버정보를 저장한다.
                saveToDatabase(result.toString(),)
                /* setTimeout(() => {
                    setUserInfo({
                        isSessionAlive: true,
                        userEmail : 'minuee@nate.com'
                    })
                }, 1000); */
            }else{
                setResultText('일치하지 않아 다시 설정합니다');
                setInputCode([]);
                setPinCode(null);
            }
        }        
    }

    const saveToDatabase = async(pincode) => {
        let returnCode = {code:9998};
        const pinCode = pincode;
        const passwd = await CommonUtils.generatePassword(myCeritificate.ci, pinCode);
        try {            
            const url =  "http://10.10.10.195:12000/v2/member/regist/"
            const token = null;
            const sendData = {
                password : passwd,
                phone_number : myCeritificate.phone_number,
                mobile_srv : myCeritificate.mobile_srv,
                ci : myCeritificate.ci,
                di : myCeritificate.di,
                join_site : 'dreamsecurity'
            }
            returnCode = await apiObject.API_registCommon(url,token,sendData);          
            //console.log('returnCode',returnCode);
            if ( !CommonUtils.isEmpty(returnCode.data.member_id)) { // 등록완료
                let newmyCeritificate = {
                    ...myCeritificate,
                    access_key : returnCode.data.access_key,
                    member_id : returnCode.data.member_id
                }
                AsyncStorage.setItem('myCertificate',JSON.stringify(newmyCeritificate));
                setTimeout(() => {
                    setUserInfo({
                        isSessionAlive: true,
                        userEmail : returnCode.data.member_id
                    })
                }, 1000);
            }else{
                if ( JSON.stringify(returnCode.data.ci).indexOf('이미') != -1 ) { //이미 중복
                    //CommonUtils.fn_call_toast('이미 가입되어 있습니다.');
                    // 이미 가입되어 있으므로 정보를 가져온다 /v2/member/update-password/
                    let returnCode2 = {code:9998};                    
                    try {            
                        const url =  "http://10.10.10.195:12000/v2/member/update-password/"
                        const token = null;
                        const sendData = {
                            new_password : passwd,
                            ci : myCeritificate.ci
                        }
                        returnCode2 = await apiObject.API_registCommon(url,token,sendData);          
                        //console.log('returnCode',returnCode2) 
                        //returnCode {"code": "0000", "data": {"access_key": "579cb52ca2ba4ea9a0b8fd53259891b3", "member_id": "e42837a636ab492b8a0bc9c653e6ef1e"}}
                        if ( !CommonUtils.isEmpty(returnCode2.data.access_key)) {
                            let newmyCeritificate = {
                                ...myCeritificate,
                                access_key : returnCode2.data.access_key,
                                member_id : returnCode2.data.member_id
                            }
                            AsyncStorage.setItem(STORAGE_KEY,JSON.stringify(newmyCeritificate));
                            setTimeout(() => {
                                setUserInfo({
                                    isSessionAlive: true,
                                    userEmail : returnCode2.data.member_id
                                })
                            }, 1000);
                        }else{
                            CommonUtils.fn_call_toast('등록중 오류가 발생하였습니다. 관리팀에 문의하세요');
                            setTimeout(() => {
                                props.navigation.goBack();
                            }, 1000);
                        }
                    }catch(e){
                        CommonUtils.fn_call_toast('등록중 오류가 발생하였습니다. 관리팀에 문의하세요');
                        setTimeout(() => {
                            props.navigation.goBack();
                        }, 1000);
                        //console.log('eeeee',e)   
                    }                    
                }else{ //등록실패
                    CommonUtils.fn_call_toast('등록중 오류가 발생하였습니다. 관리팀에 문의하세요');
                    setTimeout(() => {
                        props.navigation.goBack();
                    }, 1000);
                }
            }
            //returnCode {"code": "0000", "data": {"access_key": "b03bd8e26ed141df82f487923e64f980", "member_id": "74cf778299234f419c1226cd3c279234"}}   
        }catch(e){
            //console.log('eeeee',e)   
        } 
    }

    const inputPinCode = async(val) => {
        let inputData = inputCode;
        if ( inputCode.length < 6 ) {
            setInputCode(inputData.concat(val))
        }
        if ( inputCode.length === 5 ) {           
            checkPinCode(inputData.concat(val))
        }
    }

    const removePinCode =  async() => {
        if ( inputCode.length < 6 && inputCode.length > 0) {
            setInputCode(inputCode.slice(0,inputCode.length-1 ))            
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
                    <Text style={styles.titleText}>PIN코드 설정</Text>
                    <Text style={styles.subText}>PIN코드 6자리를{"\n"}입력해주세요(로그인시 사용)</Text>
                </View>
                <View style={styles.commmonWrap2}>
                    <View style={styles.ballWrap}>
                    {
                        inputblankCode.map((item2,index2) => {
                            if ( inputCode[index2] == undefined ) {
                                return (
                                    <View style={styles.nullBall} key={index2} />
                                )
                            }else{
                                return (
                                    <View style={styles.dataBall} key={index2}/>
                                )
                            }
                        })
                    }
                    </View>
                    <View style={styles.errorTextWrap}>
                        <Text style={styles.redText}>{resultText}</Text>
                    </View>
                </View>
                <View style={styles.commmonWrap2}>
                    <View style={styles.keyboardWrap}>
                        {
                        keyboardArray.map((item,index) => {
                            if ( item.val === 'select') {
                                return (
                                    <View style={[styles.keyboardButton,{flexDirection:'row'}]} key={index}/>
                                )
                            }else if ( item.val === 'back') {
                                return (
                                    <TouchableOpacity 
                                        onPress={() => removePinCode()}
                                        style={styles.keyboardButton} key={index}
                                    >
                                        <Icon
                                            name="backspace"
                                            size={CommonUtils.scale(20)}
                                            color="#000000"
                                        />
                                    </TouchableOpacity>
                                )
                            }else{
                                return (
                                    <TouchableOpacity 
                                        onPress={() => inputPinCode(item.val)}
                                        style={styles.keyboardButton} key={index}
                                    >
                                        <Text style={styles.keyboardText}>{item.val}</Text>
                                    </TouchableOpacity>
                                )
                            }
                        })
                        }
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    commmonWrap : {
        flex:1,
        paddingHorizontal:30,
        paddingTop:30,
        justifyContent:'center'
    },
    commmonWrap2 : {
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    ballWrap : {
        flex:1,
        flexDirection :'row',
        justifyContent:'space-evenly',
        alignItems:'center'
    },  
    errorTextWrap : {
        flex:2,
        justifyContent:'flex-start',
        alignItems:'center'
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
    keyboardWrap : {
        flexDirection:'row',
        flexWrap:'wrap',
        paddingBottom : 30
    },
    keyboardButton : {
        width :  parseInt(SCREEN_WIDTH/3),
        height : parseInt(SCREEN_HEIGHT/12),
        justifyContent:'center',
        alignItems:'center',        
    },
    keyboardText : {
        color:'#000',
        fontWeight:'bold',
        fontSize: CommonUtils.scale(18)        
    },
    nullBall : {
        marginHorizontal:5,
        width: CommonUtils.scale(20),
        height: CommonUtils.scale(20),
        borderRadius: CommonUtils.scale(10),
        backgroundColor:'#ccc'
    },
    dataBall : {
        marginHorizontal:5,
        width: CommonUtils.scale(20),
        height: CommonUtils.scale(20),
        borderRadius: CommonUtils.scale(10),
        backgroundColor:'orange'
    },
    redText : {
        color:mConst.baseColor,
        fontSize: CommonUtils.scale(18),
        lineHeight: CommonUtils.scale(25)
    }
});

export default PinCodeSetup;
import React, {useEffect, useState, useContext} from 'react';
import {TouchableOpacity,LogBox, ActivityIndicator,Platform, Dimensions, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();
LogBox.ignoreAllLogs();
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserTokenContext from '../store/UserTokenContext';
import CommonUtils  from '../utils/CommonUtils';
import mConst  from '../utils/Constants';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

import localStorage from '../store/LocalStorage';
const STORAGE_KEY2 = localStorage.MyCertificate;

import { useMutation, useQuery, useQueryClient } from 'react-query';

const PinCodeScreen = (props) => {
    const [isLoading, setLoading] = useState(true);
    const [authPincode, setPinCode] = useState(null);
    const [resultText, setResultText] = useState('');
    const [inputblankCode, setInputBlankCode] = useState([null,null,null,null,null,null]);
    const [inputCode, setInputCode] = useState([]);    
    
    const [keyboardArray, setKeyboardArray] = useState(null);
    const [value, setValue] = useState('');
    const {setUserInfo} = useContext(UserTokenContext);
    const [myCeritificate, setMyCeritificate] = useState({
        ci : null,
        di : null,
    });

    const [socketStatus, setSocketStatus] = useState('대기');

    const initialTodos = {
        success : 'wait',
        tos : null
    }

    // WS로 보상확인 메세지를 받으면 QUIZ 페이지로 넘어가면서 state값을 넘겨줌
    useEffect(() => {
        // db에 유저 정보 저장하면서 ws 재오픈 및 /quiz로 경로 이동
        const socket = new WebSocket(`${mConst.SERVER_WS}/quizes`);
        socket.onopen = () => {
            console.log("userInfo: 웹소켓 연결 OK");
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log("userInfo: data", data);
                const status = data.status;
                if (status === "입장허용") {                    
                    props.navigation.navigate('QuizIntroScreen')
                }
                
            };
        };
        return () => {
            socket.close();
        }
    }, []);
    useEffect(() => {
        if ( socketStatus == "입장허용") {                    
            props.navigation.navigate('QuizIntroScreen')
        }
    }, [socketStatus]);
    

    const privacyPolicyQuery = useQuery(['privacy-policy'],
        () => getDetailData(),
        {
            initialData: initialTodos,
            staleTime: 1000,
            retry: 10, 
            retryDelay: 1000, 
        }
    );

    const getDetailData = async() => {
        console.log('getDetailData')
        const url = 'https://mrrwobfo8j.execute-api.ap-northeast-2.amazonaws.com/prod/cdn/v1/cdn/tos';
        const option = {
            method: 'GET', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
            }), 
            body:null
        }
        try{
            const responseJson = await CommonUtils.callAPI(url,option,3000);
            if ( responseJson.success) {
                console.log('getDetailData',responseJson.success);
            }else{
                CommonUtils.fn_call_toast('네트워크 오류입니다.');
            }
        }catch(e){
            console.log('eeeeee',e)
        }
    }

    useEffect(() => {
        if (!privacyPolicyQuery.isLoading) {
            setValue(privacyPolicyQuery.tos);
        }
        return () => {};
    }, [privacyPolicyQuery.success]);
    
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
        setPinCode(props.extraData);
        fn_biometrics();
        setTimeout(() => {
            //console.log('setLoading',Platform.OS);
            setLoading(false) 
        }, 1000);  
    }, []);

    const fn_biometrics = async() => {
        const MyCertData = await AsyncStorage.getItem(STORAGE_KEY2);                    
        const jsonCertifiData = JSON.parse(MyCertData);
        //console.log('jsonCertifiData',jsonCertifiData);
        setMyCeritificate(jsonCertifiData)
        if ( Platform.OS === 'android' ) {
            const { biometryType } = await ReactNativeBiometrics.isSensorAvailable();
            //console.log('biometryType',Platform.OS , biometryType)
            if (biometryType === ReactNativeBiometrics.Biometrics) {              
              ReactNativeBiometrics.isSensorAvailable()
              .then((resultObject) => {
                    const { available, biometryType } = resultObject;
                    if (available && biometryType === ReactNativeBiometrics.TouchID) {
                        //console.log('TouchID is supported');
                        CommonUtils.fn_call_toast('TouchID is supported')
                    } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
                        //console.log('FaceID is supported')
                        CommonUtils.fn_call_toast('FaceID is supported')
                    } else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
                        //console.log('Biometrics is supported')
                    } else {
                        //console.log('Biometrics not supported')
                    }
                })
            }
        }else{
      
            ReactNativeBiometrics.isSensorAvailable()
            .then((resultObject) => {
                const { available, biometryType } = resultObject;
                //console.log('TbiometryType ios',available,biometryType)
                if (available && biometryType === ReactNativeBiometrics.TouchID) {
                    //console.log('TouchID is supported')
                } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
                    //console.log('FaceID is supported')
                } else if (available && biometryType === ReactNativeBiometrics.Biometrics) {
                    //console.log('Biometrics is supported')
                } else {
                    //console.log('Biometrics not supported')
                }
            })
        }
    }

    const setUpBiometricLogin = async () => {
        // Check if biometrics are supported and configured on this device
        const { available } = await ReactNativeBiometrics.isSensorAvailable();
        //console.log('available',available)
        if (available) {
          // Prompt user to scan biometrics
          const { success } = await ReactNativeBiometrics.simplePrompt({ 
            promptMessage: '드림시큐리티 인증',
            cancelButtonText  :' 핀번호로 입력하기',
        });
          //console.log('setUpBiometricLogin success',success)
          if (success) {
            // If scan is successful, generate a keypair, then save the public key to the server
            const { publicKey } = await ReactNativeBiometrics.createKeys('Confirm biometrics');
            //console.log('setUpBiometricLogin',publicKey)
            if ( !CommonUtils.isEmpty(publicKey)) {
                setResultText('인증되었습니다.');
                setTimeout(() => {
                    setUserInfo({
                        isSessionAlive: true,
                        userEmail : 'minuee@nate.com'
                    })
                }, 1000);  
            }
            //post('/save_biometric_key', { key: publicKey, device_id: 'xyz' })
          }
        }
    }
  
      
    const loginWithBiometrics = async () => {
        try {
          // Scan user's biometrics. On scan success, generate a signature
          const signatureResponse = await ReactNativeBiometrics.createSignature({
            promptMessage: 'Face or fingerprint ID for DreamSecurity',
            payload: BIOMETRIC_SIGNATURE_PAYLOAD,
          });
          //console.log('loginWithBiometrics',signatureResponse?.signature)
          // Validate the signature against the public key saved on the server
          /* const validationSuccess = await post(
            `/validate_biometric_signature`, 
            {
              signature: signatureResponse.signature,
              payload: BIOMETRIC_SIGNATURE_PAYLOAD,
              device_id: 'xyz',
            },
          );
          if (validationSuccess) {
            // Login Success
          } else {
            // Login failure
          }
        */
        }catch(e) {
            CommonUtils.fn_call_toast('error',e)
        }
      }

    const checkPinCode = async(code) => {
        const result = code.join('');        
        if ( result === authPincode ) {
            if ( CommonUtils.isEmpty(myCeritificate.ci)) {
                setResultText('본인인증 정보가 없습니다. 인증부터 진행해주세요');
                setTimeout(() => {
                    props.navigation.navigate('AgreeScreen')
                }, 1000);  
            }else{
                setResultText('인증되었습니다.');
                setTimeout(() => {
                    setUserInfo({
                        isSessionAlive: true,
                        userEmail : myCeritificate.ci
                    })
                }, 1000);  
            }
            
            
        }else{
            setResultText('잘못된 인증입니다');
            setTimeout(() => {
                setResultText(null)
            }, 2000);
            setInputCode([]);
        }
    }

    const inputPinCode = async(val) => {
        
        let inputData = inputCode;
        if ( inputCode.length < 6 ) {
            await setInputCode(inputData.concat(val))
        }
        if ( inputCode.length === 5 ) {           
            checkPinCode(inputData.concat(val))
        }
    }

    const removePinCode =  async() => {
        if ( inputCode.length < 6 && inputCode.length > 0) {
            await setInputCode(inputCode.slice(0,inputCode.length-1 ))            
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
                    <Text style={styles.titleText}>PIN코드 입력</Text>
                    <Text style={styles.subText}>
                        설정하신 PIN코드 6자리를{"\n"}입력해주세요
                    </Text>
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
                                        <TouchableOpacity 
                                            onPress={()=> setUpBiometricLogin()}
                                            style={[styles.keyboardButton,{flexDirection:'row'}]}
                                            key={index}
                                        >
                                            <Icon
                                                name="fingerprint"
                                                size={CommonUtils.scale(20)}
                                                color="#000000"
                                            />
                                            <Icon
                                                name="face"
                                                size={CommonUtils.scale(20)}
                                                color="#000000"
                                            />
                                            
                                        </TouchableOpacity>
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
};

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

export default PinCodeScreen;
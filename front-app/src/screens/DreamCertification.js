import React, { useEffect, useState,useRef, useCallback } from 'react';
import { StyleSheet, SafeAreaView,Text, View ,ScrollView ,Dimensions } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebView from 'react-native-webview';
import { useFocusEffect,useIsFocused } from '@react-navigation/native';
import callAPI from 'minueefetch'
import CommonUtils from '../utils/CommonUtils';
import mConst from '../utils/Constants';
import MoreLoading from "../utils/MoreLoading";
import localStorage from '../store/LocalStorage';

import CertificateResultSuccess from '../component/CertificateResultSuccess';
import CertificateResultFail from '../component/CertificateResultFail';

const STORAGE_KEY = localStorage.MyCertificate;

const WebviewContainer = ({ handleSetRef, handleEndLoading,bodyData,moveResult }) => {
    // 인증화면 호출되어 필요파라미터를 다른 API를 통해서 가져온후 이동처리    
    const url = "https://www.mobile-ok.com/popup/common/hscert.jsp?" + bodyData;
    //const url = Platform.OS === 'ios' ? 'http://127.0.0.1:3001/rntest' : 'http://10.0.2.2:3001/rntest';
    /** 웹뷰에서 rn으로 값을 보낼때 거치는 함수 */
    const handleOnMessage = ({ nativeEvent: { data } }) => {
      // data에 웹뷰에서 보낸 값이 들어옵니다.
      //console.log('handleOnMessage',data);
    };    

    const onNavigationStateChange = (webViewState) => {
        //console.log(webViewState.url);
        //완료시
        if (  webViewState.url === 'about:blank') {
            moveResult()
        }
    };

    //console.log('bodyData',bodyData);
  
    return (
        <WebView
            onLoadEnd={handleEndLoading}
            onMessage={handleOnMessage}
            ref={handleSetRef}
            onNavigationStateChange={onNavigationStateChange}
            javaScriptEnabled
            domStorageEnabled         
            source={{
                uri : url,
                headers : {
                    'Content-type': 'application/json'
                },
                method : 'GET'
            }}
        />
    );
  };

const DreamCertification = (props) => {
    const isFocused = useIsFocused();
    const [bodyData, setBodyData] = useState(null); 
    const [reqNum, setReqNum] = useState(null); 
    const [reqReturnInfo, setReqReturnInfo] = useState(null); 
    const [isLoading, setLoading] = useState(true);
    let webviewRef = useRef(null);

    useFocusEffect(
        useCallback(() => {
            async function fetchData () {                
                const options = {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    method: 'GET',
                    body: null,
                }
                const apiUrl = "http://10.10.10.195:12000/v2/user/get-cert-info";
                const responseJson = await callAPI(apiUrl,options,3000);
                //console.log('responseJson',responseJson)
                if ( !CommonUtils.isEmpty(responseJson.cpId)) {
                    const urlEncodedData = "cpid=" + responseJson.cpId + "&req_info=" + responseJson.encReqInfo + "&rtn_url=http://10.10.10.195:12000/cert-return";
                    setBodyData(urlEncodedData);
                    if ( !CommonUtils.isEmpty(responseJson.cpId)) {
                        setReqNum(responseJson.reqNum)
                    }
                }                
            }            
            fetchData();            
        }, [isFocused])
    );

    

    /* useEffect(() => {    
        const urlCode = "a";
        const reqNum = `mid_${new Date().getTime()}`;
        const reqdate = new Date().getTime();
        const postData = {
            cpid: 'adfdjkfdjflkdjflkdjfdlkfjdlkfjdlkfdjl',
            req_info : urlCode + "/" + reqNum + "/" + reqdate,
            rtn_url : ""
        }
        let urlEncodedData = '',
            urlEncodedDataPairs = [],
            key;
        for (key in postData) {
            urlEncodedDataPairs.push(
                encodeURIComponent(key) + '=' + encodeURIComponent(postData[key]),
            );
        }
        urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
        setBodyData(urlEncodedData);

    }, []); */
    
    useEffect(() => {            
        setLoading(CommonUtils.isEmpty(bodyData) ? false : true);        
    }, [bodyData]);

    const handleMoveResult = async() => {
        setLoading(true);        
        const options = {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'GET',
            body: null,
        }
        const apiUrl = "http://10.10.10.195:12000/v2/certificate/?request_number=" + reqNum;
        const responseJson = await callAPI(apiUrl,options,3000);        
        if ( !CommonUtils.isEmpty(responseJson.ci) ) { //조회성공시
            setReqReturnInfo(responseJson);
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(responseJson))
        }else{ //실패시
            setReqReturnInfo('fail')
        }
        
    }

    /** 웹뷰 ref */
    const handleSetRef = _ref => {
        webviewRef = _ref;
    };

    /** webview 로딩 완료시 */
    const handleEndLoading = e => {
        //console.log("handleEndLoading");
        /** rn에서 웹뷰로 정보를 보내는 메소드 */
        webviewRef.postMessage("로딩 완료시 webview로 정보를 보내는 곳");
    };

    //인증성공후 다음페이지로 이동시
    const actionAuth = () => {        
        props.navigation.navigate('PinCodeSetup');        
    }

    if ( isLoading && CommonUtils.isEmpty(bodyData)) {
        return (        
            <View style={styles.container}>
                <MoreLoading isLoading={isLoading} />
            </View>
        )
    }else{
    return (        
        <View style={styles.container}>
            <Header
                backgroundColor="#fff"
                statusBarProps={{translucent: true, backgroundColor: 'transparent', barStyle: 'dark-content', animated: true}}
                leftComponent={(
                    <View style={{flex:1,paddingLeft:10,justifyContent:'center'}}>
                        <Icon
                            name="arrow-back-ios"
                            size={mConst.navIcon}
                            color="#000"
                            onPress={() => props.navigation.goBack()}
                        />
                    </View>
                )}
                centerComponent={{ text: '본인인증', style: { fontSize: mConst.navTitle,color: '#000' } }}
                rightComponent={null}
                containerStyle={{borderBottomWidth: 0}}
            />
            <SafeAreaView style={styles.viewContainer}>
                { 
                reqReturnInfo == null ?
                <WebviewContainer
                    webviewRef={webviewRef}
                    handleSetRef={handleSetRef}
                    handleEndLoading={handleEndLoading}
                    bodyData={bodyData}
                    moveResult={handleMoveResult}
                />
                :
                reqReturnInfo == 'fail' 
                ?
                <CertificateResultFail />
                :
                <CertificateResultSuccess 
                    actionAuth={actionAuth}
                />
                }
            </SafeAreaView>           
        </View>
    );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    fixedButtonWrap : {
        zIndex:100,
        position:'absolute',
        right:10,bottom:50,width:50,height:50,
        justifyContent:'center',alignItems:'center',
        backgroundColor:'#000',
        opacity:0.7,
        borderRadius:25
    },
    viewContainer : {
        height: '100%',
        opacity: 0.99,
        overflow: 'hidden'
    },
    textinfo:{
        margin:10, 
        textAlign: 'center',
        fontSize: 17,    
    },
    mainText : {
        color:'#000',
        fontWeight:'bold',
        fontSize: mConst.mainTitle,
        lineHeight: CommonUtils.scale(22),
    },
    subText : {
        color:'#555',      
        fontWeight:'500',  
        fontSize: mConst.subTitle
    },
    mainbox : {
        marginHorizontal:20
    },
    commonWrap : {
        paddingVertical:10,
        justifyContent:'center',
    },
    devideWrap : {
        height:1,backgroundColor:'#000',
        marginVertical:10
    }
});

export default DreamCertification;
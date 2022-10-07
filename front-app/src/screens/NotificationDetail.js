import React, { useEffect, useState,useRef } from 'react';
import { StyleSheet, Platform,Text, View ,ScrollView ,Dimensions } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();
import callAPI  from 'minueefetch';
import WebView from 'react-native-webview';

import CommonUtils from '../utils/CommonUtils';
import mConst from '../utils/Constants';
import MoreLoading from "../utils/MoreLoading";


const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const runFirst = `
      window.isNativeApp = true;
      true;
`;
const jsCodeiOS = `
(function () {
    window.addEventListener("message", (e) => {
        window.scrollTo(0, 0);
    })
}());
`;

const jsCodeAndorid = `
(function () {
    document.addEventListener("message", (e) => {        
        window.scrollTo(0, 0);
    })
}());    
`;

const NotificationDetail = (props) => {
    const refScrollView = useRef(null);
    const refWebView = useRef(null);
    const [isLoading, setLoading] = useState(true);
    const [showButton, setShowButton] = useState(false);
    const [data, setData] = useState({});

    const option = {
        method: 'GET', 
        headers: new Headers({
            Accept: 'application/json',                
            'Content-Type': 'application/json; charset=UTF-8',
        }), 
        body:null
    }
    const getDetailData = async() => {
        try{
            const responseJson = await callAPI('https://mrrwobfo8j.execute-api.ap-northeast-2.amazonaws.com/prod/cdn/v1/cdn/tos',option,3000);            
            if ( responseJson.success) {
                setData(responseJson?.tos)
                setLoading(false)
            }else{
                CommonUtils.fn_call_toast('네트워크 오류입니다.');
                setTimeout(() => {
                    props.navigation.goBack();
                }, 2000);

            }
        }catch(e){
            console.log('eeeeee',e)
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        if ( CommonUtils.isEmpty(props.route.params.targetIdx)){
            CommonUtils.fn_call_toast('잘못된 접근입니다.');
            setTimeout(() => {
                props.navigation.goBack();
            }, 2000);
        }else{
            getDetailData();           
        }
        
    }, [props.route.params]);

    const handleScroll = (event) => {        
        let paddingToBottom = 1;
        paddingToBottom += event.nativeEvent.layoutMeasurement.height;
        
    }
    
    if ( isLoading ) {
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
                statusBarProps={{translucent: false, backgroundColor: 'transparent', barStyle: 'dark-content', animated: true}}
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
                centerComponent={{ text: props.route.params.routeName || '약관', style: { fontSize: mConst.navTitle,color: '#000' } }}
                rightComponent={null}
                containerStyle={{borderBottomWidth: 0}}
            />
            { 
                showButton &&
                <View style={styles.fixedButtonWrap}>
                    <Icon
                        name="north"
                        size={mConst.navIcon}
                        color="#fff"
                        onPress={() => {
                            //console.log('postMessage')
                            //refWebView.current.scrollTo({x:0})
                            //refWebView.current.reload();
                            refWebView.current.postMessage(
                                JSON.stringify({
                                    data : 'top'
                                })
                            )
                        }}
                    />
                </View>
            }
            <ScrollView
                showsVerticalScrollIndicator={false}
                ref={refScrollView}                
                scrollEventThrottle={100}
                //onLayout={(e)=>getScrollViewSize(e)}
                //onContentSizeChange={(w,h) => getContentHeight(w,h)}
                //onScroll={(e) => handleScroll(e)}
                
                    
            >
                <WebView 
                    ref={refWebView}
                    style={{flex:1,height:SCREEN_HEIGHT*0.9}} 
                    originWhitelist={['*']} 
                    source={{html: CommonUtils.renderHtml(data)}} 
                    onScroll={syntheticEvent => {
                        const { contentOffset } = syntheticEvent.nativeEvent
                        if ( contentOffset.y >= SCREEN_HEIGHT*0.5 && !showButton ) setShowButton(true);
                        if ( contentOffset.y < SCREEN_HEIGHT*0.5 && showButton ) setShowButton(false);                        
                        //console.log(contentOffset, SCREEN_HEIGHT*0.5)
                    }}
                    javaScriptEnabled={true}
                    allowsLinkPsreview={true}
                    incognito={true}
                    domStorageEnabled={true}
                    injectedJavaScript={Platform.OS === 'ios' ? jsCodeiOS : jsCodeAndorid}
                    javaScriptCanOpenWindowsAutomatically
                    injectedJavaScriptBeforeContentLoaded={runFirst}
                    //startInLoadingState={true}
                    //userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36"
                    onMessage={(event) => {}}
                />
            </ScrollView>
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

export default NotificationDetail;
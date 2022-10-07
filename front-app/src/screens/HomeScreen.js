import React, { useEffect, useState,useRef, useContext, useCallback } from 'react';
import { ActivityIndicator, Animated,TouchableOpacity,ScrollView,StyleSheet, Dimensions,View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();


import Modal from "react-native-modal";
import { useFocusEffect,useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderScreen from '../route/HeaderScreen';
import CommonUtils from '../utils/CommonUtils';

import { apiObject } from '../api';
import mConst from '../utils/Constants';
import localStorage from '../store/LocalStorage';
import UserTokenContext from '../store/UserTokenContext';

const STORAGE_KEY = localStorage.MyHDWallet;
const STORAGE_KEY2 = localStorage.MyCertificate;
import { btoa } from 'Base64';
//window.btoa = require('Base64').btoa;
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const newsList = [    
    {label : '1',value : '오픈 서비스  안내 111'},
    {label : '2',value : '오픈 서비스  안내 222'},
    {label : '3',value : '오픈 서비스  안내 4444'},
]
const ImageArray = [
    require('../../assets/images/alien.jpg'),
    require('../../assets/images/china.jpg'),
    require('../../assets/images/japan2.jpg'),
    require('../../assets/images/korea.jpg')
]

const images = [
    require('../../assets/images/sample_11.jpeg'),
    require('../../assets/images/sample_12.jpeg'),
    require('../../assets/images/sample_13.jpg')
]

const bannerArray = [
    require('../../assets/images/banner.jpg'),
    require('../../assets/images/banner2.jpg')
]

const HomeScreen = (props) => {

    const isFocused = useIsFocused();
    const [isLoading, setLoading] = useState(true);    
    const [myCeritificate, setMyCeritificate] = useState({
        ci : null,
        di : null,
    });
    
    const [convertMyNemonic, setConvertMyNemonic] = useState('No');  
    const [isModalVisible, setModalVisible] = useState(false);  
    const {openModalCount,walletInfo,walletMnemonic, setUserInfo} = useContext(UserTokenContext);
    const animatedHeight = useRef(new Animated.Value(SCREEN_HEIGHT*0.5)).current;
    const refScrollView = useRef(null);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    
    useFocusEffect(
        useCallback(() => {
            setUserInfo({focusTabHome:true});
            
            setTimeout(() => {
                upButtonHandler();
            }, 500);
            if ( openModalCount === 0 ) {
                setTimeout(() => {
                    setUserInfo({openModalCount : 1});toggleModal();
                }, 500);
            }
        }, [openModalCount])
    );

    useFocusEffect(
        useCallback(() => {
            //console.log('walletMnemonic2',walletMnemonic);
            async function fetchData() {                         
                const MyCertData = await AsyncStorage.getItem(STORAGE_KEY2);                    
                const jsonCertifiData = JSON.parse(MyCertData);
                console.log('jsonCertifiData',jsonCertifiData);
                setMyCeritificate(jsonCertifiData)
                //console.log('jsonCertifiData222',jsonCertifiData.ci);
                if ( !CommonUtils.isEmpty(jsonCertifiData.ci) ) {
                    //console.log('walletMnemonic.mnemonicCode.phrase',walletMnemonic.mnemonicCode.phrase);
                    const retData = await CommonUtils.mnemonicCipher(jsonCertifiData,walletMnemonic.mnemonicCode.phrase);
                    //console.log('retData',retData);
                    setConvertMyNemonic(retData)
                }
                /* 
                암호화 복호화
                const rtest = CommonUtils.cipherMnemonic(walletInfo.publicAddress,walletInfo.mnemonicCode.phrase);
                const rtest2 = CommonUtils.mnemonicCipher('111',walletInfo.publicAddress);                
                /* 회원등록 */
                
                /* try{
                    fetch("http://10.10.10.195:12000/v2/member/regist/", {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        method: 'POST',
                        body: JSON.stringify({
                            password : passwd,
                            phone_number : jsonCertifiData.phone_number,
                            mobile_srv : jsonCertifiData.mobile_srv,
                            ci : jsonCertifiData.ci,
                            di : jsonCertifiData.di,
                            join_site : 'dreamsecurity'
                        }),
                    })
                    .then(res => res.json())
                    .then(result => {
                        console.log('saveToRedis .result',result)
                    });
                }catch(e){
                    console.log('eeeeee',e)
                    CommonUtils.fn_call_toast('네트워크 오류입니다.');          
                }   */
                /* let returnCode = {code:9998};
                const pinCode = "015847"
                const passwd = await CommonUtils.generatePassword(jsonCertifiData.ci, pinCode);
                try {            
                    const url =  "http://10.10.10.195:12000/v2/member/regist/"
                    const token = null;
                    const sendData = {
                        password : passwd,
                        phone_number : jsonCertifiData.phone_number,
                        mobile_srv : jsonCertifiData.mobile_srv,
                        ci : jsonCertifiData.ci,
                        di : jsonCertifiData.di,
                        join_site : 'dreamsecurity'
                    }
                    returnCode = await apiObject.API_registCommon(url,token,sendData);                              
                    //returnCode {"code": "0000", "data": {"access_key": "b03bd8e26ed141df82f487923e64f980", "member_id": "74cf778299234f419c1226cd3c279234"}} 
                    
                }catch(e){
                    console.log('eeeee',e)   
                } */
                /*  
                회원여부 체크
                let returnCode = {code:9998};     
                try {            
                    const url =  "http://10.10.10.195:12000/v2/member/check-regist/?ci=" + btoa(jsonCertifiData.ci)                    
                    const token = null;
                    returnCode = await apiObject.API_getCommonCode(url,token);          
                    console.log('returnCode',returnCode)   
                    
                }catch(e){
                    console.log('eeeee',e)   
                }
               
                const options = {
                    headers: {
                        'Content-type': 'application/json'
                    },
                    method: 'GET',
                    body: null,
                }
                const apiUrl = "http://10.10.10.195:12000/v2/member/check-regist/?ci=" + btoa(jsonCertifiData.ci);
                console.log('apiUrl',apiUrl);
                try {
                    const responseJson = await callAPI(apiUrl,options,3000);
                    console.log('responseJson',responseJson)
                } catch (error) {
                    console.log('errorerror',error)    
                } 
                */                
            }            
            fetchData();            
        }, [isFocused])
    );

    useEffect(() => {        
        setLoading(false)
        if ( !isFocused ) { // blur
            setUserInfo({focusTabHome:false})
        }    
        /* AsyncStorage.setItem('myCertificate', JSON.stringify({
            "ci": "KZmz1fTfmvPUvcLqzlmxYKRzV/d+SJiaXYskR/srcTT5p6fKIYQcG+xTpfxrBvDRmWgihlJxhB8VmNAcCP5IRg==",
            "created_at": "2022-07-28T09:21:51.385143",
            "di": "MC0GCCqGSIb3DQIJAyEA9BLvxxP8UcphMrwyu2L4Qd8vmF2IAVx2WrUUZgbirfU=",
            "mobile_srv": "SKT",
            "phone_number": "01062880183"
        })); */
    }, [isFocused]);

 
    const fn_hideMode = (e) => {
        if ( e < 0.20 ) {            
            setModalVisible(false)
        }
    }

    const upButtonHandler = () => {  
        try {
            refScrollView.current.scrollTo({ x: 0,  animated: true });    
        } catch (error) {
            console.log('eerrr',error)
        }
    }

    const goNavigaion = (nav,isWallet = false,params=null) => {
        if ( !CommonUtils.isEmpty(nav)) {
            if ( isWallet ) {
                if ( CommonUtils.isEmpty(walletInfo.publicAddress) ) {
                    CommonUtils.fn_call_toast('지갑을 먼저 생성해야 합니다.');
                    return false;
                }else{
                    if ( !CommonUtils.isEmpty(params)) {
                        props.navigation.navigate(nav,params)
                    }else{
                        props.navigation.navigate(nav)
                    }
                }
            }else{
                if ( !CommonUtils.isEmpty(params)) {
                    props.navigation.navigate(nav,params)
                }else{
                    props.navigation.navigate(nav)
                }
            }
        }
    }
  
    return (
    <View style={styles.container}>
        { 
        isLoading 
        ? 
        <View style={styles.centerStyle}>
            <ActivityIndicator/> 
        </View>
        : 
        (
        <View style={styles.container}>
            <HeaderScreen 
                screenProps={props}  
                titlePosition='Left'
                navTitle='홈' 
                leftTool={null}                
            />
            <ScrollView
                ref={refScrollView}
                showsVerticalScrollIndicator={false}
                indicatorStyle={'white'}
                scrollEventThrottle={16}
                keyboardDismissMode={'on-drag'}
                style={{width:'100%',backgroundColor:'#fff'}}
            >
                {/* <View style={{flex:1,minHeight:250,margin:20}}>
                    <ImageSlider 
                        images={ImageArray}  
                        autoSlide={true}
                        imageBoxSize={250}
                        activeBadgeColor={mConst.baseColor}
                    />
                </View> */}
                {/* <View style={styles.marqueeWrap}>
                    <MarqueeVertical
                        textList={newsList}
                        width={SCREEN_WIDTH-40}
                        //height={50}
                        separator={5}
                        reverse={true}
                        //duration = {600}
                        delay={3000}
                        direction={'up'}
                        numberOfLines={1}
                        iconColor={mConst.baseColor}
                        bgContainerStyle = {{width:SCREEN_WIDTH-40,backgroundColor:'#f7f7f7',borderRadius:10}}
                        viewStyle={styles.tickerViewStyle}
                        textStyle = {{fontSize:CommonUtils.scale(14) ,color : '#333',}}
                        onTextClick = {(item) => {
                            Alert.alert(''+JSON.stringify(item));
                        }}
                    />
                </View> */}
                <View style={styles.titleWrap}>
                    <Text style={styles.titleText}>메뉴 링크</Text>
                </View>
                <View style={styles.myContentsCoverWrap}>
                    <View style={[styles.myContentsWrap,{borderBottomWidth:1,borderBottomColor:'#ebebeb'}]}>
                        <View style={styles.myContentsLeftWrap}>
                            <Icon
                                name="album"
                                style={{paddingRight:5}}
                                size={CommonUtils.scale(20)}
                                color="gold"                               
                            />
                            <Text style={styles.dataText}>지갑생성</Text>
                        </View>
                        <TouchableOpacity 
                            onPress={()=>goNavigaion('SetWalletScreen') }                            
                            style={styles.myContentsRightWrap}
                        >
                            <Text style={styles.linkText}>지갑 연결하고 확인하기</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.myContentsWrap,{borderBottomWidth:1,borderBottomColor:'#ebebeb'}]}>
                        <View style={styles.myContentsLeftWrap}>
                            <Icon
                                name="album"
                                style={{paddingRight:5}}
                                size={CommonUtils.scale(20)}
                                color="skyblue"
                                onPress={()=>setScanView(false) }
                            />
                            <Text style={styles.dataText}>지갑복구</Text>
                        </View>
                        <TouchableOpacity 
                            onPress={()=>goNavigaion('GetWalletScreen') }
                            style={styles.myContentsRightWrap}
                        >
                            <Text style={styles.linkText}>니모닉을 이용한 복구</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.myContentsWrap}>
                        <View style={styles.myContentsLeftWrap}>
                            <Icon
                                name="album"
                                style={{paddingRight:5}}
                                size={CommonUtils.scale(20)}
                                color="red"
                                onPress={()=>setScanView(false) }
                            />
                            <Text style={styles.dataText}>나의코인</Text>
                        </View>
                        <TouchableOpacity 
                            //onPress={()=>goNavigaion('RewardScreen',{screenState : {tabIndex :2}}) }
                            onPress={()=>goNavigaion('AssetsScreen',true) }
                            style={styles.myContentsRightWrap}
                        >
                            <Text style={styles.linkText}>확인하기</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.myContentsWrap}>
                        <View style={styles.myContentsLeftWrap}>
                            <Icon
                                name="album"
                                style={{paddingRight:5}}
                                size={CommonUtils.scale(20)}
                                color="blue"
                                onPress={()=>setScanView(false) }
                            />
                            <Text style={styles.dataText}>코인추가</Text>
                        </View>
                        <TouchableOpacity 
                            onPress={()=>goNavigaion('AddCoinScreen',true) }
                            style={styles.myContentsRightWrap}
                        >
                            <Text style={styles.linkText}>등록</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.myContentsWrap}>
                        <View style={styles.myContentsLeftWrap}>
                            <Icon
                                name="album"
                                style={{paddingRight:5}}
                                size={CommonUtils.scale(20)}
                                color="purple"
                                onPress={()=>setScanView(false) }
                            />
                            <Text style={styles.dataText}>문의하기</Text>
                        </View>
                        <TouchableOpacity 
                            onPress={()=>goNavigaion('ChatScreen') }
                            style={styles.myContentsRightWrap}
                        >
                            <Text style={styles.linkText}>바로가기</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.myContentsWrap2}>
                        <Text style={styles.linkText}>
                            HD공개키 : {!CommonUtils.isEmpty(walletInfo.publicAddress) ? walletInfo.publicAddress?.substr(0,20) + '...' : 'No'}
                        </Text>
                        <Text style={styles.linkText}>
                            HD개인키 : {!CommonUtils.isEmpty(walletInfo.privateAddress) ? walletInfo.privateAddress?.substr(0,20) + '...' : 'No'}
                        </Text>
                        { !CommonUtils.isEmpty(convertMyNemonic) &&
                            (
                            <Text style={styles.linkText}>
                                HD니모닉 : {convertMyNemonic}
                            </Text>
                            )
                        }
                        <Text style={styles.linkText}>
                            HD니모닉(암호화) : {!CommonUtils.isEmpty(walletMnemonic?.mnemonicCode) ?walletMnemonic.mnemonicCode.phrase : 'No'}
                        </Text>
                        <Text style={styles.linkText}>
                            HD니모닉Path : {!CommonUtils.isEmpty(walletMnemonic?.mnemonicCode) ? walletMnemonic.mnemonicCode?.path : 'No'}
                        </Text>
                        <Text style={styles.linkText}>
                            HD니모닉언어셋 : {!CommonUtils.isEmpty(walletMnemonic?.mnemonicCode) ? walletMnemonic.mnemonicCode?.locale : 'No'}
                        </Text>
                    </View>

                    <View style={styles.myContentsWrap2}>
                        <Text style={styles.linkText}>
                            CI : {!CommonUtils.isEmpty(myCeritificate?.ci) ? myCeritificate?.ci?.substr(0,20) + '...' : 'No'}
                        </Text>
                        <Text style={styles.linkText}>
                            DI : {!CommonUtils.isEmpty(myCeritificate?.di) ? myCeritificate?.di?.substr(0,20) + '...' : 'No'}
                        </Text>
                        <Text style={styles.linkText}>
                            PHONE : {!CommonUtils.isEmpty(myCeritificate?.phone_number) ? myCeritificate?.phone_number : 'No'}
                        </Text>
                        <Text style={styles.linkText}>
                            UID : {!CommonUtils.isEmpty(myCeritificate?.member_id) ? myCeritificate?.member_id : 'No'}
                        </Text>
                    </View>
                    {/* <TouchableOpacity 
                        style={styles.myContentsWrap2}
                        onPress={()=>goNavigaion('BluetoothScreen')}
                    >
                        <Text style={styles.linkText}>지갑 연결하고 내 자산 확인하기</Text>
                    </TouchableOpacity> */}
                </View>
                {/* <View style={[styles.titleWrap,{flexDirection:'row',marginTop:20}]}>
                    <View style={{flex:1,justifyContent:'center'}}>
                        <Text style={styles.titleText}>
                            <Text style={[styles.titleText,{color:'orange'}]}>지금 바로</Text> 리워드
                        </Text>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                        <Text style={styles.smallText}>전체보기</Text>
                    </View>
                </View> */}
                {/* <View>
                    <ScrollView
                        horizontal={true}
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}                        
                        scrollEventThrottle={1}
                    >
                        { images.map((image, imageIndex) => {
                            return (
                                <View key={imageIndex} style={{width:SCREEN_WIDTH*0.9, height:200}}>
                                    <ImageBackground source={image} style={styles.card} />
                                </View>
                            )
                        })}
                    </ScrollView>
                </View> */}
                {/* <View style={{flex:1,marginTop:20}}>
                { 
                    bannerArray.map((banner, bannerIndex) => {
                        return (
                            <View key={bannerIndex} style={styles.bannerWrap}>
                                <FastImage source={banner} style={styles.bannerImage} resizeMode={"cover"} />
                            </View>
                        )
                    })}
                </View> */}
                <View style={{height:150}}></View>
            </ScrollView>
        </View>
        )
    }
    <Modal 
        isVisible={isModalVisible}
        //animationType="slide"
        backdropOpacity={0.5}
        deviceHeight={SCREEN_HEIGHT}
        deviceWidth={SCREEN_WIDTH}
        onBackdropPress={()=>setModalVisible(false)}
        useNativeDriver={false}
        //hideModalContentWhileAnimating={true}
        //swipeThreshold={1000}
        useNativeDriverForBackdrop
        swipeDirection={['down']}
        //animationInTiming={300}
        //animationOutTiming={300}
        onSwipeStart={(e)=> null}
        //onSwipeComplete={(e) => console.log('onSwipeComplete',e)}
        onSwipeMove={(e) => fn_hideMode(e)}
        //propagateSwipe={true}            
        style={styles.modalStyle}            
    >
        <Animated.View style={[styles.modalContainer,{ marginTop:SCREEN_HEIGHT*0.5 ,height: animatedHeight }]}>            
            <View style={styles.modalTopBottomWrap}>
                <Icon
                    name="drag-handle"
                    style={{paddingRight:5}}
                    size={CommonUtils.scale(30)}
                    color="#fff"                        
                />
            </View>
            <View style={styles.modalDataWrap}>
                <View style={styles.modalCommonWrap}>
                    <View style={[styles.modalCommonFlex1Wrap,{alignItems:'flex-start'}]}>
                        <Icon
                            name="directions-run"
                            style={{paddingRight:5}}
                            size={CommonUtils.scale(25)}
                            color="red"                               
                            onPress={()=>setScanView(false) }
                        />
                    </View>
                    <View style={styles.modalCommonFlex5Wrap}>
                        <Text style={styles.subText}>복잡한 절차없이 지갑이 만들어지는</Text>
                        <Text style={styles.mainText}>빠른 시작</Text>
                    </View>
                    <View style={[styles.modalCommonFlex1Wrap,{alignItems:'flex-end'}]}>
                        <Icon
                            name="navigate-next"
                            style={{paddingRight:5}}
                            size={CommonUtils.scale(25)}
                            color="#555"
                            onPress={()=>setScanView(false) }
                        />
                    </View>
                </View>
                <View style={styles.modalCommonWrap}>
                    <View style={[styles.modalCommonFlex1Wrap,{alignItems:'flex-start'}]}>
                        <Icon
                            name="explicit"
                            style={{paddingRight:5}}
                            size={CommonUtils.scale(25)}
                            color="red"
                            onPress={()=>setScanView(false) }
                        />
                    </View>
                    <View style={styles.modalCommonFlex5Wrap}>
                        <Text style={styles.subText}>아직 보유한 지갑이 없다면</Text>
                        <Text style={styles.mainText}>새 지갑 만들기</Text>
                    </View>
                    <View style={[styles.modalCommonFlex1Wrap,{alignItems:'flex-end'}]}>
                        <Icon
                            name="navigate-next"
                            style={{paddingRight:5}}
                            size={CommonUtils.scale(25)}
                            color="#555"
                            onPress={()=>setScanView(false) }
                        />
                    </View>
                </View>
                <View style={styles.modalCommonWrap}>
                    <View style={[styles.modalCommonFlex1Wrap,{alignItems:'flex-start'}]}>
                        <Icon
                            name="file-copy"
                            style={{paddingRight:5}}
                            size={CommonUtils.scale(25)}
                            color="red"
                            onPress={()=>setScanView(false) }
                        />
                    </View>
                    <View style={styles.modalCommonFlex5Wrap}>
                        <Text style={styles.subText}>다른 지갑을 보유하고 계신가요?</Text>
                        <Text style={styles.mainText}>지갑 가져오기</Text>
                    </View>
                    <View style={[styles.modalCommonFlex1Wrap,{alignItems:'flex-end'}]}>
                        <Icon
                            name="navigate-next"
                            style={{paddingRight:5}}
                            size={CommonUtils.scale(25)}
                            color="#555"
                            onPress={()=>setScanView(false) }
                        />
                    </View>
                </View>
                <View style={styles.modalCommonWrap}>
                    <View style={[styles.modalCommonFlex1Wrap,{alignItems:'flex-start'}]}>
                        <Icon
                            name="pageview"
                            style={{paddingRight:5}}
                            size={CommonUtils.scale(25)}
                            color="red"
                            onPress={()=>setScanView(false) }
                        />
                    </View>
                    <View style={styles.modalCommonFlex5Wrap}>
                        <Text style={styles.subText}>안심서버에 백업해 두셨나요?</Text>
                        <Text style={styles.mainText}>안심서버에서 지갑 가져오기</Text>
                    </View>
                    <View style={[styles.modalCommonFlex1Wrap,{alignItems:'flex-end'}]}>
                        <Icon
                            name="navigate-next"
                            style={{paddingRight:5}}
                            size={CommonUtils.scale(25)}
                            color="#555"
                            onPress={()=>setScanView(false) }
                        />
                    </View>
                </View>
            </View>                
        </Animated.View>
    </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
    container : {
        flex:1,        
        backgroundColor:'#fff'
    },
    modalStyle : {
        //position:'absolute',
        left:0,
        bottom:0,
        width:SCREEN_WIDTH,
        height:SCREEN_HEIGHT*0.5,
        zIndex:50,    
        justifyContent:'flex-end',
        margin: 0,
    },
    modalContainer : {
        flex:1,
        width:'100%',
        height:'100%',
    },
    modalTopBottomWrap : {
        height:40,
        justifyContent:'center',
        alignItems:'center'
    },
    modalDataWrap : {
        flex:1,
        paddingTop:20,
        backgroundColor:'#fff',
    },
    modalCommonWrap : {        
        flexDirection:'row',
        marginVertical:15,
        paddingHorizontal:20
    },
    modalCommonFlex1Wrap : {
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    modalCommonFlex5Wrap : {
        flex:5,
        justifyContent:'center',        
    },
    centerStyle : {
        flex:1,
        justifyContent :'center',
        alignItems:'center'
    },
    marqueeWrap : {
        flex:1,minHeight:45,backgroundColor:'#fff',marginTop:20,marginHorizontal:20,borderRadius:10
    },
    tickerViewStyle : {
        paddingVertical:12,
        alignContent:'center',
        alignItems:'flex-start',
        justifyContent:'center',
        paddingLeft:10
    },
    titleText : {
        color:'#000',
        fontWeight:'500',
        fontSize: mConst.mainTitle
    },
    titleWrap : {
        marginHorizontal:20,justifyContent:'center',marginVertical:CommonUtils.scale(20),
    },
    smallText : {
        color:'#555',
        fontSize: CommonUtils.scale(13)
    },
    myContentsCoverWrap : {        
        backgroundColor:'#f7f7f7',
        marginHorizontal:20,
        borderRadius:10
    },
    myContentsWrap : {
        height:60,
        flexDirection:'row',
        alignItems:'center',
        marginHorizontal:20
    },
    myContentsWrap2 : {        
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#ffe5cc',
        marginHorizontal:20,
        marginVertical:15,
        paddingVertical:10,
        borderRadius:10
    },
    myContentsLeftWrap : {
        flex:1,
        flexDirection:'row',
        alignItems:'center',
    },
    myContentsRightWrap : {
        flex:1.5,
        justifyContent :'center',
        alignItems:'flex-end'
    },
    dataText : {
        color:'#333',
        fontWeight:'bold',
        fontSize: mConst.subTitle
    },
    linkText : {
        color:'orange',
        fontWeight:'bold',
        fontSize: 12,
        textDecorationLine:'underline'
    },
    mainText : {
        color:'#000',
        fontWeight:'bold',
        fontSize: CommonUtils.scale(13),
        lineHeight: CommonUtils.scale(20),
    },
    subText : {
        color:'#555',      
        fontWeight:'500',  
        fontSize: CommonUtils.scale(10),
    },
    card : {
        flex:1,
        marginVertical : 4,
        marginHorizontal : 16,
        borderRadius : 5,
        overflow : 'hidden',
        alignItems : 'center',
        justifyContent : 'center'
    },
    bannerWrap : {
        flex:1,
        marginHorizontal:20,
        justifyContent:'center',
        alignItems:'center',
        marginBottom:10,
        borderRadius:15,
        overflow:'hidden'
    },
    bannerImage : {
        width:'100%',
        height:100
    }
})

export default HomeScreen;
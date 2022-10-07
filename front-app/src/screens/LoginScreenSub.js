import React, { useState,useEffect,useRef } from 'react';
import { View, Alert,Text, StyleSheet, TextInput, PixelRatio,Animated,ScrollView, TouchableOpacity ,Dimensions} from 'react-native';
import { Overlay } from 'react-native-elements';
import { Header,Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();
import useWebSocket, { ReadyState } from 'react-native-use-websocket';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { useIsFocused } from '@react-navigation/native';
import CommonUtils from '../utils/CommonUtils';
import etherUtil from '../ether/utils';
import mConst from '../utils/Constants';
import MoreLoading from '../utils/MoreLoading';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const langList = [
    { id : 1, code : 'english', code2  : 'en', name : '영어' },
    { id : 2, code : 'korean', code2  : 'ko', name : '한국어' },
    { id : 3, code : 'japaness', code2  : 'ja', name : '일본어' },
    { id : 4, code : 'chinese', code2  : 'zh_cn', name : '중국어' },
    { id : 5, code : 'french', code2  : 'fr', name : '프랑스어' },
    { id : 6, code : 'italian', code2  : 'it', name : '이탈리아어' },
    { id : 7, code : 'spanish', code2  : 'es', name : '스페인어' }
]


export default function LoginScreenSub(props) {
    const isFocused = useIsFocused();
    const [isMoreLoading, SetIsMoreLoading] = useState(false);
    const didUnmount = React.useRef(false);
    const [loading, setLoading] = useState(false);
    const [privateKey, setPrivateKey] = useState('');
    const [mnemonicCode, setMnemonicCode] = useState('');
    const [mnemonicCodeEther, setMnemonicCodeEther] = useState('');
    const [walletName, setWalletName] = useState('noh wallet');
    const [walletDescription, setWalletDescription] = useState('its show time');
    const [password, setPassword] = useState(null);
    const [walletAddress, setWalletAddress] = useState(null);
    const [walletKeyStore, setWalletKeyStore] = useState(null);
    const [walletAddressEther, setWalletAddressEther] = useState(null);
    const [walletKeyStoreEther, setWalletKeyStoreEther] = useState(null);
    const [selectLanaguage, setLanguage] = useState("english");
    const [selectLanaguage2, setLanguage2] = useState("en");

    const [walletHistory, setWalletHistory] = useState([]);

    const [popLayerView, setPopLayerView] = useState(false);    
    const [viewItem, setViewItem] = useState(null);
    
    const socketUrliOS = 'ws://10.10.40.185:3001/wallet?user_id=' + Platform.OS;
    const socketUrlAndroid = 'ws://10.0.2.2:3001/wallet?user_id=' + Platform.OS;
    
    const { sendMessage, sendJsonMessage,lastMessage, getWebSocket, readyState } = useWebSocket(Platform.OS == 'ios' ?socketUrliOS : socketUrlAndroid,{
        share:true,
        shouldReconnect: (closeEvent) => {
          
            /*
            useWebSocket will handle unmounting for you, but this is an example of a
            case in which you would not want it to automatically reconnect
            */
            return didUnmount.current === false;
        },
        reconnectAttempts: 10,
        reconnectInterval: 3000,
    });
    
    const connectionStatus = {
        [ReadyState.CONNECTING]: "Connecting",
        [ReadyState.OPEN]: "Open",
        [ReadyState.CLOSING]: "Closing",
        [ReadyState.CLOSED]: "Closed",
        [ReadyState.UNINSTANTIATED]: "Uninstantiated",
    }[readyState];

    const convertData = async(data) => {
        let convertArray = [];        
        await data.forEach(function(element,index,array){         
            const reElement = JSON.parse(element);
            convertArray.push(reElement)
        });
        
        return convertArray;
    }

    const fn_setMessages = async(inputMessage) => {
        //console.log('fn_setMessages',inputMessage);
        if ( !CommonUtils.isEmpty(inputMessage.data)) {
            const msgData = JSON.parse(inputMessage.data); 
            //console.log('msgData',msgData);  
            //console.log('msgData22',msgData.msgs);  
            const conData = await convertData(msgData.msgs)
            if ( conData.length > 0 ) setWalletHistory(conData);
        }
        SetIsMoreLoading(false)
    }

    useEffect(() => {
        fn_setMessages(lastMessage)        
    }, [lastMessage]);
    
    useEffect(() => {
        setPrivateKey('0xe6ebf18d26e2fc94d2cd0d7932722a4212d94b950896bb83c01a1d7645bb1766')
        setMnemonicCodeEther('harsh valve flat oven brisk oyster upgrade cabbage like west ghost save')
    }, [isFocused]);
    
    
    // reset method reset states to intial state
    function reset(str) {
        setPrivateKey(str);
    };
    

    const getMnemonicCodeEther = async() => {
        //console.log('selectLanaguage2',selectLanaguage2)
        const mnemonicData =  etherUtil.generateMnemonics(16,selectLanaguage2);
        //console.log('mnemonicData',mnemonicData);
        setMnemonicCodeEther(mnemonicData)
    }

    // handleGetHistory method
    function handleGetHistory() {
        
    }

    // getWallet method get wallet instance from caver
    function saveWalletHistory( { smnemonic , swalletAddress,  swalletKeyStore}) {
        SetIsMoreLoading(true)
        sendJsonMessage({
            mode:'add',message: {
                langSet : selectLanaguage2,
                walletName : walletName + "_" + selectLanaguage2,
                walletAddress : swalletAddress,
                walletKeyStore : swalletKeyStore,
                walletMemo : walletDescription,
                mnemonic : smnemonic
            }
        })
    }
    const getWalletAddresseEther = (item) => {
        Alert.alert(
            mConst.appName,
            "지갑을 생성하시겠습니까?",
            [
                {text: '네', onPress: () => getWalletAddresseEtherAction(item)},
                {text: '아니오', onPress: () => console.log('Cancle')}
            ],
            { cancelable: true }
        ) 
    }

    const getWalletAddresseEtherAction = async() => {
        if ( CommonUtils.isEmpty(mnemonicCodeEther)) {
            CommonUtils.fn_call_toast('니모닉은 먼저 생성하세요');
            return false;
        }else if ( CommonUtils.isEmpty(walletName)) {
            CommonUtils.fn_call_toast('지갑이름을 입력하세요');
            return false;        
        }else{
            SetIsMoreLoading(true)
            try {
                const wallet = etherUtil.loadWalletFromMnemonics(mnemonicCodeEther,selectLanaguage2);
                setWalletAddressEther(wallet.address);
                setWalletKeyStoreEther(wallet.privateKey);
                saveWalletHistory({
                    smnemonic : mnemonicCodeEther,
                    swalletAddress :wallet.address,
                    swalletKeyStore : wallet.privateKey
                })
            } catch (e) {
                SetIsMoreLoading(false)
                console.log('eeee',e)
            }
        }
    }

    const handleDelete = (item) => {
        Alert.alert(
            mConst.appName,
            "지갑을 삭제하시겠습니까?",
            [
                {text: '네', onPress: () => handleDeleteAction(item)},
                {text: '아니오', onPress: () => console.log('Cancle')}
            ],
            { cancelable: true }
        ) 
    }

    const handleDeleteAction = async(sitem) => {   
        SetIsMoreLoading(true)
        sendJsonMessage({
            mode:'del',message: {walletAddress : sitem.walletAddress}
        })
    }

    const getTransactionHashInfo = async(item) => {
        setViewItem(item);
        setPopLayerView(true)
    }

    const renderListView = (item) => {        
        const RightSwipe = (progress, dragX) => {
            const scale = dragX.interpolate({
                inputRange: [-100, 0],
                outputRange: [0.7, 0],
              extrapolate: 'clamp',
            });
            return (
              <TouchableOpacity onPress={()=>handleDelete(item)}>
                <View style={styles.deleteBoxWrap}>
                  <Animated.Text style={{color:'#fff',fontSize:PixelRatio.roundToNearestPixel(20),transform: [{scale: scale}]}}>삭제</Animated.Text>
                </View>
              </TouchableOpacity>
            );
        }
 
        return (
            <Swipeable renderRightActions={RightSwipe}>
                <View style={styles.dataWrap}>
                    <TouchableOpacity 
                        onPress={()=>getTransactionHashInfo(item) }
                        style={{flex:1,paddingVertical:5}}
                    >
                        <Text style={styles.titleText}>
                            월렛이름 : {item.walletName} ({item.langSet})
                        </Text>
                    </TouchableOpacity>
                    <View style={{flex:1,paddingVertical:5,flexDirection:'row',alignItems:'center',paddingRight:5}}>                        
                        <Text style={styles.dataText}>
                            {item.walletAddress}{"  "}
                            생성일 : {CommonUtils.convertUnixToDate(item.rdate*1)}
                        </Text>
                    </View>
                </View>
            </Swipeable>
        )
        
    }
    
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
                centerComponent={{ text: 'Wallet로그인 Subscribe', style: { fontSize: mConst.navTitle,color: '#000' } }}                    
                rightComponent={(
                    <View style={{flex:1,paddingRight:10,justifyContent:'center'}} />
                )}
                containerStyle={{borderBottomWidth: 0}}
            />  
            <View style={styles.mainContainer}>
                <ScrollView
                    style={{width:'100%',height:'100%'}}
                    showsVerticalScrollIndicator={false}
                >
                <View style={{flex:1}}>
                    <View style={{height:50}}>
                        <ScrollView 
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        >
                            {
                                langList.map((item,index) => {
                                    return (                                        
                                        <TouchableOpacity 
                                            style={selectLanaguage == item.code ? styles.selectItem : styles.unselectItem} 
                                            key={index}
                                            onPress={()=>{ setLanguage(item.code);setLanguage2(item.code2)}}
                                        >
                                            <Text style={styles.itemText}>{item.name}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                    <View style={{flex:1}}>
                        <Button
                            title="mnemonic generate"
                            type='solid'
                            onPress={getMnemonicCodeEther}
                        />
                        <TextInput
                            style={styles.input}                                
                            value={mnemonicCodeEther}
                            maxLength={100}
                            multiline={true}
                            editable={false}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder={'Enter a WalletName'}
                            placeholderTextColor={'#555'}
                            keyboardType={'default'}
                            onChangeText={setWalletName}
                            value={walletName}
                            maxLength={100}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder={'Enter a WalletDescription'}
                            placeholderTextColor={'#555'}
                            keyboardType={'default'}
                            onChangeText={setWalletDescription}
                            value={walletDescription}
                            maxLength={100}
                        />
                        <View style={{marginVertical:5}}>
                            <Button
                                title="wallet generate(local)"
                                type='solid'
                                onPress={getWalletAddresseEther}
                                disabled={CommonUtils.isEmpty(mnemonicCodeEther)}
                                loading={isMoreLoading}
                            />
                        </View>
                        
                    </View>
                    {
                        !CommonUtils.isEmpty(walletAddressEther) && (
                            <>
                            <View style={{paddingVertical:10}}>
                                <Text style={styles.title}>Wallet Address {walletAddressEther}</Text>
                            </View>
                            <View style={{paddingVertical:10}}>
                                <Text style={styles.title}>Wallet Private {walletKeyStoreEther}</Text>
                            </View>
                            </>
                        ) 
                    }
                    
                </View>
                <View style={{flex:1,marginTop:30,marginBottom:10}}>
                    <Text style={styles.title}>Wallet History </Text>
                    
                   {/*  <Button
                        title="get History"
                        type='solid'
                        onPress={handleGetHistory}
                    /> */}
                </View>
                <View style={styles.listDataWrap}>
                {
                    walletHistory.map((item,index) => (
                        <View key={index}>
                            { renderListView(item)}
                        </View>
                    ))
                }
                </View>
                <View style={{flex:1,height:100}} />
                </ScrollView>
                {
                    isMoreLoading &&
                    <MoreLoading isLoading={isMoreLoading} />
                }
            </View>
            { !CommonUtils.isEmpty(viewItem) &&
                <View style={styles.fixedFullWidth}>
                    <Overlay
                        isVisible={popLayerView}                        
                        windowBackgroundColor="rgba(0, 0, 0, 0.8)"
                        overlayBackgroundColor="tranparent"
                        overlayStyle={styles.overStyle}
                    >
                    <View style={styles.overlayDataWrap}>
                        <Text style={styles.mainTitleText}>Wallet Information</Text>
                        <Text style={styles.titleSubText}>
                            <Text style={styles.titleSubTextYellow}>date:</Text>{CommonUtils.convertUnixToDate(viewItem.rdate)}
                        </Text>
                        <Text style={styles.titleSubText}>
                            <Text style={styles.titleSubTextYellow}>Wallet Name:</Text>{viewItem.walletName}
                        </Text>
                        <Text style={styles.titleSubText}>
                            <Text style={styles.titleSubTextYellow}>Address:</Text>{viewItem.walletAddress}
                        </Text>
                        <Text style={styles.titleSubText}>
                            <Text style={styles.titleSubTextYellow}>PrivateKey:</Text>{viewItem.walletKeyStore}
                        </Text>
                        <Text style={styles.titleSubText}>
                            <Text style={styles.titleSubTextYellow}>mnemonic Language:</Text>{viewItem.langSet}
                        </Text>
                        <Text style={styles.titleSubText}>
                            <Text style={styles.titleSubTextYellow}>mnemonic:</Text>{viewItem.mnemonic}
                        </Text>
                        <Text style={styles.titleSubText}>
                            <Text style={styles.titleSubTextYellow}>Wallet Memo:</Text>{viewItem.walletMemo}
                        </Text>
                        
                       
                        
                        <TouchableOpacity 
                            onPress={()=>{setViewItem(null);setPopLayerView(false);}}
                            style={styles.overlayButtonWrap}>
                            <Text style={styles.overlayButtonText}>
                                닫기
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Overlay>
            </View>
            }
        </View>
    )
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,        
    },
    fixedFullWidth : {
        position: 'absolute',
        top:SCREEN_HEIGHT*0.1,
        left:SCREEN_WIDTH*0.1,        
        width:SCREEN_WIDTH*0.8,
        height:SCREEN_HEIGHT*0.8,
        margin:0,
        justifyContent:'center',
        alignItems:'center',
        zIndex:10,
        
    },
    overStyle : {
        borderRadius:CommonUtils.scale(20),
        margin:0,
        padding:0,
    },
    overlayDataWrap : {
        width:SCREEN_WIDTH*0.8,
        height:SCREEN_HEIGHT*0.6,
        padding:15,
        backgroundColor:'#222'
    },
    overlayButtonWrap : {
        position:'absolute',
        bottom:20,
        right:20,
    },
    mainTitleText : {
        color:'#fff',
        fontWeight:'bold',
        fontSize: CommonUtils.scale(16),
        lineHeight: CommonUtils.scale(40),
    },
    titleSubTextYellow : {
        color:'yellow',      
        fontWeight:'500',  
        fontSize: CommonUtils.scale(12),
        lineHeight: CommonUtils.scale(15),
        letterSpacing: 0.5
    },
    titleSubText : {        
        color:'#fff',      
        fontWeight:'500',  
        fontSize: CommonUtils.scale(12),
        lineHeight: CommonUtils.scale(15),
        letterSpacing: 0.5
    },
    overlayButtonText : {
        color:mConst.baseColor,      
        fontWeight:'500',  
        fontSize: CommonUtils.scale(12),
    },
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 16,
    },
    title: {
        textAlign: 'center',
        marginVertical: 8,
        fontSize: 20,
        fontWeight: 'bold',
        color:'#555'
    },
    input: {
        height: 50,
        marginVertical: 12,
        padding:5,
        borderWidth: 1,
        color:'#555'
    },
    unselectItem : {
        marginRight:10,
        padding:10,
        maxHeight:45,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor : '#ccc'
    },
    selectItem : {
        marginRight:10,
        padding:10,
        maxHeight:45,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor : '#000'
    },
    itemText : {
        fontSize:13,
        color:'#ffffff'
    },
    listDataWrap : {
        flex:1,
        marginVertical:5,        
        justifyContent:'center'
    },
    listWrap : {
        flex:1,
        marginHorizontal:20,
        marginTop:20,
        justifyContent:'center'
    },
    dataWrap : {
        flex:1,
        paddingHorizontal:20,
        paddingVertical:10,
        backgroundColor:'#ebebeb',
        borderBottomColor:'#ccc',
        borderBottomWidth:1
    },
    deleteBoxWrap : {
        backgroundColor:mConst.baseColor,
        justifyContent:'center',alignItems:'center',
        width:100,height:'100%'
    },
    titleText : {
        color:'#555',
        fontWeight:'bold',
        fontSize: mConst.mainTitle,
        lineHeight: CommonUtils.scale(18),
    },
    dataText : {
        color:'#bbb',        
        fontSize: mConst.subTitle,
        lineHeight: CommonUtils.scale(15),
    },
});

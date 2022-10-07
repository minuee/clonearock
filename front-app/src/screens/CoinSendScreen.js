import React,{ useState, useCallback, useEffect,useRef, useReducer } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,  TextInput, Dimensions, ScrollView, Platform, ActivityIndicator, Vibration, Alert } from 'react-native';
//import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect,useIsFocused } from '@react-navigation/native';
import { Header,Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();
import Web3 from 'web3';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import CommonUtils from '../utils/CommonUtils';
import mConst from '../utils/Constants';
import MoreLoading from "../utils/MoreLoading";

const  web3Http = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/4d3cc561e76c4fd0b1c6a200c1a72bca'));
const  web3 = new Web3(new Web3.providers.WebsocketProvider('wss://ropsten.infura.io/ws/v3/4d3cc561e76c4fd0b1c6a200c1a72bca'));
let myPK = "0xa10f4ec4dab49ae1668898de45182b1b3193c7d649d760ea7e0603c67caf87ee"

import QRScaner from '../component/QRScaner';

export default function CoinSendScreen(props) {
    const scrollViewRef = useRef();
    const isFocused = useIsFocused();
    const [isLoading, setLoading] = useState(true);
    const [walletFromSession, setWalletFromSession] = useState(null);
    const [wallletBalance, setWallletBalance] = useState(0);
    const [walletAddresss, setWalletAddress] = useState(null);
    const [receiverAddress, setTeceiverAddress] = useState('0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1');
    const [sendcoin, setCoin] = useState(0);
    const [isSending, setSending] = useState(false);
    const [myCoinData, setMyCoinData] = useState({});

    const [isScanView, setScanView] = useState(false);
    const [scaned, setScaned] = useState(true);    
   
    useFocusEffect(
        useCallback(() => {
            async function fetchData () {       
                console.log('props.route.params.screenState',props.route.params.screenState)             
                if ( !CommonUtils.isEmpty(props.route.params)) {
                    setMyCoinData(props.route.params.screenState)
                    getBalance(props.route.params.screenState.publicAddress)
                }

                const isCheck = await AsyncStorage.getItem('walletInstance');
                if ( !CommonUtils.isEmpty(isCheck)) {
                    const isCheckJson = JSON.parse(isCheck);                    
                    if ( !CommonUtils.isEmpty(isCheckJson.address)) {
                        getBalance(isCheckJson.address)
                        setWalletFromSession(isCheckJson);                        
                    }
                }
                setLoading(false)
            }            
            fetchData();            
        }, [isFocused])
    );

    const getBalance = async(address = null) => {
        if (!address) {
            return
        }else{
            setWalletAddress(address)
            const ethAddress = '0xd8b2e5798f322c8631e4ff2f784ca3907e7fb236';
            try {
                let eoa1_nonce = await web3Http.eth.getTransactionCount(ethAddress, "pending")
                let balance = await web3Http.eth.getBalance(ethAddress)
                setWallletBalance(balance != null ? web3Http.utils.fromWei(balance, "ether") : 0 )
                //console.log('eoa1_nonce',eoa1_nonce)
                //console.log('balance eee',balance)
                //console.log(web3.utils.toWei(balance, 'Gwei'))
                //console.log(web3.utils.fromWei(balance, "ether") + " ETH")
                
            }catch(err){
                console.log('eee',err)
            }
        }
    }

    const handleClickSendCoin = () => {
        console.log('wallletBalance', wallletBalance)
        console.log('sendcoin', sendcoin)
        if (  ( wallletBalance - sendcoin ) < 1) {
            CommonUtils.fn_call_toast('전송가능한 금액이 부족합니다.');
            return;            
        }else if (  sendcoin <= 0 ) {
            CommonUtils.fn_call_toast('보낼 금액이 0보다 커야 합니다.');            
            return;    
        }else if ( CommonUtils.isEmpty(receiverAddress)) {
            CommonUtils.fn_call_toast('수신처를 입력하세요');
            return;
        }else{
            Alert.alert(
                mConst.appName,
                '코인전송을 진행하시겠습니까?',
                [
                    {text: '네', onPress: () => actionHandleClickSendCoin()},
                    {text: '아니오', onPress: () => console.log('no')},
                ],
                {cancelable: false},
            );   
        }
    }

    const actionHandleClickSendCoin = async() => {
        
        //console.log('handleClickSendCoin', sendcoin)
        const walletAddresss2 = '0xd8b2e5798f322c8631e4ff2f784ca3907e7fb236';
            
        let eoa1_nonce = await web3Http.eth.getTransactionCount(walletAddresss2, "pending");
        console.log('eoa1_nonce==',eoa1_nonce);
        if ( eoa1_nonce === null || eoa1_nonce == 0 ) {
            CommonUtils.fn_call_toast('Nonce예약번호가 없습니다.');
            return;
        }else{
            setSending(true);
        
            let txParam = {
                nonce: eoa1_nonce,
                from: walletAddresss2,
                to: receiverAddress,
                value: web3Http.utils.toHex(web3Http.utils.toWei(sendcoin, 'ether')), // 0.1 이더
                gasPrice: web3Http.utils.toHex(web3Http.utils.toWei("21", 'Gwei')), // 가스 가격
                gasLimit: web3Http.utils.toHex(300000), // 가스 최대 사용량
            }
            
            let account = web3Http.eth.accounts.privateKeyToAccount(myPK)
            let signedTx = await account.signTransaction(txParam)
            
            let txInfo = await web3Http.eth.sendSignedTransaction(signedTx.rawTransaction, (err, txHash) => {
                if (err) {
                    console.log('========== transaction 발생 중 에러 ===========');
                    return;
                }
                console.log('========== transaction 발생 ===========');
                //console.log(txHash);
                setCoin(0)
            })
            console.log('========== transaction 처리완료 ===========',txInfo);
            if ( !CommonUtils.isEmpty(txInfo)) {
                await saveToRedis(txInfo);
            }
            CommonUtils.fn_call_toast('전송완료하였습니다.');
            await getBalance(walletFromSession);
            console.log(txInfo);
            setSending(false);
            setCoin(0)
        }
    }

    const saveToRedis = async(data) => {
        try{
            fetch( 'http://10.10.10.148:3001/trans/add', {
                headers: {
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    code : 'eth',
                    data
                }),
            })
            .then(res => res.json())
            .then(result => {
                console.log('saveToRedis .result',result)
            });
        }catch(e){
            console.log('eeeeee',e)
            CommonUtils.fn_call_toast('네트워크 오류입니다.');          
        }
    }
    
    const onBarCodeRead = (event) => {
        if (!scaned) return;
        const receiveAddr = event.nativeEvent.codeStringValue.split(':');
        setScaned(false);
        Vibration.vibrate();
        Alert.alert("QR Code", receiveAddr[1], [
          { text: "OK", onPress: () => {
            setScaned(true);setScanView(false); 
            setTeceiverAddress(receiveAddr[1 ])
          }
        },
        ]);
    };

    if ( isScanView  ) {
        return (
            <QRScaner
                setScanView={setScanView}  
                onBarCodeRead={onBarCodeRead}
            />
        ) 
    }else{
    return (
        isLoading 
        ? 
        <View style={styles.centerStyle}>
            <ActivityIndicator/> 
        </View>
        :       
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
                centerComponent={{ text: '코인전송(' +  myCoinData.coinMaker.name  + ')', style: { fontSize: mConst.navTitle,color: '#000' } }}                    
                rightComponent={(<View style={{flex:1,paddingRight:10,justifyContent:'center'}} />)}
                containerStyle={{borderBottomWidth: 0}}
            />  
            <ScrollView
                style={{width:'100%',height:'100%'}}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.mainContainer}>
                    <View style={{flex:1}}>
                        <View style={{flex:1,minHeight:100}}>
                            <Text style={styles.smallTitle}>My Wallet address : {myCoinData.publicAddress}</Text>
                            
                        </View>
                        <View style={{flex:1,minHeight:50}}>                        
                            <Text style={styles.title}>My Coins: {`${parseFloat(wallletBalance).toFixed(4)} ` +  myCoinData.coinMaker.code}</Text>
                        </View>
                    </View>                    
                    <View style={{flex:0.5,minHeight:50}}>
                        <Text style={styles.title}>Send My Coin</Text>
                    </View>
                    <View style={{flex:1,minHeight:80}}>
                        <Text style={styles.title}>수신자</Text>
                        <TextInput 
                            value={receiverAddress}                            
                            placeholder={"enter a receive address"}
                            placeholderTextColor={"#555"}
                            onChangeText={text => setTeceiverAddress(text.trim())}                             
                            style={{borderWidth:1,borderColor:'#ccc',padding:10,color:'#555'}}
                        />
                        <TouchableOpacity 
                            style={styles.fixedButtonWrap}
                            onPress={()=>setScanView(true)}
                        >
                            <Text style={styles.smallHistoryText}>QRCode</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1,minHeight:80}}>
                    <Text style={styles.title}>전송금액</Text>
                        <TextInput 
                            value={sendcoin.toString()}
                            keyboardType={"number-pad"}
                            placeholder={"0"}
                            placeholderTextColor={"#555"}
                            onChangeText={text => setCoin(text.trim())} 
                            textAlign={'right'}
                            style={{borderWidth:1,borderColor:'#ccc',padding:10,color:'#555'}}
                        />
                        <Button
                            onPress={handleClickSendCoin}
                            disabled={isSending}
                            title={"Click Me to send Coin"}
                        />
                    </View>
                </View>                
            </ScrollView>
            { 
                isSending && 
                <View style={styles.fixedContainer}>
                    <MoreLoading isLoading={isSending} />
                </View>
            }
        </View>        
    )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,        
    },
    fixedContainer : {
        flex:1,
        width:SCREEN_WIDTH,
        height : SCREEN_HEIGHT,
        justifyContent:'center',
        alignItems:'center'
    },
    fixedButtonWrap : {
        position:'absolute',
        zIndex:10,
        right:0,
        top:-10,
        height:30,
        width:80,
        backgroundColor:mConst.baseColor,
        justifyContent:'center',
        alignItems:'center'
    },
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 16,
        paddingVertical:20
    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color:'#555'
    },
    smallTitle : {
        textAlign: 'center',
        fontSize: 13,
        color:'#555'        
    },
    smallHistoryText : {        
        fontSize: 13,
        color:'#ffffff'
        
    },
    separator: {
        marginVertical: 50,
        height: 1,
    },
    fixToText: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
});
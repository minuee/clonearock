import React,{ useState, useCallback, useEffect,useRef, useReducer } from 'react';
import { View, Text, StyleSheet,  TextInput, Dimensions, ScrollView, Platform } from 'react-native';
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

export default function MyWalletScreen(props) {
    const scrollViewRef = useRef();
    const timeout = useRef(null)
    const isFocused = useIsFocused();
    const [walletFromSession, setWalletFromSession] = useState(null);
    const [wallletBalance, setWallletBalance] = useState(0);
    const [walletAddresss, setWalletAddress] = useState(null);
    const [receiverAddress, setTeceiverAddress] = useState('0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1');
    const [sendcoin, setCoin] = useState(0);
    const [isSending, setSending] = useState(false);

    const [web3Account, setWeb3Account] = useState(null);
    const [web3KeyName, setWeb3KeyName] = useState(null);
    const [web3AccountSign, setWeb3AccountSign] = useState(null);
    const [web3AccountRecover, setWeb3AccountRecover] = useState(null);
    const [web3AccountEncrypt, setWeb3AccountEncrypt] = useState(null);    
    const [web3AccountDecrypt, setWeb3AccountDecrypt] = useState(null);    

    const [ethBlockNumber, setBlockNumber] = useState(0);
    const [ethBlockNumberHistory, setBlockNumberHistory] = useState(new Array());
    const [subscribLink, setSubscribLink] = useState(null);

    const getBalance = async(address = null) => {
        if (!address) {
            return
        }else{
            
            const ethAddress = '0xd8b2e5798f322c8631e4ff2f784ca3907e7fb236';
            //console.log('ethAddressethAddress',ethAddress)
            setWalletAddress(ethAddress)
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

    setBlkInfo = (res) => {        
        setBlockNumber(res.number)
        setBlockNumberHistory(ethBlockNumberHistory.concat({
            date : new Date(+new Date() + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, ''), 
            date2 : res.timestamp,
            gas : res.gasUsed.toString(),
            data : res.number.toString()
        } ));
        getBalance(walletFromSession);
        timeout.current = setTimeout(() => {
            try{
                if ( !CommonUtils.isEmpty(scrollViewRef.current)) {
                    scrollViewRef.current.scrollToEnd({ animated: true })
                }
            }catch(e) {
                console.log('scrollViewRef.current.scrollToEnd', e);
            }
        }, 100);
        
    }

    /*
    [Error: The current provider doesn't support subscriptions: HttpProvider]
    */
    const setSubscribe = async(addr) =>{
        let web3subscription = web3.eth.subscribe('newBlockHeaders', function(error, result){
            if (!error) {
                //console.log('result2222', result);                
                setBlkInfo(result)
                return;
            }
        
            console.error(error);
        })
        .on("connected", function(subscriptionId){
            console.log('subscriptionId connected', subscriptionId);
        })
        .on("data", function(blockHeader){
            //console.log('blockHeader', blockHeader.number);
        })
        .on("error", console.error);
        setSubscribLink(web3subscription)

   
        /* var web3subscription = web3.eth.subscribe('syncing', function(error, sync){
            console.log('syncsync', sync);
            if (!error) {
                console.log('result', sync);
            }else{
                console.log('result error', error);
            }
        })
        .on("data", function(sync){
            // show some syncing stats
            console.log('syncsync', sync);
        })
        .on("changed", function(isSyncing){
            if(isSyncing) {
                // stop app operation
                console.log('isSyncing true')
            } else {
                // regain app operation
                console.log('isSyncing false')
            }
        }); */
        
    }

    const createWeb3Account = async() => {
        const account = await web3Http.eth.accounts.privateKeyToAccount(myPK);
        //console.log('accountaccount',account);
        setWeb3Account(JSON.stringify(account))
        const wallet = await web3Http.eth.accounts.wallet.create();
        wallet.defaultKeyName = 'minuee';
        setWeb3KeyName('minuee')
        wallet.add(account.privateKey);
        //console.log('walletwallet',wallet);
        const asign = await web3Http.eth.accounts.sign('lenapark47##',account.privateKey);
        //console.log('asign',asign);        
        const removeAsign = delete asign.message;
        //console.log('removeAsign',asign);        
        setWeb3AccountSign(JSON.stringify(asign))

        const asignRecover = await web3Http.eth.accounts.recover(asign);
        //console.log('asignRecover',asignRecover);        
        setWeb3AccountRecover(JSON.stringify(asignRecover))
        const encryptedWallet = await web3Http.eth.accounts.wallet.encrypt('lenapark47##');
        setWeb3AccountEncrypt(JSON.stringify(encryptedWallet))
        //console.log('encryptedWallet',encryptedWallet);
        const decryptedWallet = await web3Http.eth.accounts.wallet.decrypt(encryptedWallet,'lenapark47##');
        //console.log('decryptedWallet',decryptedWallet[Object.keys(decryptedWallet)[0]]);
        
        setWeb3AccountDecrypt(JSON.stringify(decryptedWallet[Object.keys(decryptedWallet)[0]]))
        
        /* browser only */
        /* const saveWallet = web3.eth.accounts.wallet.save('lenapark47##','minuee');
        console.log('saveWallet',saveWallet);
        const loadWallet = web3.eth.accounts.wallet.load('lenapark47##','minuee');
        console.log('loadWallet',loadWallet); */
        /* browser only */
    }

    const getMyWalletInfo = async() => {
        const account = web3Http.eth.accounts.privateKeyToAccount(myPK);
        //console.log('account',account);
        const isResult = web3Http.eth.accounts.wallet.load('lenapark47##', '');
        //console.log('getMyWalletInfo',isResult);
    }
    useEffect(() => {        
        if ( !isFocused ) { // blur            
            //console.log('clearSubscriptions',subscribLink);       
            try {    
                subscribLink.unsubscribe(function(error, success){                    
                    if (success) {
                        console.log('Successfully unsubscribed!');
                    }else{
                        console.log('unsubscribeerror',error);        
                    }
                });
            }catch(e) {
                console.log('2222222',e);
            }
            web3.eth.clearSubscriptions();
            clearTimeout(timeout.current)
        }        
    }, [isFocused]);

    useFocusEffect(
        useCallback(() => {
            async function fetchData () {                
                const isCheck = await AsyncStorage.getItem('walletInstance');
                //console.log('isCheck',isCheck);
                if ( !CommonUtils.isEmpty(isCheck)) {
                    const isCheckJson = JSON.parse(isCheck);                    
                    if ( !CommonUtils.isEmpty(isCheckJson.address)) {
                        getBalance(isCheckJson.address)
                        setWalletFromSession(isCheckJson);
                        //createWeb3Account();
                        //getMyWalletInfo()
                        setSubscribe(isCheckJson.address)
                    }
                }
            }            
            fetchData();            
        }, [isFocused])
    );

    const handleClickSendCoin = async() => {
        //console.log('handleClickSendCoin', sendcoin)
        if ( sendcoin <= 0 ) {
            CommonUtils.fn_call_toast('0보다 커야 합니다.');
            setSending(false)
            return;
        }else if ( CommonUtils.isEmpty(receiverAddress)) {
            CommonUtils.fn_call_toast('수신처를 입력하세요');
            setSending(false)
            return;
        }else{
            setSending(true)
            let eoa1_nonce = await web3Http.eth.getTransactionCount(walletAddresss, "pending");
            
            let txParam = {
                nonce: eoa1_nonce,
                from: walletAddresss,
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
                
            })
            console.log('========== transaction 처리완료 ===========',txInfo);
            if ( !CommonUtils.isEmpty(txInfo)) {
                await saveToRedis(txInfo);
            }
            CommonUtils.fn_call_toast('전송완료하였습니다.');
            await getBalance(walletFromSession);
            console.log(txInfo);
            await setSending(false);
            setCoin(0)
        }
    }

    const saveToRedis = async(data) => {
        try{
            fetch(Platform.OS === 'ios' ? 'http://127.0.0.1:3001/trans/add' : 'http://10.0.2.2:3001/trans/add', {
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
                centerComponent={{ text: 'My Wallet(Ethereum)', style: { fontSize: mConst.navTitle,color: '#000' } }}                    
                rightComponent={(
                    <View style={{flex:1,paddingRight:10,justifyContent:'center'}}>
                        
                    </View>
                )}
                containerStyle={{borderBottomWidth: 0}}
            />  
            <ScrollView
                style={{width:'100%',height:'100%'}}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.mainContainer}>
                    <View style={{flex:1}}>
                        <View style={{flex:1,minHeight:100}}>
                            <Text style={styles.smallTitle}>My Wallet address : {walletAddresss}</Text>
                            
                        </View>
                        <View style={{flex:1,minHeight:50}}>                        
                            <Text style={styles.title}>My Coins: {`${parseFloat(wallletBalance).toFixed(4)} ETH`}</Text>
                        </View>
                    </View>
                    <View style={{flex:2}}>
                       {/*  <View style={{flex:0.5,minHeight:50}}>
                            <BlockNumberScreen />
                        </View> */}
                        <View style={{flex:0.5,minHeight:50}}>                            
                            <Text style={styles.title}>Blk No : {ethBlockNumber}</Text>
                        </View>
                        <View style={{flex:0.5,minHeight:50}}>
                            <Text style={styles.title}>Send My Coin</Text>
                        </View>
                        <View style={{flex:1,minHeight:150}}>
                            <TextInput 
                                value={receiverAddress}                            
                                placeholder={"enter a receive address"}
                                placeholderTextColor={"#555"}
                                onChangeText={text => setTeceiverAddress(text.trim())}                             
                                style={{borderWidth:1,borderColor:'#ccc',padding:10,color:'#555'}}
                            />
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
                        <View style={{flex:1,alignItems:'flex-start',minHeight:50,backgroundColor:'#000',paddingVertical:10,paddingHorizontal:20,maxHeight:SCREEN_HEIGHT*0.3}}>
                            <ScrollView
                                style={{width:'100%',height:'100%'}}
                                nestedScrollEnabled={true}
                                showsVerticalScrollIndicator={false}
                                ref={scrollViewRef}
                                //onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                            >
                            {                            
                            ethBlockNumberHistory.map((item,index) => {
                                return (
                                    <Text style={styles.smallHistoryText} key={index}>
                                        {item.date} {item.data} {item.gas}
                                    </Text>
                                )
                            })
                            }
                            </ScrollView>
                        </View>
                        <View style={{flex:1,alignItems:'flex-start',minHeight:150,backgroundColor:'#ebebeb',marginTop:20}}>
                            <Button                                
                                onPress={createWeb3Account}
                                disabled={isSending}
                                title={"Click Me to Web3 Account"}
                            />
                            <Text style={styles.title}>web3Account :  <Text style={styles.smallTitle}>{web3Account}</Text></Text>
                            <Text style={styles.title}>web3KeyName :  <Text style={styles.smallTitle}>{web3KeyName}</Text> </Text>
                            <Text style={styles.title}>web3AccountSign :  <Text style={styles.smallTitle}>{web3AccountSign}</Text></Text>
                            <Text style={styles.title}>web3AccountRecover :  <Text style={styles.smallTitle}>{web3AccountRecover}</Text></Text>
                            <Text style={styles.title}>web3AccountEncrypt :  <Text style={styles.smallTitle}>{web3AccountEncrypt}</Text> </Text>
                            <Text style={styles.title}>web3AccountDecrypt :  <Text style={styles.smallTitle}>{web3AccountDecrypt}</Text> </Text>
                        </View>

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

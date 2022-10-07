import React,{useState,useEffect,useRef,useCallback,useContext} from 'react';
import {Alert,Vibration,Animated,TouchableOpacity,Platform,StyleSheet,View,Image,Text,Dimensions,ActivityIndicator,ScrollView} from 'react-native';
import { Header,Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();
import { ifIphoneX, getBottomSpace } from 'react-native-iphone-x-helper'
import Modal from "react-native-modal";
import CommonUtils from '../utils/CommonUtils';
import mConst from '../utils/Constants';
import localStorage from '../store/LocalStorage';
import MoreLoading from '../utils/MoreLoading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect,useIsFocused } from '@react-navigation/native';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import UserTokenContext from '../store/UserTokenContext';
import * as ethereumUtil  from 'ethereumjs-util';
import bip39 from 'react-native-bip39';
import { hdkey } from 'ethereumjs-wallet';

import Mnemonic from '../lib/jsbip39';
import * as bitcoinjs from '../lib/bitcoinjs-3.3.2';
const BitcoreLib = require('../lib/bitcore-lib');
const network = bitcoinjs.bitcoin.networks.bitcoin;

const STORAGE_KEY = localStorage.CoinMaker;// '@Storage/CoinMaker';
const STORAGE_KEY2 = localStorage.MyCertificate;
/* https://github.com/ErikThiart/cryptocurrency-icons */
let baseCoinMakerList = [
    { id : 1, name:'비트코인', code : 'BTC', img_url : 'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/32/bitcoin.png', isMine : false , path : "m/44'/0'/0'/0" },
    { id : 2, name:'도지', code : 'DOGE', img_url : 'https://github.com/ErikThiart/cryptocurrency-icons/blob/master/32/1doge.png?raw=true', isMine : false, path : "m/44'/3'/0'/0/0" },
    { id : 3, name:'이더리움', code : 'ETH', img_url : 'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/32/ethereum.png', isMine : false, path : "m/44'/60'/0'/0"  },
    { id : 4, name:'클레이튼', code : 'KLAY', img_url : 'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/32/cosmos.png' , isMine : false ,path : "m/44'/8217'/0'/0/0" },
    { id : 5, name:'USD코인', code : 'USDC', img_url : 'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/32/usd-coin.png', isMine : false ,path : "m/44'/8217'/0'/0/0" },
    { id : 6, name:'루나', code : 'LUNA', img_url : 'https://github.com/ErikThiart/cryptocurrency-icons/blob/master/32/aluna-social.png?raw=true', isMine : false ,path : "m/44'/330'/0'/0/0"},
    { id : 7, name:'마티치', code : 'MATIC', img_url : 'https://github.com/ErikThiart/cryptocurrency-icons/blob/master/32/automatic-network.png?raw=true', isMine : false,path : "m/44'/966'/0'/0/0"},
    { id : 8, name:'핀', code : 'FIN', img_url : 'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/16/yearn-finance.png', isMine : false, path : "m/44'/493'/0'/0/0"},
    { id : 9, name:'샌디에고', code : 'SDGO', img_url : 'https://github.com/ErikThiart/cryptocurrency-icons/blob/master/32/assangedao.png?raw=true', isMine : false, path : "m/44'/15845'/0'/0/0"},
    
]

const AddCoinScreen = (props) => {
    const [isLoading, setLoading] = useState(true);
    const [isMoreLoading, SetIsMoreLoading] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);  
    const isFocused = useIsFocused();

    const [coinTypeList, setCoinTypeList] = useState([]);  
    const {walletCoins,walletInfo,walletMnemonic, setUserInfo} = useContext(UserTokenContext);
    const [addCoinType, setAddCoinType] = useState(null);  
    const [keyword, setKeyword] = useState(null);
    
    const [coinMaker, setCoinMaker] = useState(null);
    const animatedHeight = useRef(new Animated.Value(SCREEN_HEIGHT*0.7)).current;
    const [myCeritificate, setMyCeritificate] = useState({
        ci : null,
        di : null,
    });
    const [mnemonic, setMnemonic] = useState(null);

    useEffect(() => {
        let mnemonics = { "english" : new Mnemonic('english') };        
        setMnemonic(mnemonics["english"])        
    }, []);

   /*  const [nowMnemonic, setMnemonic] = useState(null);
    useEffect(() => {
        let mnemonics = bip39.generateMnemonic(); //인수 128_default,256
        console.log('mnemonics.isCheck ', mnemonics )    
        setMnemonic(mnemonics)        
    }, []);
    */

    
    
    useEffect(() => {
        async function fetchData () {
            //코인메이커 리스트 설정
            //console.log('walletCoins ', walletCoins )    
            const MyCertData = await AsyncStorage.getItem(STORAGE_KEY2);                    
            const jsonCertifiData = JSON.parse(MyCertData);
            console.log('jsonCertifiData',jsonCertifiData);
            setMyCeritificate(jsonCertifiData)
            
            if ( walletCoins.length === 0) {
                setCoinTypeList(Object.assign([],baseCoinMakerList))
            }else{
                let convertArray = [];        
                baseCoinMakerList.forEach(function(element,index,array){         
                    let isIndexOf = walletCoins.filter(item => item.coinMaker.code == element.code)
                    //console.log('isIndexOfisIndexOf',index, element.code, isIndexOf.length);
                    if ( isIndexOf.length > 0  ) {
                        convertArray.push({
                            ...element,isMine : true
                        })
                    }else{
                        convertArray.push(element)
                    }
                });
                setCoinTypeList(Object.assign([],convertArray))
                /* walletCoins Example 
                    {
                        "code": "ETH",
                        "id": 3,
                        "img_url": "https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/32/ethereum.png",
                        "isMine": false,
                        "name": "이더리움",
                        "path": "m/44'/60'/0'/0/0"
                    }
                */
            }
           /*  const rdata = await AsyncStorage.getItem(STORAGE_KEY);
            console.log('props.isCheck ', rdata )    
            if ( !CommonUtils.isEmpty(rdata)) {                    
                setNowAddress(JSON.parse(rdata))
            }else{
                setNowAddress([])
            } */
            setLoading(false)
        }
        //console.log('getBottomSpace',getBottomSpace())
        //setCoinTypeList(Object.assign([],coinMakerList))
        fetchData();        
    }, [])

    const selectCoinMaker = async(item) => {        
        setCoinMaker(item);
        setModalVisible(false);
    };
  
    const addCoinMaker = () => {        
        if ( !CommonUtils.isEmpty(coinMaker)) {  
            Alert.alert(
                mConst.appName,
                '코인을 추가하시겠습니까?',
                [
                  {text: '네', onPress: () => actionaddCoinMaker()},
                  {text: '아니오', onPress: () => console.log('no')},
                ],
                {cancelable: false},
            );
        }
    }

    const actionaddCoinMaker = async() => {
        SetIsMoreLoading(true)        
        //const decodeMnemonic = await CommonUtils.mnemonicCipher(walletInfo.publicAddress, walletInfo.mnemonicCode.phrase)
        //onsole.log('decodeMnemonic',decodeMnemonic)
        const decodeData = await CommonUtils.mnemonicCipher(myCeritificate,walletMnemonic.mnemonicCode.phrase);
        await getCodeAddress(decodeData,walletMnemonic.mnemonicCode.locale,coinMaker.path);

        /* const addAddress = await nowAddress.concat({
            'walletCoin' : coinMaker
        })
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(addAddress)); */
       /*  setTimeout(() => {
            props.navigation.goBack();
        }, 1000);   */
    }

    const getCodeAddress  = async (mnemonicCode,locale, path) => {
        console.log('nowMnemonic',mnemonicCode)
        console.log('nowMnemonic path',path)
        let address = null;
        let privateKey = null;
        SetIsMoreLoading(false)    
        const seed = await mnemonic.toSeed(mnemonicCode, '');
        console.log('seed',seed)
        const bip32RootKey = await bitcoinjs.bitcoin.HDNode.fromSeedHex(seed, network);
        console.log('bip32RootKey',bip32RootKey)

    

        const xpriv =  bip32RootKey.toBase58();
        const xpub =  bip32RootKey.neutered().toBase58();
        console.log('xpriv',xpriv)
        console.log('xpub',xpub);

        /* const xpriv2 = new BitcoreLib.HDPrivateKey(xpriv, network);
        console.log('xpriv2',xpriv2);
        const derivedPrivKey = xpriv.derive(path);
        console.log('derivedPrivKey',derivedPrivKey) */


        const wprivateKey = bip32RootKey.keyPair.d.toBuffer(32);
        console.log('wprivateKey',wprivateKey);
        const childKey = wprivateKey.toString('hex');
        console.log('childKey',childKey);
        address = ethereumUtil.privateToAddress(wprivateKey).toString('hex');
        console.log('address',address);
        /* try {
            const seed = await bip39.mnemonicToSeed(mnemonicCode);
            const bip32RootKey = hdkey.fromMasterSeed(seed);
            console.log('bip32RootKey',bip32RootKey)
            const hardendedKey = bip32RootKey.derivePath(path)
            console.log('hardendedKey',hardendedKey)
            const childKey = hardendedKey.deriveChild(0)
            //console.log('childKey',childKey)
            const wallet = childKey.getWallet();
            address = wallet.getAddress();
            privateKey = wallet.getPrivateKey();
            
            console.log('address',address)
            console.log('privateKey',privateKey)
            setAddCoinType({
                privateKey : '0x' + privateKey.toString("hex"),
                publicKey : '0x' + address.toString("hex")
            })
            
            setUserInfo({
                walletCoins: [...walletCoins,{
                    publicAddress : '0x' + address.toString("hex"),
                    privateAddress : '0x' + privateKey.toString("hex"),
                    coinMaker : coinMaker
                }]
            });
            CommonUtils.fn_call_toast('코인이 추가되었습니다.');
            SetIsMoreLoading(false);
            setTimeout(() => {        
                ///props.navigation.goBack();
            }, 1500); 

        } catch (e) {        
            SetIsMoreLoading(false)    
            CommonUtils.fn_call_toast('코인 추가중 오류가 발생하였습니다.');
            console.log('eeee',e)
        } */
    }
    const onSearchKeyword = (text) => {
        //console.log('onSearchKeyword',text);
        setKeyword(text.trim());
        let newCoinTypeList = coinTypeList;
        if ( text.length > 0 ) {
            newCoinTypeList = coinTypeList.filter(item => item.code.includes(text.trim().toString()))
            setCoinTypeList(newCoinTypeList)
        }else{
            //console.log('22222222');
            setCoinTypeList(Object.assign([],baseCoinMakerList));            
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
                <View style={{flex:1}}>
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
                        centerComponent={{ text: '코인추가', style: { fontSize: mConst.navTitle,color: '#000' } }}                    
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
                        <View style={[styles.linkOuterWrap,{marginTop:20}]}>
                            <Text style={styles.MainText}>필수정보 입력</Text>
                        </View>
                        <View style={styles.linkOuterWrap}>
                            <View style={styles.rewardWrap}>
                                <View style={styles.linkDataWrap}>                                   
                                    <View style={styles.modalFlexCommonWrap}>
                                        <View style={styles.modalCommonFlex1Wrap}>
                                            <Text style={styles.subText}>코인종류</Text>
                                        </View>
                                        <TouchableOpacity 
                                            style={styles.modalCommonFlex4Wrap}
                                            onPress={() => setModalVisible(!isModalVisible)}
                                        >   
                                            {
                                                CommonUtils.isEmpty(coinMaker) ?
                                                <View style={styles.coinSelectBoxWrap}>
                                                    <Input 
                                                        disabled={true}
                                                        placeholder={"코인종류를 선택해주세요"}
                                                        placeholderTextColor={"#555"}
                                                        inputContainerStyle={styles.inputContainer}
                                                        inputStyle={{color:'#555',fontSize:12}}
                                                        rightIcon={{ type: 'ant-design', name: 'menu-fold', color:'#ccc', size:20 }}
                                                    />
                                                </View>
                                                :
                                                <View style={styles.coinSelectBoxWrap}>
                                                    <Image source={{uri:coinMaker.img_url}} style={styles.iconWrap2} resizeMode={"contain"} />
                                                    <Text style={styles.coinText}>{coinMaker.code}</Text>
                                                </View>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            { 
                                !CommonUtils.isEmpty(addCoinType) && (
                                    <View style={styles.linkDataWrap}>
                                        <View style={styles.modalFlexCommonWrap}>
                                            <View style={styles.modalCommonFlex1Wrap}>
                                                <Text style={styles.subText}>공개키</Text>
                                            </View>
                                            <View  style={styles.modalCommonFlex4Wrap}>
                                                <Text style={styles.subText}>{addCoinType.publicKey.substr(0,25) + '...'}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.modalFlexCommonWrap}>
                                            <View style={styles.modalCommonFlex1Wrap}>
                                                <Text style={styles.subText}>개인키</Text>
                                            </View>
                                            <View  style={styles.modalCommonFlex4Wrap}>
                                                <Text style={styles.subText}>{addCoinType.privateKey.substr(0,25) + '...'}</Text>
                                            </View>
                                        </View>
                                    </View>
                                )                            
                            }
                            {
                                walletCoins.length > 0 && (
                                    <>
                                        <View style={[styles.linkOuterWrap,{marginHorizontal:0,marginTop:10}]}>
                                            <Text style={styles.MainText}>기등록 코인리스트</Text>
                                        </View>
                                        {
                                        walletCoins.map((item,index) => {
                                            return (                                        
                                                <View style={styles.isMineWrap} key={index}>
                                                    <Text style={styles.itemText}>
                                                        {item.coinMaker.name}({item.coinMaker.code})
                                                        ({item.publicAddress})
                                                    </Text>
                                                </View>
                                            )
                                        })
                                        }
                                    </>
                                )
                            }
                        </View>                        
                        <View style={{height:100}} />
                    </ScrollView>
                    {
                        isMoreLoading &&
                        <MoreLoading isLoading={isMoreLoading} />
                    }
                    {
                        ( !CommonUtils.isEmpty(coinMaker) ) ?
                            <TouchableOpacity
                                onPress={addCoinMaker}
                                style={styles.clickAbleWrap}
                            >
                                <Text style={styles.actionText}>추가하기</Text>
                            </TouchableOpacity>                        
                            :
                            <View style={styles.emptyButtonWrap}>
                                <Text style={styles.actionText}>추가하기</Text>
                            </View>
                        }
                    <Modal 
                        isVisible={isModalVisible}
                        backdropOpacity={0.5}
                        deviceHeight={SCREEN_HEIGHT}
                        deviceWidth={SCREEN_WIDTH}
                        onBackdropPress={()=>setModalVisible(false)}
                        useNativeDriver={false}
                        useNativeDriverForBackdrop
                        //swipeDirection={['down']}
                        //onSwipeStart={(e)=> null}                        
                        //onSwipeMove={(e) => fn_hideMode(e)}                        
                        style={styles.modalStyle}
                        propagateSwipe={true}
                    >
                        <Animated.View style={[styles.modalContainer,{ marginTop:SCREEN_HEIGHT*0.3 ,height: animatedHeight }]}>            
                            <TouchableOpacity 
                                onPress={()=>setModalVisible(false)}
                                style={styles.modalTopBottomWrap}
                            >
                                <Icon
                                    name="drag-handle"
                                    style={{paddingRight:5}}
                                    size={CommonUtils.scale(30)}
                                    color="#fff"                        
                                />
                            </TouchableOpacity>
                            <View style={styles.modalDataWrap}>
                                
                                <View style={styles.modalCommonWrap}>
                                    <View style={{height:50,marginHorizontal:10}}>
                                        <Input 
                                            value={keyword}
                                            placeholder={"검색하기"}
                                            placeholderTextColor={"#555"}
                                            onChangeText={text => onSearchKeyword(text)} 
                                            inputContainerStyle={{
                                                width:'100%',borderWidth:0,borderBottomColor:'#f7f7f7',
                                                backgroundColor:'#f7f7f7', borderRadius:10,paddingHorizontal:10
                                            }}
                                            inputStyle={{color:'#555',fontSize:15}}
                                            leftIcon={{ type: 'ant-design', name: 'search1', color:'#555', size:20 }}
                                        />
                                    </View>
                                    <ScrollView                            
                                        showsVerticalScrollIndicator={false}
                                        indicatorStyle={'white'}
                                        scrollEventThrottle={16}
                                        keyboardDismissMode={'on-drag'}                        
                                        style={{width:'100%',height:'100%'}}
                                    >
                                        <View style={styles.coinOuterWrap}>
                                            { 
                                            coinTypeList.map((item, idx) => {
                                                if ( item.isMine ) {
                                                    return (
                                                        <View key={idx} style={styles.coinBoxWrap}>
                                                            <Image source={{uri:item.img_url}} style={styles.iconWrapGray} resizeMode={"contain"} />
                                                            <Text style={styles.coinTextGray}>{item.name}</Text>
                                                            <Text style={styles.coinTextGray}>{item.code}</Text>
                                                        </View>
                                                    )

                                                }else{
                                                    return (
                                                        <TouchableOpacity 
                                                            key={idx} style={styles.coinBoxWrap}
                                                            onPress={()=>selectCoinMaker(item)}
                                                        >
                                                            <Image source={{uri:item.img_url}} style={styles.iconWrap} resizeMode={"contain"} />
                                                            <Text style={styles.coinText}>{item.name}</Text>
                                                            <Text style={styles.coinText}>{item.code}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                }
                                            })}
                                            
                                        </View>
                                        <View style={{height:100}} />
                                    </ScrollView>
                                </View>
                            </View>                
                        </Animated.View>
                    </Modal>
                </View>
            )
        }
        </View>
    );      
  };

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#fff'
    },
    itemText : {
        fontSize:13,
        color:'#555'
    },
    emptyButtonWrap : {
        position:'absolute',
        left:0,
        bottom:0,
        width:SCREEN_WIDTH,        
        ...ifIphoneX({
            height: CommonUtils.scale(60)
        }, {
            height: CommonUtils.scale(50)
        }),
        backgroundColor:'#ccc',
        justifyContent:'center',
        alignItems:'center'
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
        backgroundColor:'#000',
        justifyContent:'center',
        alignItems:'center'
    },
    actionText : {
        color:'#fff',      
        fontWeight:'bold',  
        fontSize: CommonUtils.scale(16)
    },
    coinOuterWrap : {
        marginVertical:10,
        marginHorizontal:20,
        flexDirection:'row',
        flexWrap:'wrap',
        justifyContent:'space-evenly',
        alignItems:'center'
    },
    coinBoxWrap : {
        justifyContent:'center',
        alignItems:'center',
        width:SCREEN_WIDTH/3-20,
        height:SCREEN_WIDTH/3-20,
        backgroundColor:'#f7f7f7',
        borderRadius:10,   
        marginBottom:10     
    },
    isMineWrap : {
        padding:10
    },
    iconWrap : {
        width:25,
        height:25,
        marginBottom:10
    },
    iconWrapGray : {
        width:25,
        height:25,
        marginBottom:10,
        opacity : 0.2
    },
    iconWrap2 : {
        width:16,
        height:16,
        marginRight:5
    },
    coinSelectBoxWrap : {
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        paddingLeft:15,
        minHeight:40
    },
    modalStyle : {
        //position:'absolute',
        left:0,
        bottom:0,
        width:SCREEN_WIDTH,
        height:SCREEN_HEIGHT*0.7,
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
        marginVertical:15,        
    },
    centerStyle : {
        flex:1,
        justifyContent :'center',
        alignItems:'center'
    },
    scrollWrap : {
        flex:1,
        justifyContent :'center',
    },
    imageStyle : {
        width:SCREEN_WIDTH*0.7,
        height:SCREEN_WIDTH*0.3,
        borderRadius:CommonUtils.scale(10)
    },
    slideImageWrap : {
        flex:1,marginHorizontal:20,
        height:SCREEN_WIDTH*0.3,
        overflow:'hidden'
    },
    sliderContainer: {
      width: SCREEN_WIDTH-80,
      height: 40,      
      marginVertical:20,
      marginHorizontal:40,
      borderRadius: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#e0e0e0',
    },
    clickableArea: {
      width: '50%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    sliderText: {
      fontSize: CommonUtils.scale(15),
      fontWeight: '500',
    },
    slider: {
      position: 'absolute',
      width: '48%',
      height: '80%',
      borderRadius: 20,
      backgroundColor: '#f4f4f4',
    },
    linkOuterWrap : {
        flex : 1,
        marginHorizontal : 20
    },
    linkTitlteWrap : {
        flex:1,
        borderRadius:10
    },
    linkDataWrap : {
        flex:1,
        width:'100%',
        marginTop:20,
        borderWidth:1,
        backgroundColor:'#fff',
        borderColor:'#ccc',
        borderRadius:10,
        ...Platform.select({
            ios: {
                shadowColor: "#555",
                shadowOpacity: 0.5,
                shadowRadius: 5,
                shadowOffset: {
                    height: 1.5,
                    width: 0,
                },
            },
            android: {
              elevation: 3,
            },
        })
    },
    MainText : {
        color:'#222',
        fontWeight:'bold',
        fontSize: mConst.mainTitle,
        lineHeight: CommonUtils.scale(20),
    },
    subText : {
        color:'#555',      
        fontWeight:'500',  
        fontSize: CommonUtils.scale(13),
    },
    coinText :{ 
        color:'#555',
        fontWeight:'500',
        fontSize: CommonUtils.scale(13), 
        lineHeight: CommonUtils.scale(16),
    },
    coinTextGray :{ 
        color: '#ccc',
        fontWeight:'500',
        fontSize: CommonUtils.scale(13), 
        lineHeight: CommonUtils.scale(16),
    },
    modalFlexCommonWrap : {        
        flexDirection:'row',
        marginVertical:10,
        marginHorizontal:10,
        maxHeight:40,
    },
    modalCommonFlex1Wrap : {
        flex:1,
        justifyContent:'center',
        paddingLeft:10
    },
    modalCommonFlex4Wrap : {
        flex:4,
        alignContent:'center',
    },
    commonTitleWrap : {
        flex:1,
        padding:20,
        justifyContent:'center'
    },
    commonDataWrap : {
        flex:1,
        paddingVertical:20,
        justifyContent:'center',
        alignItems:'center'
    },
    buttonOuterWrap : {
        flex:1,
        flexDirection:'row',
        paddingVertical:20,
        justifyContent:'space-evenly'
    },
    rewardWrap : {
        flex : 1,
        paddingVertical:10,
        justifyContent:'center',
        
    },
    pointWrap:{
        flex : 1,
        paddingVertical:10,
        justifyContent:'center'
    },
    linkText : {
        color:'#333',
        fontWeight:'500',
        fontSize: CommonUtils.scale(14),        
    },
    linkText2 : {
        color:'#000',
        fontWeight:'bold',
        fontSize: mConst.mainTitle
    },
    orangeText : {
        color:'orange',
        fontWeight:'500',
        fontSize: CommonUtils.scale(14),
    },
    whiteText : {
        color:'#fff',
        fontWeight:'bold',
        fontSize: CommonUtils.scale(14),
    },
    buttonWrap : {
        width:'45%',
        backgroundColor:'#aaa',
        alignItems:'center',
        justifyContent:'center',
        paddingVertical:10,
        borderRadius:10
    },
    buttonWrap2 : {
        marginTop:20,
        width:'80%',
        backgroundColor:'#bbb',
        alignItems:'center',
        justifyContent:'center',
        paddingVertical:10,
        borderRadius:10
    },
    inputContainer : {        
        maxHeight:40,
        borderWidth:0,
        paddingHorizontal:10,        
        borderBottomColor:'#fff',
        backgroundColor:'#fff'
    }
  });

  export default AddCoinScreen;
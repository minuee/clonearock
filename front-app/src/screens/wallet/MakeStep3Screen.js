import React,{useState,useEffect,useRef,useCallback,useContext} from 'react';
import {Alert,TouchableOpacity,Animated,StyleSheet,View,Image,Text,Dimensions,ActivityIndicator,ScrollView} from 'react-native';
import { useFocusEffect,useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ifIphoneX, getBottomSpace } from 'react-native-iphone-x-helper';
import { Header,Button,Overlay } from 'react-native-elements';

import { apiObject } from '../../api';
import UserTokenContext from '../../store/UserTokenContext';
import MoreLoading from '../../utils/MoreLoading';
import CommonUtils from '../../utils/CommonUtils';
import mConst from '../../utils/Constants';
import localStorage from '../../store/LocalStorage';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const STORAGE_KEY = localStorage.MyHDWallet;
const STORAGE_KEY2 = localStorage.MyCertificate;
import * as ethereumUtil  from 'ethereumjs-util';
import * as bitcoinjs from '../../lib/bitcoinjs-3.3.2';
import Mnemonic from '../../lib/jsbip39';

let bip32RootKey = null;
const network = bitcoinjs.bitcoin.networks.bitcoin;

const MakeStep3Screen = (props) => {
    const isFocused = useIsFocused();
    const [isLoading, setLoading] = useState(true);    
    const [isMoreLoading, SetIsMoreLoading] = useState(false);
    const [myCeritificate, setMyCeritificate] = useState({
        ci : null,
        di : null,
    });
    const [isEnterComplete, setIsEnterComplete] = useState(false);
    const [repairKeyWord, setRepairKeyWord] = useState([]);    
    const [inputKeyWord, setInputKeyWord] = useState([]);
    const {walletInfo,setUserInfo} = useContext(UserTokenContext);
    const [mnemonic, setMnemonic] = useState(null);
    /* 지갑생성 데이터 */
    const [langSet, setlangSet] = useState( CommonUtils.isEmpty(props.route.params.langSet) ? 'en' : props.route.params.langSet);
    const [originData, setOriginData] = useState( CommonUtils.isEmpty(props.route.params.originData) ? null : props.route.params.originData);
    const [walletName, setWalletName] = useState('noh wallet');    
    const [walletAddressEther, setWalletAddressEther] = useState(null);
    const [walletKeyStoreEther, setWalletKeyStoreEther] = useState(null);    
    const [isModalVisible, setModalVisible] = useState(false);  
    
    const animatedHeight = useRef(new Animated.Value(SCREEN_HEIGHT*0.5)).current;
    


    useEffect(() => {
        if ( CommonUtils.isEmpty(props.route.params.repairKeyWord)) {
            CommonUtils.fn_call_toast('잘못된 접근입니다.');
            props.navigation.goBack();
            return;
        }else{
            let mnemonics = { "english" : new Mnemonic('english') };        
            setMnemonic(mnemonics["english"])
            const copiedObj = Object.assign([],props.route.params.repairKeyWord);
            //console.log('copiedObj',copiedObj) 
            setRepairKeyWord(copiedObj)
            setInputKeyWord([])
            setTimeout(() => {        
                setLoading(false)
            }, 500); 
        }
    }, []);     

    const clickInputKeyWord = async(item ,index) => {
        const targetIndex = repairKeyWord.findIndex((element) =>  ( element.isCheck && CommonUtils.isEmpty(element.isCheckResult)) )
        setInputKeyWord(inputKeyWord.concat(item.name));        
        repairKeyWord[targetIndex].isCheckResult = item.name;
        setRepairKeyWord(repairKeyWord);
    }

    useEffect(() => {       
        if ( inputKeyWord.length === 3 ) {
            setIsEnterComplete(true)
        }
    }, [inputKeyWord]);  

    useEffect(() => {
        async function fetchData() {
            const MyCertData = await AsyncStorage.getItem(STORAGE_KEY2);                    
            const jsonCertifiData = JSON.parse(MyCertData);
            console.log('jsonCertifiData',jsonCertifiData)
            setMyCeritificate(jsonCertifiData)            
        }
        if ( !isFocused ) { // blur            
            setRepairKeyWord([])
            setInputKeyWord([]);
            setIsEnterComplete(false)
        }else{
            fetchData();        
        }
    }, [isFocused]);

    const setStorageData = async(data) => {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setUserInfo({
            walletInfo: {
                publicAddress : data.publicKey,
                privateAddress : data.privateKey
            },
            walletMnemonic : {
                mnemonicCode : data.mnemonicCode
            }
        });
    }
 
    const checkKeyworld = () => {        
        Alert.alert(
            mConst.appName,
            '지갑생성을 진행하시겠습니까?',
            [
                {text: '네', onPress: () => getWalletAddresseEther()},
                {text: '아니오', onPress: () => console.log('no')},
            ],
            {cancelable: false},
        );        
    }

    const getWalletAddresseEther = async() => {
        
        
        if ( CommonUtils.isEmpty(originData)) {
            CommonUtils.fn_call_toast('니모닉은 먼저 생성하세요');            
            return false;
        }else if ( CommonUtils.isEmpty(walletName)) {
            CommonUtils.fn_call_toast('지갑이름을 입력하세요');            
            return false;        
        }else{
            SetIsMoreLoading(true);            
            try {
                calcBip32RootKeyFromSeed(originData,'')
            } catch (error) {
                console.log('error',error)
            }
            /* try {                
                const wallet = etherUtil.loadWalletFromMnemonics(originData,langSet,"m/44'/60'/0'/0/");
                setWalletAddressEther(wallet.address);
                setWalletKeyStoreEther(wallet.privateKey);
                setStorageData({
                    publicKey : wallet.address,
                    privateKey : wallet.privateKey,
                    mnemonicCode: wallet.mnemonic
                })
                SetIsMoreLoading(false);
                CommonUtils.fn_call_toast('정상적으로 생성되었습니다.');
                setTimeout(() => {
                    props.navigation.popToTop();
                }, 2000);  
            } catch (e) {
                CommonUtils.fn_call_toast('생성중 오류가 발생하였습니다.');
                SetIsMoreLoading(false);
                console.log('eeee',e)
            } */
        }
    }

    const calcBip32RootKeyFromSeed = async(phrase, passphrase) => {      
        
        const seed = await mnemonic.toSeed(phrase, passphrase);
        bip32RootKey = await bitcoinjs.bitcoin.HDNode.fromSeedHex(seed, network);        
        const wprivateKey = bip32RootKey.keyPair.d.toBuffer(32);
        const hdnodes = [{
            path: 'm',
            privateKey: '0x' + wprivateKey.toString('hex'),
            address: '0x' + ethereumUtil.privateToAddress(wprivateKey).toString('hex'),
            parentFingerprint: bip32RootKey.parentFingerprint,
            xpriv: bip32RootKey.toBase58(),
            xpub: bip32RootKey.neutered().toBase58(),
        }];
        
        if ( hdnodes.length > 0 ) {
            SetIsMoreLoading(false);
            const encodeMnemonic = await CommonUtils.cipherMnemonic(myCeritificate, phrase);
            setStorageData({
                publicKey : hdnodes[0].address,
                privateKey : hdnodes[0].privateKey,
                mnemonicCode: { 
                    phrase : encodeMnemonic,
                    path : hdnodes[0].path,
                    locale : langSet
                }
            })
            //CommonUtils.fn_call_toast('정상적으로 생성되었습니다.');
            setModalVisible(true)
            /* setTimeout(() => {
                props.navigation.popToTop();
            }, 2000);   */
        }else{
            CommonUtils.fn_call_toast('생성중 오류가 발생하였습니다.');
            SetIsMoreLoading(false);
        }
    }

    const saveToserver = async(bool) => {        
        if ( bool ) { //저장
            SetIsMoreLoading(true);
            const encodeMnemonic = await CommonUtils.cipherMnemonic(myCeritificate, originData);            
            let returnCode = {code:9998};
            try {            
                const url =  "http://10.10.10.195:12000/v2/member/mnemonic-update/"
                const token = null;
                const sendData = {
                    id : myCeritificate.access_key, //개인식별정보
                    mnemonic : encodeMnemonic//hash
                }
                returnCode = await apiObject.API_registCommon(url,token,sendData);
                console.log('returnCode',returnCode)
                /* {"detail": "자격 인증데이터(authentication credentials)가 제공되지 않았습니다." */
                if ( returnCode.code == "0000") {
                    if ( returnCode.data.detail.indexOf('제공되지') != -1 ) { 
                        SetIsMoreLoading(false);
                        setModalVisible(false);
                        setTimeout(() => {
                            CommonUtils.fn_call_toast("자격 인증데이터(authentication credentials)가 제공되지 않았습니다.");
                        }, 100);
                        
                    }else{
                        SetIsMoreLoading(false);
                        setModalVisible(false);
                        setTimeout(() => {
                            CommonUtils.fn_call_toast("정상적으로 저장되었습니다.");
                        }, 100);
                        setTimeout(() => {
                            props.navigation.popToTop();
                        }, 2000);
                    }
                }
            }catch(e){
                setTimeout(() => {
                    CommonUtils.fn_call_toast('저장중 에러가 발생하였습니다.');
                    console.log('eeeee',e)
                }, 100);                
                setModalVisible(false);
            }
        }else { //홈으로 이동
            props.navigation.popToTop();
        }
    }

    const renderWordForm = (item, index) => {
        if ( item.isCheck ) {
            return (
                <View 
                    key={index} 
                    style={[styles.themeEmptyWrap,{opacity:CommonUtils.isEmpty(item.isCheckResult) ? 0.5 : 1 }]}
                >
                    <Text style={styles.themeEmptyText}>{index+1}. {item.isCheckResult}</Text>
                </View>
            )
        }else{
            return (
                <View key={index} style={styles.themeWrap}>
                    <Text style={styles.themeText}>{index+1}. {item.name}</Text>
                </View>
            )
        }
    }

    return (
        isLoading 
        ? 
        <View style={styles.centerStyle}>
            <ActivityIndicator/> 
        </View>
        : 
        (
            <View style={styles.container}>  
                <Header
                    backgroundColor="#fff"
                    leftComponent={(
                        <TouchableOpacity 
                            onPress= {()=> props.navigation.goBack()} 
                            style={{flex:2,flexGrow:1,paddingLeft:20,flexDirection:'row',alignItems:'center',zIndex:11}}
                        >
                            <Icon
                                name="arrow-back-ios"
                                size={CommonUtils.scale(20)}
                                color={'#000'}
                            />                        
                        </TouchableOpacity>
                    )}
                    centerComponent={{ text: '새 지갑 만들기', style: { fontSize: mConst.navTitle,color: '#000' } }}
                    rightComponent={(
                        <TouchableOpacity 
                            onPress= {()=> props.navigation.goBack()} 
                            style={{ flex:1,flexGrow:1,justifyContent:'center',paddingRight:15}}
                        >
                            <Icon
                                name="close"
                                size={CommonUtils.scale(20)}
                                color={'#000'}
                            />   
                        </TouchableOpacity>
                    )}
                    containerStyle={{borderBottomWidth: 0}}
                />             
                <ScrollView>       
                    <View style={{flexDirection:'row',paddingTop:15}}>
                        <View style={{flex:5,justifyContent:'center',alignItems:'center',paddingLeft:20}}>
                            <View style={{height:5,width:'100%',backgroundColor:'#ebebeb'}}>
                                <View style={{height:5,width:'100%',backgroundColor:mConst.baseColor}}/>
                            </View>
                        </View>
                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Text style={styles.subText}><Text style={[styles.subText,{color:mConst.baseColor}]}>3</Text>/3</Text>
                        </View>
                    </View>
                    <View style={styles.titleBox}>
                        <View style={[styles.titleLeftBox,{marginTop:15}]}>
                            <Text style={styles.mainText}>복구단어 확인</Text>
                        </View>
                        <View style={[styles.titleLeftBox,{marginTop:15}]}>
                            <Text style={styles.subText}>아래 단어 목록의 빈 칸에 해당하는</Text>
                            <Text style={styles.subText}>단어를 순서대로 선택해주세요.</Text>
                        </View>
                        <View style={[styles.keywordWrap,{marginTop:25}]}>
                        {
                            repairKeyWord.map((item,index) => {
                                return (
                                    renderWordForm(item,index)
                                )
                            })
                        }                            
                        </View>
                    </View>
                    { 
                        ( !CommonUtils.isEmpty(walletAddressEther) && !CommonUtils.isEmpty(walletAddressEther) ) && (
                        <View style={{marginHorizontal:20}}>
                            <View style={styles.titleBox}>
                                <View style={[styles.titleLeftBox,{marginTop:5}]}>
                                    <Text style={styles.mainText}>PublicKey : <Text style={styles.subText}>{walletAddressEther}</Text></Text>
                                </View>
                                <View style={[styles.titleLeftBox,{marginTop:5}]}>
                                    <Text style={styles.mainText}>PrivateKey : <Text style={styles.subText}>{walletKeyStoreEther}</Text></Text>
                                </View>
                            </View>
                        </View>
                        )
                    }      
                    <View style={{height:100}} />
                </ScrollView>              
                {
                    isEnterComplete ?
                    <TouchableOpacity
                        onPress={() => checkKeyworld()}
                        style={styles.clickAbleWrap2}
                    >
                        <Text style={styles.actionText2}>확인</Text>
                    </TouchableOpacity>
                    :
                    <View style={styles.clickAbleWrap}>
                        <View style={{height:30}}>
                            <Text style={styles.actionText}>순서대로 선택하세요!</Text>
                        </View>                    
                        <View style={styles.inputKeywordWrap}>
                            {                                
                                repairKeyWord.map((item,index) => {
                                    if ( item.isCheck && !inputKeyWord.includes(item.name) ) {
                                        return (
                                            <TouchableOpacity 
                                                key={index  }                                        
                                                style={styles.inputDataWrap}
                                                onPress={()=>clickInputKeyWord(item,index)}
                                            >
                                                <Text style={styles.whiteText}>{item.name}</Text>
                                            </TouchableOpacity>
                                        )
                                    }
                                })
                            }                            
                        </View>
                    </View>
                }
                {
                    isMoreLoading &&
                    <MoreLoading isLoading={isMoreLoading} />
                }
                {
                isModalVisible && (
                    <View style={styles.fixedFullWidth}>
                        <Overlay
                            isVisible={isModalVisible}                        
                            windowBackgroundColor="rgba(0, 0, 0, 0.8)"
                            overlayBackgroundColor="tranparent"
                            overlayStyle={styles.overStyle}
                        >
                            <View style={styles.overlayDataWrap}>
                                <View style={styles.modalCommonWrap}>
                                    <View style={styles.modalCommonFlex5Wrap}>
                                        <Text style={styles.mainText}>전자지갑이 생성완료되었습니다.</Text>
                                        <Text style={styles.subText}>안심서버에 복구키워드를 저장하실 수 있습니다.</Text>
                                    </View>                               
                                </View>
                                <View style={{padding:20}}>
                                    <Button 
                                        onPress={()=>saveToserver(true)}
                                        size="lg" title="안심서버에 저장하기" 
                                    />
                                </View>
                                <View style={{padding:20,justifyContent:'center',alignItems:'center'}}>
                                    <Button 
                                        onPress={()=>saveToserver(false)}
                                        size="md" 
                                        title="홈으로 이동" 
                                        containerStyle={{width: 200}}
                                        buttonStyle={{backgroundColor: '#ccc',borderRadius: 3}}
                                    />
                                </View>
                            </View>  
                        </Overlay>
                    </View>
                )
                }
                {/* <Modal 
                    isVisible={isModalVisible}
                    backdropOpacity={0.5}
                    deviceHeight={SCREEN_HEIGHT}
                    deviceWidth={SCREEN_WIDTH}                    
                    useNativeDriver={false}                    
                    useNativeDriverForBackdrop={false}                    
                    style={styles.modalStyle}            
                >
                    <Animated.View 
                        style={[styles.modalContainer,{ marginTop:SCREEN_HEIGHT*0.5 ,height: animatedHeight }]}
                    >   
                        <View style={styles.modalDataWrap}>
                            <View style={styles.modalCommonWrap}>                               
                                <View style={styles.modalCommonFlex5Wrap}>
                                    <Text style={styles.mainText}>전자지갑이 생성완료되었습니다.</Text>
                                    <Text style={styles.subText}>안심서버에 복구키워드를 저장하실 수 있습니다.</Text>
                                </View>                               
                            </View>
                            <View style={{padding:20}}>
                                <Button 
                                    onPress={()=>saveToserver(true)}
                                    size="lg" title="안심서버에 저장하기" 
                                />
                            </View>
                            <View style={{padding:20,justifyContent:'center',alignItems:'center'}}>
                                <Button 
                                    onPress={()=>saveToserver(false)}
                                    size="md" 
                                    title="홈으로 이동" 
                                    containerStyle={{width: 200}}
                                    buttonStyle={{backgroundColor: '#ccc',borderRadius: 3}}
                                />
                            </View>
                        </View>                
                    </Animated.View>
                </Modal> */}
            </View>
        )
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'#ebebeb'
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
    fixedFullWidth : {
        position: 'absolute',
        top:0,
        left:0,        
        width:SCREEN_WIDTH,
        height:SCREEN_HEIGHT,
        margin:0,
        justifyContent:'center',
        alignItems:'center',
        zIndex:10
    },
    overStyle : {
        borderRadius:CommonUtils.scale(20),
        margin:0,
        padding:0,
    },
    overlayDataWrap : {
        width:SCREEN_WIDTH*0.9,
        height:CommonUtils.scale(300),
        padding:15,
        backgroundColor:'#fff'
    },
    titleBox : {
        flex:1,        
        marginTop:30,
        alignItems:'center',
        justifyContent:'center'
    },
    titleLeftBox : {
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },    
    keywordWrap : {
        flex:1,
        width:SCREEN_WIDTH*0.8,
        flexDirection:'row',
        flexWrap:'wrap'
    },
    themeWrap : {        
        width:'30%',
        marginRight:'3%',
        marginBottom:10,
        paddingVertical:10,
        paddingHorizontal:5,
        borderRadius:10,
        backgroundColor:'#fff',
        justifyContent:'center',
        alignItems:'center'
    },
    themeEmptyWrap : {
        width:'30%',
        marginRight:'3%',
        marginBottom:10,
        paddingVertical:10,
        paddingHorizontal:5,
        borderRadius:10,
        borderColor:mConst.baseColor,
        borderWidth:0.5,
        backgroundColor:'#fff',
        justifyContent:'center',
        alignItems:'flex-start'
    },
    themeText : {
        color:'#555',
        fontSize: mConst.subTitle,
        letterSpacing:-1
    },
    themeEmptyText : {
        color:mConst.baseColor,
        fontSize: mConst.subTitle,        
    },
    inputKeywordWrap : {
        width:SCREEN_WIDTH*0.7,
        flexDirection:'row',
        flexWrap:'wrap'
    },
    inputDataWrap : {        
        width:'30%',
        marginRight:'3%',        
        padding:10,
        borderRadius:10,
        backgroundColor:mConst.baseColor,
        justifyContent:'center',
        alignItems:'center'
    },
    mainText : {
        color:'#000',
        fontWeight:'bold',
        fontSize: mConst.mainTitle,
        lineHeight: CommonUtils.scale(22),
    },
    subText : {
        color:'#555',        
        fontSize: mConst.subTitle,
        lineHeight: CommonUtils.scale(18),
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
    clickableArea: {
      width: '50%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },    
    linkOuterWrap : {
        flex : 1,
        marginHorizontal : 20
    },    
    orangeText : {
        color:'orange',
        fontWeight:'500',
        fontSize: mConst.subTitle
    },
    whiteText : {
        color:'#fff',
        fontWeight:'bold',
        fontSize: mConst.subTitle
    },
    clickAbleWrap  : {
        position:'absolute',
        left:0,
        bottom:0,
        paddingVertical:10,
        width:SCREEN_WIDTH,
        height: CommonUtils.isIphoneX() ? CommonUtils.scale(120) : CommonUtils.scale(100),
        backgroundColor: '#fff',
        alignItems:'center'
    },
    actionText : {
        color:'#555',      
        fontWeight:'bold',  
        fontSize: mConst.subTitle
    },
    clickAbleWrap2  : {
        position:'absolute',
        left:0,
        bottom:0,
        width:SCREEN_WIDTH,
        ...ifIphoneX({
            height: CommonUtils.scale(60)
        }, {
            height: CommonUtils.scale(50)
        }),
        backgroundColor: mConst.baseColor,
        justifyContent:'center',
        alignItems:'center'
    },
    actionText2 : {
        color:'#fff',      
        fontWeight:'bold',  
        fontSize: mConst.mainTitle
    }
  });

  export default MakeStep3Screen;
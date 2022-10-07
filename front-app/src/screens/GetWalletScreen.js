import React,{useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View ,ScrollView ,TextInput,FlatList,Alert,TouchableOpacity, Dimensions} from 'react-native';
import { Header  } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();
import { useFocusEffect,useIsFocused } from '@react-navigation/native';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MoreLoading from "../utils/MoreLoading";
import CommonUtils from '../utils/CommonUtils';
import mConst from '../utils/Constants';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import * as ethereumUtil  from 'ethereumjs-util';
import UserTokenContext from '../store/UserTokenContext';
import localStorage from '../store/LocalStorage';
const STORAGE_KEY = localStorage.MyHDWallet;
const STORAGE_KEY2 = localStorage.MyCertificate;
const phrase = "voice frame fatal october pattern sunny skirt leg skate trigger orchard test";
import * as bitcoinjs from '../lib/bitcoinjs-3.3.2';
import Mnemonic from '../lib/jsbip39';

let bip32RootKey = null;
const langList = [
    { id : 1, code : 'english', code2  : 'en', name : '영어',mnemonic:'unhappy inmate narrow supply trim shield below express often holiday creek duck'},
    { id : 21, code : 'english', code2  : 'en', name : '영어2',mnemonic:'voice frame fatal october pattern sunny skirt leg skate trigger orchard test' },
    { id : 2, code : 'korean', code2  : 'ko', name : '한국어', mnemonic : '연습 현금 이야기 남편 저곳 하품 차라리 최종 선원 접촉 고집 비판' },
    { id : 23, code : 'korean', code2  : 'ko', name : '한국어', mnemonic : '환영 시아버지 정오 계획 일기 낱말 수컷 최상 축하 호흡 감소 국제'},
    { id : 3, code : 'japaness', code2  : 'ja', name : '일본어' ,mnemonic : 'らくさつ　しかく　えんちょう　ふうふ　さとう　はむかう　たよる　しゃりん　たとえる　たんか　してい　ないそう'},
    { id : 4, code : 'chinese', code2  : 'zh_cn', name : '중국어', mnemonic : '岁 屈 慌 雾 沫 验 迷 括 浮 挂 扣 泡' },
    { id : 5, code : 'french', code2  : 'fr', name : '프랑스어', mnemonic : 'timide ligoter auberge jeton garnir galaxie éruption caméra parure syntaxe sculpter laisser'  },
    { id : 6, code : 'italian', code2  : 'it', name : '이탈리아어', mnemonic : 'ritardo sosta bagnato messere virologo entrare serata sfaticato vento cervello foresta economia'  },
    { id : 7, code : 'spanish', code2  : 'es', name : '스페인어', mnemonic : 'mnemonicData amistad autor horno aguja pleno carta aceite idioma tenaz dosis tejer retrato'  }
]


const GetWalletScreen = (props) => {
    const [isMoreLoading, SetIsMoreLoading] = useState(false);
    const [requestData, setRequestData] = useState(phrase.toString());
    const isFocused = useIsFocused();
    const [mnemonic, setMnemonic] = useState(null);
    const [selectLanaguage, setLanguage] = useState("english");
    const [selectLanaguage2, setLanguage2] = useState("en");
    const {setUserInfo} = useContext(UserTokenContext);
    const [walletInfo, setWalletInfo] = useState({})
    const network = bitcoinjs.bitcoin.networks.bitcoin;
    const [myCeritificate, setMyCeritificate] = useState({
        ci : null,
        di : null,
    });


    useEffect(() => {
        async function fetchData() {
            const MyCertData = await AsyncStorage.getItem(STORAGE_KEY2);                    
            const jsonCertifiData = JSON.parse(MyCertData);
            console.log('jsonCertifiData',jsonCertifiData)
            setMyCeritificate(jsonCertifiData)            
        }
        if ( isFocused ) {
            fetchData();        
        }
    }, [isFocused]);
   
    useEffect(() => {
        let mnemonics = { "english" : new Mnemonic('english') };        
        setMnemonic(mnemonics["english"])        
    }, []);

    
    const getWallet = () => {        
        if ( !CommonUtils.isEmpty(requestData)) {            
            Alert.alert(
                mConst.appName,
                '지갑을 가져오시겠습니까?',
                [
                  {text: '네', onPress: () => actiongetWallet()},
                  {text: '아니오', onPress: () => console.log('no')},
                ],
                {cancelable: false},
              );
        }
    }

    const actiongetWallet = () => {
        SetIsMoreLoading(true)        
        calcBip32RootKeyFromSeed(requestData, '');
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
        setWalletInfo({
            walletPublicKey : hdnodes[0].address,
            walletPrivateKey :  hdnodes[0].privateKey
        })
        console.log('phrase', phrase)
        const encodeMnemonic = await CommonUtils.cipherMnemonic(myCeritificate, phrase);
        console.log('encodeMnemonicencodeMnemonic', encodeMnemonic)
        setUserInfo({
            walletInfo: {
                publicAddress : hdnodes[0].address,
                privateAddress :  hdnodes[0].privateKey
            },
            walletMnemonic : {
                mnemonicCode: { 
                    phrase : encodeMnemonic,
                    path : hdnodes[0].path,
                    locale : selectLanaguage2
                }
            }
        });

       
        
        setStorageData({
            publicKey : hdnodes[0].address,
            privateKey : hdnodes[0].privateKey,
            mnemonicCode: { 
                phrase : encodeMnemonic,
                path : hdnodes[0].path,
                locale : selectLanaguage2
            }
        })

        SetIsMoreLoading(false)
        CommonUtils.fn_call_toast('정상적으로 생성되었습니다.');
        setTimeout(() => {
            props.navigation.goBack();
        }, 2000);
    }

    const setStorageData = async(data) => {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));        
    }
   
    return (
        <View style={styles.container}>
            <Header
                backgroundColor="#fff"
                statusBarProps={{translucent: true, backgroundColor: 'transparent', barStyle: 'light-content', animated: true}}
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
                centerComponent={{ text: '지갑 가져오기', style: { fontSize: mConst.navTitle,color: '#000' } }}
                rightComponent={null}
                containerStyle={{borderBottomWidth: 0}}
            />
            <ScrollView
                style={{width:'100%',height:'100%'}}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.mainbox}>
                    <View style={styles.titleBox}>
                        <View style={styles.titleLeftBox}>
                            <Icon
                                name="lock-clock"
                                size={CommonUtils.scale(40)}
                                color="orange"                                
                            />
                        </View>
                        <View style={styles.titleRightBox}>
                            <Text style={styles.mainText}>가져오려는 지갑의</Text>
                            <Text style={[styles.mainText,{fontWeight:'500'}]}>복구단어<Text style={styles.mainText}>를 입력해주세요.</Text></Text>
                        </View>
                    </View>
                    <View style={styles.dataBox}>
                        <Text style={styles.mainText}>복구단어 입력</Text>
                    </View>
                    <View style={{height:40,paddingLeft:20,marginBottom:10}}>
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
                                            onPress={()=>{ 
                                                setRequestData(item.mnemonic);
                                                setLanguage(item.code);
                                                setLanguage2(item.code2);
                                            }}
                                        >
                                            <Text style={styles.itemText}>{item.name}</Text>
                                        </TouchableOpacity>
                                    )
                                })                                    
                            }
                        </ScrollView>
                    </View>
                    <View style={styles.inputBox}>
                        <TextInput
                            multiline={true}
                            placeholder="12개의 니모닉을 단어 간 띄어쓰기로 구분하여 입력해주세요."
                            placeholderTextColor={'#777'}
                            style={{fontSize: mConst.subTitle, flex: 1, color:'#000'}}
                            textAlignVertical="top"
                            padding={10}
                            value={requestData}
                            onChangeText={text => setRequestData(text)}
                        />
                    </View>
                    <View style={styles.dataBox}>
                        <Text style={styles.mainText}>복구지갑주소</Text>
                    </View>
                    
                    <View style={[styles.resultBox,{marginTop:20}]}>
                        <Text style={styles.subText}>
                            HD Wallet PublicKey : {walletInfo?.walletPublicKey}
                        </Text>
                        <Text style={styles.subText}>
                            HD Wallet PrivateKey : {walletInfo?.walletPrivateKey}
                        </Text>
                    </View>                    
                            
                    <View style={{flex:1,width:'100%',height:100}} />
                </View>
            </ScrollView>
            <TouchableOpacity
                onPress={getWallet}
                style={CommonUtils.isEmpty(requestData) ? styles.emptyButtonWrap :  styles.clickAbleWrap}
            >
                <Text style={styles.actionText}>복구하기</Text>
            </TouchableOpacity>
            {
                isMoreLoading &&
                <MoreLoading isLoading={isMoreLoading} />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    textinfo:{
        margin:10, 
        textAlign: 'center',
        fontSize: 17,    
    },
    mainbox : {
        flex:1,
    },
    titleBox : {
        flex:1,
        backgroundColor:'#ebebeb',
        paddingVertical:30,
        flexDirection:'row'
    },
    dataBox : {
        flex:1,
        marginHorizontal:20,
        marginTop:30,
        marginBottom:10
    },
    inputBox : {
        flex:1,
        marginHorizontal:20,
        height:CommonUtils.scale(100),
        backgroundColor:'#ebebeb'
    },
    resultBox : {
        flex:1,
        marginHorizontal:20,      
    },
    titleLeftBox : {
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    titleRightBox : {
        flex:4,
        justifyContent:'center'
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
        fontSize: mConst.subTitle,
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
        height: CommonUtils.isIphoneX() ? CommonUtils.scale(70) : CommonUtils.scale(50),
        backgroundColor:'#000',
        justifyContent:'center',
        alignItems:'center'
    },
    actionText : {
        color:'#fff',      
        fontWeight:'bold',  
        fontSize: CommonUtils.scale(16)
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
    }
});

export default GetWalletScreen;


function buildData({ balance, price, wallet }) {
    const struct = {
      walletName: { title: 'Name', content: wallet.walletName },
      walletId: { title: 'ID', content: wallet.walletId },
      coin: { title: 'Coin', content: wallet.coin },
      network: { title: 'Network', content: wallet.network },
      addressType: { title: 'Address Type', content: wallet.addressType },
      derivationStrategy: { title: 'Derivation Strategy', content: wallet.derivationStrategy },
      xPubKey: { title: 'Extended Public Key', content: wallet.xPubKey },
      xPrivKey: { title: 'Extended Private Key', content: wallet.xPrivKey },
    };
  
    if (balance) {
      const { total, available, confirming, locked } = balance;
  
      struct.total = {
        title: 'Total',
        content: (
          <Text>
            <Btc satoshi={total} /> <Usd price={price} satoshi={total} />
          </Text>
        ),
      };
      struct.available = {
        title: 'Available (immediately spendable)',
        content: (
          <Text>
            <Btc satoshi={available} /> <Usd price={price} satoshi={available} />
          </Text>
        ),
      };
      struct.confirming = {
        title: 'Confirming (with no confirmation)',
        content: (
          <Text>
            <Btc satoshi={confirming} /> <Usd price={price} satoshi={confirming} />
          </Text>
        ),
      };
      struct.locked = {
        title: 'Locked (inputs in pending transactions)',
        content: (
          <Text>
            <Btc satoshi={locked} /> <Usd price={price} satoshi={locked} />
          </Text>
        ),
      };
    }
  
    return Object.entries(struct).map(([key, { title, content }]) => ({ key, title, content }));
  }
  
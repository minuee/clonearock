import React,{useState,useEffect,useRef,useCallback,useContext} from 'react';
import {Animated,Easing,TouchableOpacity,Platform,StyleSheet,Pressable,View,Image,Text,Dimensions,ActivityIndicator,ScrollView} from 'react-native';
import { useFocusEffect,useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();
import AsyncStorage from '@react-native-async-storage/async-storage';
import Web3 from 'web3';
const  web3Http = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/4d3cc561e76c4fd0b1c6a200c1a72bca'));

import { Header,Button } from 'react-native-elements';
import CommonUtils from '../utils/CommonUtils';
import mConst from '../utils/Constants';
import localStorage from '../store/LocalStorage';
import TransDescription from './TransDescription';
import Curreny from '../ether/Curreny';
import UserTokenContext from '../store/UserTokenContext';

const STORAGE_KEY = localStorage.MyHDWallet;
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const AssetsScreen = (props) => {    
    const isFocused = useIsFocused();
    const animatedValue = useRef(new Animated.Value(0)).current;
    const {walletCoins,currencyData} = useContext(UserTokenContext);
    const [isLoading, setLoading] = useState(true);
    const [isTabMenu, setTabMenu] = useState(1);    
    const [nowCoin, setNowCoin] = useState(null);
    
    const [wallletBalance, setWallletBalance] = useState(0);
    const [walletAddresss, setWalletAddress] = useState(null);

    
    useEffect(() => {
        setLoading(false)
    }, []);

    const getBalance = async(address) => {
        if (!address) {
            return
        }else{
            const ethAddress = '0xd8b2e5798f322c8631e4ff2f784ca3907e7fb236';
            
            setWalletAddress(ethAddress)
            try {
                let eoa1_nonce = await web3Http.eth.getTransactionCount(ethAddress, "pending")                
                let get_code = await web3Http.eth.getCode(ethAddress);                
                let gas_price = await web3Http.eth.getGasPrice();                
                let balance = await web3Http.eth.getBalance(ethAddress)
                setWallletBalance(balance != null ? web3Http.utils.fromWei(balance, "ether") : 0 )
            }catch(err){
                console.log('eee',err)
            }
        }
    }

    useFocusEffect(
        useCallback(() => {
            async function fetchData () {                
                const isCheck = await AsyncStorage.getItem(STORAGE_KEY);                
                if ( !CommonUtils.isEmpty(isCheck)) {
                    const isCheckJson = JSON.parse(isCheck);                    
                    if ( !CommonUtils.isEmpty(isCheckJson.publicKey)) {
                        getBalance(isCheckJson.publicKey);
                    }
                }
            }            
            fetchData();
        }, [isFocused])
    );

    const startAnimation = (toValue) => {        
        Animated.timing(animatedValue, {
            toValue,
            duration: 400,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start(()=>{
            if ( toValue === 0 ) {
                setTabMenu(1);
            }else{
                setTabMenu(2);
                
            }
        });
    };

    const left = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['2%', '50%'],
      extrapolate: 'clamp',
    });

    const scale = animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.9, 1],
      extrapolate: 'clamp',
    });
    const togglecolor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#000', '#888'],
        extrapolate: 'clamp',
    });
    const togglecolor2 = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#888', '#000'],
        extrapolate: 'clamp',
    });


    const goNavigaion = (tabIdx, coinBrand) => {
        setNowCoin(coinBrand);
        if ( tabIdx === 2 && tabIdx !=  isTabMenu ) {
            setTabMenu(2);
            startAnimation(1);
        }else if ( tabIdx === 1 && tabIdx !=  isTabMenu ) {
            setTabMenu(1);
            startAnimation(0);
            
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
                <View>
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
                        centerComponent={{ text: '나의 자산', style: { fontSize: mConst.navTitle,color: '#000' } }}
                        rightComponent={null}
                        containerStyle={{borderBottomWidth: 0}}
                    /> 
                    
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{width:'100%',height:'100%'}}
                    >
                        <View style={styles.sliderContainer}>
                            <Animated.View style={[styles.slider, { left }]} />
                            <Pressable
                                style={styles.clickableArea}
                                onPress={startAnimation.bind(null, 0)}
                            >
                                <Animated.Text style={[styles.sliderText, {color:togglecolor, transform: [{ scale }] }]}>
                                    입출금
                                </Animated.Text>
                            </Pressable>
                            <Pressable
                                style={styles.clickableArea}
                                //onPress={startAnimation.bind(null, 1)}
                            >
                                <Animated.Text style={[styles.sliderText, { color:togglecolor2, transform: [{ scale }] }]}>
                                    내역
                                </Animated.Text>
                            </Pressable>
                        </View>
                        { isTabMenu === 1 ?
                        <>
                        <View style={styles.linkOuterWrap}>
                            <Text style={{fontSize:11,}}>총 보유자산</Text>
                            <View style={{flex:1,marginVertical:10,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                { ( !CommonUtils.isEmpty(currencyData.eth) && wallletBalance > 0 ) ?
                                    <Text style={{fontSize:15,}}>
                                    {CommonUtils.currencyFormat((currencyData.eth*parseFloat(wallletBalance)))}원
                                    </Text>
                                    :
                                    <Text style={{fontSize:15,}}>0원</Text>
                                }
                                <Button
                                    title="원화 입금"                                    
                                    containerStyle={{margin:0,padding:0,height:30}}
                                    titleStyle={{fontSize:12,lineHeight:14,padding:0,margin:0}}
                                />
                            </View>
                        </View>
                        <View style={styles.assetWrap}>
                            <View style={styles.assetCoinLogoWrap}>
                                <Image source={{uri:'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/32/ethereum.png'}} style={styles.iconWrap} resizeMode={"contain"} />
                            </View>
                            <View style={styles.assetCoinMakerWrap}>
                                <Text style={styles.assetCoinMakerName}>이더리움</Text>
                                <Text style={styles.assetCoinMakerCode}>ETH</Text>
                            </View>
                            <View style={styles.assetCoinBalanceWrap}>
                                <Text style={styles.assetCoinBalaceText}>
                                    {`${parseFloat(wallletBalance).toFixed(4)}`}
                                </Text>
                                <Curreny />
                            </View>
                            <TouchableOpacity
                                style={styles.assetArrowWrap}
                                onPress={()=>goNavigaion(2,'eth') }
                            >
                                <Icon
                                    name="arrow-forward-ios"
                                    style={{paddingRight:5}}
                                    size={CommonUtils.scale(16)}
                                    color="#cccccc"
                                />
                            </TouchableOpacity>
                        </View>
                        </>
                        :
                            <TransDescription 
                                coinMaker={nowCoin}
                            />
                        }
                    </ScrollView>
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
    centerStyle : {
        flex:1,
        justifyContent :'center',
        alignItems:'center'
    },
    sliderContainer: {
      width: SCREEN_WIDTH-60,
      height: 40,      
      marginVertical:10,
      marginHorizontal:30,
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
      fontSize: mConst.subTitle,
      fontWeight: '500',
      color:'#555'
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
        marginVertical:10,
        marginHorizontal:20
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
                shadowRadius: 10,
                shadowOffset: {
                    height: 2,
                    width: 0,
                },
            },
            android: {
              elevation: 3,
            },
        })
    },
    assetWrap : {
        flex:1,marginVertical:5,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomColor:'#ccc',borderBottomWidth:1,
        paddingVertical:10,paddingHorizontal:20
    },
    assetCoinLogoWrap : {
        flex:0.5,justifyContent:'center',alignItems:'flex-start'
    },
    assetCoinMakerWrap : {
        flex:2,justifyContent:'center',alignItems:'flex-start'
    },
    assetCoinBalanceWrap : {
        flex:3,justifyContent:'center',alignItems:'flex-end'
    },
    assetArrowWrap : {
        flex:0.5,justifyContent:'center',alignItems:'flex-end'
    },
    assetCoinMakerName : {
        fontSize:13,lineHeight:20
    },
    assetCoinMakerCode : {
        fontSize:11,lineHeight:20,color:'#ccc'
    },
    assetCoinBalaceText : {
        fontSize:13,lineHeight:15,color:'#555'
    },
    iconWrap : {
        width:25,
        height:25,
    },
  });

  export default AssetsScreen;
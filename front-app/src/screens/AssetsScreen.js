import React,{useState,useEffect,useRef,useCallback,useContext} from 'react';
import {TouchableOpacity,Platform,StyleSheet,View,Image,Text,Dimensions,ActivityIndicator,ScrollView} from 'react-native';
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
import UserTokenContext from '../store/UserTokenContext';

const STORAGE_KEY = localStorage.MyHDWallet;
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const AssetsScreen = (props) => {    
    const isFocused = useIsFocused();    
    const {walletCoins,currencyData} = useContext(UserTokenContext);
    const [isLoading, setLoading] = useState(true);
    
    useEffect(() => {
        setLoading(false)
    }, []);

    const goNavigaion = (item) => {
        props.navigation.navigate('CoinSendScreen',{
            screenState : item
        })
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
                        centerComponent={{ text: '나의 코인', style: { fontSize: mConst.navTitle,color: '#000' } }}
                        rightComponent={null}
                        containerStyle={{borderBottomWidth: 0}}
                    /> 
                    
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{width:'100%',height:'100%'}}
                    >
                        {
                            walletCoins.length === 0 ?
                            (
                                <View style={styles.assetWrap}>
                                     <Text style={styles.assetCoinMakerName}>등록된 코인이 없습니다.</Text>
                                </View> 
                            )
                            :
                            (
                            walletCoins.map((item,index) => {
                                return (     
                                <View style={styles.assetWrap} key={index}>
                                    <View style={styles.assetCoinLogoWrap}>
                                        <Image source={{uri: item.coinMaker.img_url || 'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/32/ethereum.png'}} style={styles.iconWrap} resizeMode={"contain"} />
                                    </View>
                                    <View style={styles.assetCoinMakerWrap}>
                                        <Text style={styles.assetCoinMakerName}> {item.coinMaker.name}</Text>
                                        <Text style={styles.assetCoinMakerCode}> {item.coinMaker.code}</Text>
                                    </View>                                    
                                    <TouchableOpacity
                                        style={styles.assetArrowWrap}
                                        onPress={()=>goNavigaion(item) }
                                    >
                                        <Icon
                                            name="arrow-forward-ios"
                                            style={{paddingRight:5}}
                                            size={CommonUtils.scale(16)}
                                            color="#cccccc"
                                        />
                                    </TouchableOpacity>
                                </View>
                                )
                            })
                            )
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
        flex:4,justifyContent:'center',alignItems:'flex-start'
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
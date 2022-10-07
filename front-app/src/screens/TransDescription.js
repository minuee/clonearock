import React,{useState,useEffect,useRef,useCallback} from 'react';
import {TouchableOpacity,Platform,StyleSheet,View,Image,Text,Dimensions,ActivityIndicator,ScrollView} from 'react-native';
import { useFocusEffect,useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();
import { Overlay } from 'react-native-elements';
import CommonUtils from '../utils/CommonUtils';
import mConst from '../utils/Constants';
import Web3 from 'web3';

import callAPI from 'minueefetch'

import CryptoJS from "react-native-crypto-js";
let strPhoneNo = "01062880183";
let strSecretKey ="dreamsecurity";
let strEncrypt = CryptoJS.AES.encrypt(strPhoneNo , strSecretKey).toString();

const  web3Http = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/4d3cc561e76c4fd0b1c6a200c1a72bca'));
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const AssetsScreen = (props) => {    
    const isFocused = useIsFocused();
    const [isLoading, setLoading] = useState(true);
    const [popLayerView, setPopLayerView] = useState(false);
    const [data, setData] = useState([]);
    const [viewItem, setViewItem] = useState(null);
    
    const convertMessages = async(data) => {        
        let convertArray = [];        
        await data.forEach(function(element,index,array){         
            const reElement = JSON.parse(element);
            convertArray.push(reElement)
        });        
        //console.log('convertArray',convertArray)
        const convertArray2 = convertArray.sort((a, b) => ( parseInt(a.date) > parseInt(b.date)) ? -1 : 1);
        setData(convertArray2)
    }

    useFocusEffect(
        useCallback(() => {
            async function fetchData () {
                //console.log('useFocusEffect')
                setLoading(false);
                try{
                    /* 
                    methode 1 : 기본코어함수인 fetch를 그대로 활용
                    fetch(Platform.OS === 'ios' ? 'http://127.0.0.1:3001/trans/list?code=' + props.coinMaker + '&boan=' + strEncrypt : 'http://10.0.2.2:3001/trans/list?code=' + props.coinMaker + '&boan=' + strEncrypt, {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        method: 'GET',
                        body: null,
                    })
                    .then(res => res.json())
                    .then(result => {
                        if ( !CommonUtils.isEmpty(result.data)) {
                            //console.log('result',JSON.parse(result.data))
                            convertMessages(result.data)
                        }else{
                            //console.log('result22',result.data)
                        }                        
                    }); */

                    /* methode 2 : timeout적용된 라이브러리 사용 이는 CommonUtils.callAPI와 같음 */
                    const options = {
                        headers: {
                            'Content-type': 'application/json'
                        },
                        method: 'GET',
                        body: null,
                    }
                    const apiUrl = Platform.OS === 'ios' ? 'http://127.0.0.1:3001/trans/list?code=' + props.coinMaker + '&boan=' + strEncrypt : 'http://10.0.2.2:3001/trans/list?code=' + props.coinMaker + '&boan=' + strEncrypt
                    const responseJson = await callAPI(apiUrl,options,3000);
                    //console.log('responseJson',responseJson)
                    if ( !CommonUtils.isEmpty(responseJson.data)) {
                        convertMessages(responseJson.data)
                    }
                    /* 
                        methode 3 : api.js파일을 활용 
                        이건 룰을 정한후 수립이 필요
                    */
                    
                }catch(e){
                    console.log('eeeeee',e)
                    CommonUtils.fn_call_toast('네트워크 오류입니다.');          
                }
            }            
            fetchData();            
        }, [props.coinMaker])
    );

    const getTransactionHashInfo = async(item) => {        
        if ( props.coinMaker == 'eth') {
            if ( !CommonUtils.isEmpty(item.transactionHash)) {
                try {
                    let resultData = await web3Http.eth.getTransaction(item.transactionHash)
                    if ( !CommonUtils.isEmpty(resultData) ) {
                        setViewItem({
                            ...item,
                            gas : resultData.gas,
                            gasPrice : resultData.gasPrice,
                            hash : resultData.hash,
                            nonce : resultData.nonce,
                            transactionIndex : resultData.transactionIndex,
                            value : resultData.value,
                        }); 
                        setPopLayerView(true)
                    }
                }catch(err){
                    console.log('eee',err)
                }
            }
        }else{
            setViewItem(item);
            setPopLayerView(true)
        }
    }

    const renderIcon = (code ) => {
        switch (code) {
            case 'eth':
                return (
                    <Image source={{uri:'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/32/ethereum.png'}} style={styles.iconWrap} resizeMode={"contain"} />
                )
                break;
            case 'klay' :
                return (
                    <Image source={{uri:'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/32/cosmos.png'}} style={styles.iconWrap} resizeMode={"contain"} />
                )
            default:
                return (
                    <Image source={{uri:'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/32/ethereum.png'}} style={styles.iconWrap} resizeMode={"contain"} />
                )
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
                <>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{width:'100%',height:'100%'}}
                >
                    {
                        data.length > 0 ?
                        data.map((item,index) => {
                            return (
                                <View style={styles.assetWrap} key={index}>
                                    <View style={styles.assetCoinLogoWrap}>
                                        {renderIcon(props.coinMaker)}
                                        <Text style={styles.assetCoinMakerCode}>{props.coinMaker.toString().toUpperCase()}</Text>
                                    </View>
                                    <View 
                                        style={styles.assetCoinMakerWrap}
                                        //onPress={()=>getTransactionHashInfo(item.transactionHash) }
                                        
                                    >
                                        <Text style={styles.assetCoinMakerCode}>{item.blockHash}</Text>
                                        <Text style={styles.assetCoinMakerCode}>
                                            issued data : {CommonUtils.convertUnixToDate(item.date)}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.assetArrowWrap}
                                        onPress={()=>getTransactionHashInfo(item) }
                                        //onPress={()=>{setViewItem(item); setPopLayerView(true)} }
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
                        :
                        <View style={styles.blankWrap}>
                             <Text style={styles.assetCoinMakerCode}>Not found data</Text>
                        </View>
                        
                    }
                    
                </ScrollView>
                { !CommonUtils.isEmpty(viewItem) &&
                <View style={styles.fixedFullWidth}>
                    <Overlay
                        isVisible={popLayerView}                        
                        windowBackgroundColor="rgba(0, 0, 0, 0.8)"
                        overlayBackgroundColor="tranparent"
                        overlayStyle={styles.overStyle}
                    >
                        <View style={styles.overlayDataWrap}>
                            <Text style={styles.mainTitleText}>Transaction Information</Text>
                            <Text style={styles.titleSubText}>
                                <Text style={styles.titleSubTextYellow}>date:</Text>{CommonUtils.convertUnixToDate(viewItem.date)}
                            </Text>
                            <Text style={styles.titleSubText}>
                                <Text style={styles.titleSubTextYellow}>BlockHash:</Text>{viewItem.blockHash}
                            </Text>
                            <Text style={styles.titleSubText}>
                                <Text style={styles.titleSubTextYellow}>BlockNumbeer:</Text>{viewItem.blockNumber}
                            </Text>
                            <Text style={styles.titleSubText}>
                                <Text style={styles.titleSubTextYellow}>from:</Text>{viewItem.from}
                            </Text>
                            <Text style={styles.titleSubText}>
                                <Text style={styles.titleSubTextYellow}>to:</Text>{viewItem.to}
                            </Text>
                            <Text style={styles.titleSubText}>
                                <Text style={styles.titleSubTextYellow}>transactionHash:</Text>{viewItem.transactionHash}
                            </Text>
                            <Text style={styles.titleSubText}>
                                <Text style={styles.titleSubTextYellow}>transactionIndex:</Text>{viewItem.transactionIndex}
                            </Text>
                            <Text style={styles.titleSubText}>
                                <Text style={styles.titleSubTextYellow}>nonce(이전수행한트랜잭션수):</Text>{viewItem.nonce}
                            </Text>
                            <Text style={styles.titleSubText}>
                                <Text style={styles.titleSubTextYellow}>gas Price(제공가스가격):</Text>
                                {web3Http.utils.fromWei(viewItem.gasPrice.toString(),'ether')}
                              {/*   {`${parseFloat(viewItem.gasUsed)}`} */}
                            </Text>
                            <Text style={styles.titleSubText}>
                                <Text style={styles.titleSubTextYellow}>gas(보낸이가제공한가스):</Text>
                                {web3Http.utils.fromWei(viewItem.gas.toString(),'ether')}
                            </Text>
                            <Text style={styles.titleSubText}>
                                <Text style={styles.titleSubTextYellow}>value(전송값):</Text>
                                {web3Http.utils.fromWei(viewItem.value.toString(),'ether')}
                              {/*   {`${parseFloat(viewItem.gasUsed)}`} */}
                            </Text>
                            <TouchableOpacity 
                                onPress={()=>setPopLayerView(false)}
                                style={styles.overlayButtonWrap}>
                                <Text style={styles.overlayButtonText}>
                                    닫기
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Overlay>
                </View>
                }
                </>
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
    centerStyle : {
        flex:1,
        justifyContent :'center',
        alignItems:'center'
    },
    blankWrap : {
        flex:1,
        paddingVertical:50,
        justifyContent:'center',
        alignItems:'center'
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
        fontSize:11,lineHeight:15,color:'#ccc'
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
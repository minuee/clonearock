import React, { useEffect, useState,useRef } from 'react';
import { View, Text, StyleSheet, ScrollView,Dimensions, Image as NativeImage,TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
import { Header,Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();

import CommonUtils from '../utils/CommonUtils';
import mConst from '../utils/Constants';
import MoreLoading from "../utils/MoreLoading";

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const BTN_PLAY = require('../../assets/play.png');
const BTN_PAUSE = require('../../assets/pause.png');
const url = "https://testnets-api.opensea.io/api/v1/assets?order_direction=desc&offset=0&limit=20&include_orders=false&owner=0xD8b2e5798F322C8631e4FF2F784cA3907e7Fb236";
export default function DappScreen(props) {

    const [isLoading, setLoading] = useState(true);
    const [nftArray, setNftArray] = useState([]);
    const [playVideoID, setPlayVideoID] = useState(null);
    const refVideo = useRef(null);

    const clickPlayVideoID = (id) => {
        if ( playVideoID === id ) {
          setPlayVideoID(null)
        }else{
          setPlayVideoID(id)
        }
        
      }

    const getDetailData = async() => {
        try{
            fetch(url, {
                headers: {
                    'Content-type': 'application/json'
                },
                method: 'GET',
                body: null,
            })
            .then(res => res.json())
            .then(result => {
                
                if ( !CommonUtils.isEmpty(result.assets)) {
                    //console.log('result',result.assets[0])
                    //console.log('result',result.assets[1])
                    setNftArray(result.assets)
                }
            });
            
        }catch(e){
            console.log('eeeeee',e)
            CommonUtils.fn_call_toast('네트워크 오류입니다.');          
        }
    }

    useEffect(() => {
        getDetailData();
    }, [props.route.params]);

    const onBuffer = () => {
    }

    const videoError = (e) => {
        console.log('eeeee',e)
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
                centerComponent={{ text: 'My NFT(Opensea)', style: { fontSize: mConst.navTitle,color: '#000' } }}                    
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
                    { 
                    nftArray.map((item, index) => {
                        return (
                            <View key={index} style={styles.bannerWrap}>
                                <View style={styles.topFixWrap}>
                                    <Text style={styles.nameText}>{item.name}</Text>
                                    <Text style={styles.descText}>{item.description}</Text>
                                </View>
                                { 
                                ( !CommonUtils.isEmpty(item.animation_url) && playVideoID == item.id  ) ?
                                <Video 
                                    source={{uri: item.animation_url}}
                                    ref={refVideo}
                                    muted={true}
                                    onBuffer={onBuffer}
                                    onError={videoError}
                                    controls={true}
                                    poster={item.image_preview_url}
                                    fullscreen={true}
                                    //paused={true}
                                    style={styles.backgroundVideo} 
                                />
                                :
                                <FastImage 
                                    source={{uri : item.image_preview_url}} 
                                    style={styles.bannerImage} 
                                    resizeMode={"contain"} 
                                />
                                }
                                {/* <View style={styles.bottomFixWrap}>
                                    <Text style={styles.descText}>ContactAddr({item.asset_contract.address})</Text>
                                    <Text style={styles.descText}>TokenID({item.token_id})</Text>
                                </View> */}
                                {
                                    !CommonUtils.isEmpty(item.animation_url) && (
                                        <TouchableOpacity 
                                            onPress={() => clickPlayVideoID(item.id)}
                                            style={styles.bottomButtonFixWrap}>
                                            <NativeImage
                                                source={playVideoID == item.id ? BTN_PAUSE : BTN_PLAY}
                                                style={{width:50,height:50,zIndex:10}}
                                            />
                                        </TouchableOpacity>
                                    )
                                }
                            </View>
                        )
                    })}
                
                    <View style={{height:150}}></View>
                </View>
            </ScrollView>
        </View>
        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,        
    },
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 16,
        paddingVertical:20
    },
    bannerWrap : {
        flex:1,        
        justifyContent:'center',
        alignItems:'center',
        marginBottom:10,         
        overflow:'hidden'
    },
    bannerImage : {
        width:SCREEN_WIDTH-40,
        height:SCREEN_WIDTH-40
    },
    topFixWrap : {
        position:'absolute',
        top:0,
        left:0,
        width:'100%',
        height:60,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#000',
        opacity:0.7,
        zIndex:10
    },
    bottomFixWrap : {
        position:'absolute',
        bottom:0,
        left:0,
        width:'100%',
        height:120,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#000',
        opacity:0.7,
        zIndex:10
    },
    bottomButtonFixWrap : {        
        position:'absolute',
        top:'45%',
        left:'45%',
        width:50,
        height:50,
        justifyContent:'center',
        alignItems:'center'
    },
    nameText : {
        color:'#fff',
        fontWeight:'bold',
        fontSize: CommonUtils.scale(15),
        lineHeight: CommonUtils.scale(20),
    },
    boldText : {
        color:'#ff0000',
        fontWeight:'bold',
        fontSize: CommonUtils.scale(13),        
    },
    descText : {
        color:'#fff',
        fontWeight:'bold',
        fontSize: CommonUtils.scale(13),
        lineHeight: CommonUtils.scale(20),
    },
    backgroundVideo : {
        width:SCREEN_WIDTH-40,
        height:(SCREEN_WIDTH-40)*3/4
    }
});

import React,{ useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet,  Linking, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFocusedRouteNameFromRoute, useFocusEffect,useIsFocused } from '@react-navigation/native';
import { Header,Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();

import CommonUtils from '../utils/CommonUtils';
import mConst from '../utils/Constants';
import MoreLoading from "../utils/MoreLoading";
import caver from '../klaytn/caver';
//import KlaystagramContract from '../klaytn/KlaystagramContract'

export default function MyNFTScreen(props) {

    const DEPLOYED_ADDRESS = mConst.deployedAddress;
    const DEPLOYED_ABI = mConst.deployedABI2;
    const [feedContract, setCountContract] = useState(DEPLOYED_ABI && DEPLOYED_ADDRESS && new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS));

    const isFocused = useIsFocused();
    
    
    const [walletFromSession, setWalletFromSession] = useState(null);    
    const [walletAddresss, setWalletAddress] = useState(null);
    const [feed, setFeed] = useState(null);
    //console.log('walletFromSession',walletFromSession)
    
    
    useEffect(() => {        
        //console.log('isFocusedisFocusedisFocused222',feedContract);
        getFeed()        
    }, []);

    const getFeed = () => {        
        feedContract.methods.getTotalPhotoCount().call()
          .then((totalPhotoCount) => {
            if (!totalPhotoCount) return []
            const feed = []
            for (let i = totalPhotoCount; i > 0; i--) {
              const photo = KlaystagramContract.methods.getPhoto(i).call()
              feed.push(photo)
            }
            return Promise.all(feed)
          })
          .then((feed) => {
              //console.log('feedParser(feed)',feedParser(feed))
              setFeed(feedParser(feed))
            }
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
                centerComponent={{ text: 'My NFT', style: { fontSize: mConst.navTitle,color: '#000' } }}                    
                rightComponent={(
                    <View style={{flex:1,paddingRight:10,justifyContent:'center'}}>
                        
                    </View>
                )}
                containerStyle={{borderBottomWidth: 0}}
            />  
            <View style={styles.mainContainer}>
                <View style={{flex:2}}>
                    <View style={{flex:1}}>
                        <Text style={styles.smallTitle}>My Wallet address : {walletAddresss}</Text>
                        
                    </View>                    
                </View>
                <View style={{flex:3}}>
                    
                    
                </View>
            </View>
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
    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    smallTitle : {
        textAlign: 'center',
        fontSize: 15,
        
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
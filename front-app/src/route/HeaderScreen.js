import React, {useEffect,useRef,useState,useCallback, useContext} from "react";
import { Text, StyleSheet, View, AppState } from "react-native";
import { useFocusEffect,useIsFocused } from '@react-navigation/native';
import {Header,Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonUtils from '../utils/CommonUtils';
import mConst from "../utils/Constants";
import localStorage from '../store/LocalStorage';
import UserTokenContext from '../store/UserTokenContext';
const STORAGE_KEY = localStorage.MyHDWallet;

const HeaderScreen = (props) => {
    const {walletInfo,setUserInfo} = useContext(UserTokenContext);
    const [isWalletLogin, setWalletLogin] = useState(false);
    const appState = useRef(AppState.currentState);
    
    
    /* useFocusEffect(
        useCallback(() => {
            async function fetchData () {
                const isCheck = await AsyncStorage.getItem(STORAGE_KEY);
                if ( !CommonUtils.isEmpty(isCheck)) {
                    const isCheckJson = JSON.parse(isCheck);
                    if ( !CommonUtils.isEmpty(isCheckJson.publicKey)) {
                        setWalletLogin(true);
                        setUserInfo({
                            walletInfo: {
                                publicAddress : isCheckJson.publicKey,
                                privateAddress : isCheckJson.privateKey,
                                mnemonicCode : isCheckJson.mnemonicCode
                            }
                        });
                    }else{
                        setWalletLogin(false);
                    }
                }else{
                    setWalletLogin(false);
                }
            }
            fetchData();   
        }, [])
    ); */

    const handleAppStateChange = nextAppState => {        
        if( appState.current.match(/inactive|background/) && nextAppState === 'active' ) {
            //console.log('⚽️⚽️App has come to the foreground!');
        }
        if ( appState.current.match(/inactive|active/) && nextAppState === 'background' ) {
            //console.log('⚽️⚽️App has come to the background!');
        }
        appState.current = nextAppState;
    };
    
    useEffect(() => {
        AppState.addEventListener('change', handleAppStateChange);
        return () => {
            AppState.removeEventListener('change', handleAppStateChange);
        }
    }, []);    

    return (
        <View style={styles.container}>
            <Header
                backgroundColor="#e5293e"
                statusBarProps={{translucent: true, backgroundColor: 'transparent', barStyle: 'light-content', animated: true}}
                leftComponent={(
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                        <Icon
                            name={isWalletLogin ?  "exit" :  "enter"}
                            type="ionicon"
                            size={mConst.navIcon}
                            color="white"
                            onPress={() => props.screenProps.navigation.navigate('LoginScreen')}
                        />
                        {/* {
                            isWalletLogin && (
                                <Icon
                                    name={"ios-archive"}
                                    type="ionicon"
                                    size={mConst.navIcon}
                                    color="white"
                                    onPress={() => props.screenProps.navigation.navigate('MyWalletScreen')}
                                />
                            )
                        } */}
                    </View>
                )}
                centerComponent={{text:props.navTitle || '', style: {fontSize:mConst.navTitle, color: 'white'}}}
                rightComponent={(
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                        <Icon
                            name="ios-notifications-outline"
                            type="ionicon"                            
                            size={mConst.navIcon}
                            color="white"
                            onPress={() => props.screenProps.navigation.navigate('NotificationScreen')}
                        />
                        <Text>{" "}</Text>
                        <Icon
                            name="md-menu"
                            type="ionicon"                            
                            size={mConst.navIcon}
                            color="white"
                            onPress={() => props.screenProps.navigation.toggleDrawer()}
                        />                        
                    </View>
                )}
                rightContainerStyle={{
                    flexDirection:'row',
                    alignItems:'center',
                    justifyContent:'flex-end'
                }}
                containerStyle={{borderBottomWidth: 0}}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        justifyContent:'center'
    }
})
export default HeaderScreen;
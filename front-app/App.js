import './global';
import React, {useEffect, useState, useContext} from 'react';
import { LogBox, StatusBar, StyleSheet, Text, View, Platform, BackHandler, Dimensions, Image} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import RNExitApp from 'react-native-exit-app';
import AsyncStorage from '@react-native-async-storage/async-storage';
LogBox.ignoreAllLogs();

import { QueryClient, QueryClientProvider } from 'react-query';


import CommonUtils from './src/utils/CommonUtils'
import AppStack from './src/route/AppStack';
import AuthStack from './src/route/AuthStack';
import UserTokenContext from './src/store/UserTokenContext';
import localStorage from './src/store/LocalStorage';

const STORAGE_KEY = localStorage.MyHDWallet;

import AppIntroSlider from './src/screens/AppIntroSlider';
import CustomSplash from './src/screens/CustomSplash';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const ExpireDate = Date.parse(new Date());

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})
const App = () => {
    const {isSessionAlive,exitApp,setUserInfo} = useContext(UserTokenContext);
    const [isFirst, setIsFirst] = useState(true);
    const [pinCodeData, setPinCodeData] = useState(null);
    const [openSplashScreen, setSplashScreen] = useState(true);
    
    useEffect(() => {
        async function fetchData () {        
            const pinCodeData = await AsyncStorage.getItem('pinCodeData');        
            const isFirstOpen = await AsyncStorage.getItem('isFirstOpen');
            const isCheck = await AsyncStorage.getItem(STORAGE_KEY);
            //console.log('isCheck',isCheck)
            if ( !CommonUtils.isEmpty(isCheck)) {
                const isCheckJson = JSON.parse(isCheck);
                //console.log('isCheckJson', isCheckJson)
                if ( !CommonUtils.isEmpty(isCheckJson.publicKey)) {
                    //console.log('isCheckJson.publicKey', isCheckJson.publicKey)
                   //console.log('isCheckJson.publicKey', isCheckJson.publicKey)
                    //console.log('isCheckJson.publicKey', isCheckJson.mnemonicCode)
                    /* const data2222 = {
                        publicAddress : isCheckJson.publicKey.toString(),
                        privateAddress : isCheckJson.privateKey.toString(),
                        mnemonicCode : {
                            locale : isCheckJson.mnemonicCode.locale.toString(),
                            path : isCheckJson.mnemonicCode.path.toString(),
                            phrase : isCheckJson.mnemonicCode.phrase.toString()
                        }
                    } */
                    setUserInfo({                        
                        walletInfo: {
                            publicAddress : isCheckJson.publicKey.toString(),
                            privateAddress : isCheckJson.privateKey.toString(),
                        },
                        walletMnemonic : {
                            mnemonicCode : isCheckJson.mnemonicCode
                        }
                    });
                }
            }
            // ?????????????????? ????????????
            setPinCodeData(pinCodeData != undefined ? pinCodeData : null)
            // ????????????????????? ????????? ????????? ??????????????? ??????.
            setIsFirst(isFirstOpen != undefined ? false : true)
            setTimeout(() => {
                SplashScreen.hide();
            }, 0);
            setTimeout(() => {
                setSplashScreen(false);
            }, 2000);
        }
        fetchData();    
    }, []);

    useEffect(() => {
        if ( Platform.OS === 'android'){            
            //console.log('handleBackButton1111',exitApp)
            BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        }        
    }, [exitApp]);

    const handleBackButton = () => {        
        if (exitApp == undefined || !exitApp) {            
            CommonUtils.fn_call_toast('?????? ??? ???????????? ???????????????.');
            setUserInfo({exitApp:true});
            const timeout = setTimeout(
                () => {
                    setUserInfo({exitApp:false});
                },2000
            );
        } else {            
            setUserInfo({exitApp:false})
            RNExitApp.exitApp();  // ??? ??????
        }
        return true;
    };

    const _renderItem = ({ item }) => {
        const a = 360;
        const b = 660;
        return (
            <View style={{width: SCREEN_WIDTH,height: SCREEN_HEIGHT,alignItems: 'center',justifyContent: 'center',backgroundColor: item.backgroundColor}}>
                <Image
                    style={{width: SCREEN_WIDTH}}
                    source={item.image} 
                    resizeMode='contain'
                />
            </View>
        );
    };

    _onDone = async() => {
        await AsyncStorage.setItem('isFirstOpen', ExpireDate.toString());
        setIsFirst(false)
    };
    _onSkip = async() => {
        await AsyncStorage.setItem('isFirstOpen', ExpireDate.toString());
        setIsFirst(false)
    };

    return openSplashScreen ? (
        <CustomSplash 
            propsSplashScreen={setSplashScreen}
        />
    ) : 
    isFirst ? 
    (
        <View style={{ flex: 1 }}>
        { Platform.OS === 'android' && <StatusBar barStyle={"dark-content"} animated={true} hidden={true}/>}
            <AppIntroSlider
                slides={slides}
                renderItem={_renderItem}
                onDone={_onDone}
                showSkipButton={true}
                onSkip={_onSkip}
                paginationStyle={{backgroundColor:'#fff'}}
            />
        </View>
    )
    :
    (
        <SafeAreaProvider>
            <NavigationContainer>
                { 
                    isSessionAlive ?
                    <QueryClientProvider client={queryClient}>
                        <AppStack />
                    </QueryClientProvider>
                    
                    :
                    <QueryClientProvider client={queryClient}>
                        <AuthStack screenState={pinCodeData}/>
                    </QueryClientProvider>
                    
                }
            </NavigationContainer>
        </SafeAreaProvider>
    )
};


const slides = [    
    {
        key: 's1',
        text: '',
        title: '',
        type : 'require',
        image: require('./assets/images/img_intro_01.png'),
        backgroundColor: '#00a0d5',
    },
    {
        key: 's2',
        text: '',
        title: '',
        type : 'require',
        image: require('./assets/images/img_intro_02.png'),
        backgroundColor: '#e6eff3',
    },
    {
        key: 's3',
        text: '',
        title: '',
        type : 'require',
        image: require('./assets/images/img_intro_03.png'),
        backgroundColor: '#e6eff3',
    },
    {
        key: 's4',
        text: '',
        title: '',
        type : 'require',
        image: require('./assets/images/img_intro_04.png'),
        backgroundColor: '#e6eff3',
    }   
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default App;
import React,{useRef, useEffect, useState,useContext} from 'react';
import {Vibration,StyleSheet,Platform,Image,Dimensions,Alert,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import CommonUtils from '../utils/CommonUtils';
import mConst from '../utils/Constants'
//Tabs 01
import HomeScreen from '../screens/HomeScreen'; 
import WalletScreen from '../screens/WalletScreen'; 
import RewardScreen from '../screens/RewardScreen'; 
import UserTokenContext from '../store/UserTokenContext';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const base_color = mConst.baseColor;


import QRScaner from '../component/QRScaner';

const MainScreen = (props) =>{    
    const {focusTabHome, setUserInfo} = useContext(UserTokenContext);
    const [isScanView, setScanView] = useState(false);
    const [scaned, setScaned] = useState(true);    
    const [tabIndex, setTabIndex] = useState(2);    
    
    
    useEffect(() => {        
        // 종료후 재시작을 했을때 초기화
        setScaned(true);
      }, []);
    
    /* const CustomTabsLabel = (str,tcolor = '#fff' ) => {                    
        return (
            <Text style={[styles.labelText,{color:tcolor}]}>{str}</Text>
        )
    } */

    const onBarCodeRead = (event) => {
        if (!scaned) return;
        setScaned(false);
        Vibration.vibrate();
        Alert.alert("QR Code", event.nativeEvent.codeStringValue, [
          { text: "OK", onPress: () => {setScaned(true);setScanView(false)} },
        ]);
    };

    const toggleNavMenu = (color) => {
        //console.log('toggleNavMenu',tabIndex)
        if ( focusTabHome ) {            
            setScanView(true);
        }else{            
            props.navigation.navigate('HomeScreen');            
        }        
    }

    if ( isScanView  ) {
        return (
            <QRScaner
                setScanView={setScanView}  
                onBarCodeRead={onBarCodeRead}
            />
        ) 
    }else{
        return(
            <Tab.Navigator
                initialRouteName="HomeScreen"
                screenOptions={{
                    tabBarActiveTintColor: base_color,
                    tabBarActiveBackgroundColor: '#e5293e',
                    tabBarInactiveBackgroundColor: '#e5293e',
                    tabBarInactiveTintColor:  '#979797',
                    tabBarShowLabel: false,
                    tabBarStyle:{}
                }}                
                //tabPress={this.actionToggleDrawer()}
            >
                <Tab.Screen
                    name="WalletScreen"
                    options={{
                        //tabBarLabel: ({color})=>CustomTabsLabel('지갑',color),
                        headerShown:false,
                        tabBarIcon: ({color}) => (
                            <TouchableOpacity 
                                onPress={()=>{setTabIndex(1);props.navigation.navigate('WalletScreen')}}
                                style={{flex:1,justifyContent:'center',alignItems:'center'}}
                            >
                                <Icon
                                    name="payment"
                                    size={CommonUtils.scale(25)}
                                    color={color === base_color  ? "yellow" : "#fff"}                                     
                                />
                            </TouchableOpacity>
                        )
                    }}
                >
                    {props => <WalletScreen {...props} screenProps={props} />}
                </Tab.Screen>
                <Tab.Screen
                    name="HomeScreen"
                    component={HomeScreen}
                    options={{
                        headerShown:false,
                        tabBarIcon: ({color}) => (
                            <TouchableOpacity 
                                onPress={()=>toggleNavMenu()}
                                style={{flex:1,justifyContent:'center',alignItems:'center'}}
                            >
                               {/*  <Image 
                                    source={color === base_color ? require('../../assets/tab2_on.png') : require('../../assets/tab2_off.png')}
                                    resizeMode={'contain'}
                                    style={Platform.OS === 'ios' ? styles.tabsWrapiOS : styles.tabsWrapAndroid}
                                /> */}
                                <Icon
                                    name={color === base_color ? "filter-center-focus" : "adjust" }
                                    size={CommonUtils.scale(35)}
                                    color={"white"} 
                                />
                            </TouchableOpacity>
                        ),
                    }}
                    listeners={{
                        tabPress: e => {
                            console.log('tabPress',e)
                            // Prevent default action
                            e.preventDefault();
                        },
                     }}
                />               
                <Tab.Screen
                    name="RewardScreen"
                    component={RewardScreen}                    
                    options={{                        
                        //tabBarLabel: ({color})=>this.CustomTabsLabel('검색',color),
                        headerShown: false,
                        tabBarIcon: ({color}) => (
                            <TouchableOpacity 
                                onPress={()=>{setTabIndex(3);props.navigation.navigate('RewardScreen',{screenState:{tabIndex:1}})}}
                                style={{flex:1,justifyContent:'center',alignItems:'center'}}
                            >
                                <Icon
                                    name="stream"
                                    size={CommonUtils.scale(25)}
                                    color={color === base_color  ? "yellow" : "#fff"}
                                />
                            </TouchableOpacity>
                        ),                    
                        //barStyle: {backgroundColor: '#ffffff'},
                    }}
                />
            </Tab.Navigator>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,        
    },
    fullContainer: {
        flex: 1,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        
    },
    fixedButton : {
        position:'absolute',
        right:0,
        top:50,
        width:50,
        height:50,
        zIndex:10
    },
    fixedBottomWrap : {
        position:'absolute',
        left:0,
        bottom:100,
        width:SCREEN_WIDTH,
        height:50,
        alignItems:'center',
        justifyContent:'center',
        zIndex:10
    },
    fixedBallWrap : {
        width:50,
        height:50,
        borderWidth:1,
        borderColor:'#fff',
        borderRadius:25,
        alignItems:'center',
        justifyContent:'center',
    },
    scanner: { 
        flex: 1 
    },
    qrcodeTextWrap : {
        position:'absolute',        
        left: 20,
        top: SCREEN_HEIGHT*0.25,
        justifyContent: 'center',
        alignItems: 'center',
        width:SCREEN_WIDTH-40,
        zIndex:10
    },
    qrcodeWrap : {
        position:'absolute',        
        left: (SCREEN_WIDTH / 2) - ( SCREEN_WIDTH*0.35 ),
        top: SCREEN_HEIGHT*0.35,
        justifyContent: 'center',
        alignItems: 'center',
        width:SCREEN_WIDTH*0.7,
        height:SCREEN_WIDTH*0.7,
        zIndex:10
    },
    infoLargeText : {
        color:'#fff',        
        fontSize: CommonUtils.scale(15)
    },
    infoSmallText : {
        color:'#fff',        
        fontSize: CommonUtils.scale(13)
    },
    IndicatorContainer : {
        flex: 1,
        width:'100%',
        backgroundColor : "#fff",
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    labelText : { 
        fontSize : 11,        
        margin : 0,padding:0,
        paddingTop:2,
        ...Platform.select({
            ios : {
                marginTop:-5,
                marginBottom:5
            },
            android : {
                marginTop:2,
                marginBottom:-2
            }
        })
    },
    tabsWrapAndroid : {
        width:CommonUtils.scale(30),height:CommonUtils.scale(30)
    },
    tabsWrapiOS : {
        width:CommonUtils.scale(30),height:CommonUtils.scale(30)
    },
    tabsWrapAndroid2 : {
        width:CommonUtils.scale(44),height:CommonUtils.scale(44)
    },
    tabsWrapiOS2 : {
        width:CommonUtils.scale(60),height:CommonUtils.scale(60)
    }
});


export default MainScreen;
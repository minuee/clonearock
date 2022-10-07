import React from 'react';
import {Dimensions} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {createDrawerNavigator,useDrawerStatus} from '@react-navigation/drawer';

//Import all the screens
import MainScreen from './MainScreen';
import SampleScreen from '../utils/SampleScreen';
import LoginScreen from '../screens/LoginScreen';
import LoginScreenSub from '../screens/LoginScreenSub';

import NotificationScreen from '../screens/NotificationScreen';
import NotificationDetail from '../screens/NotificationDetail';
import GetWalletScreen from '../screens/GetWalletScreen';
import SetWalletScreen from '../screens/SetWalletScreen';
import IntruduceScreen from '../screens/IntruduceScreen';
import AlarmSetup from '../screens/AlarmSetup';
import NoticeScreen from '../screens/NoticeScreen';
import FaqScreen from '../screens/FaqScreen';
import BookMarkScreen from '../screens/BookMarkScreen';
import BookMarkAdd from '../screens/BookMarkAdd';
import WebSocket from '../screens/WebSocket';
import MyWalletScreen from '../screens/MyWalletScreen';
import DappScreen from '../screens/DappScreen';
import ChatScreen from '../screens/ChatScreen';

import AssetsScreen from '../screens/AssetsScreen';
import AddCoinScreen from '../screens/AddCoinScreen';
import CoinSendScreen from '../screens/CoinSendScreen'
// import custom drawer
import CustomDrawer  from './CustomDrawer';

//지갑생성
import MakeStep1Screen from '../screens/wallet/MakeStep1Screen';
import MakeStep2Screen from '../screens/wallet/MakeStep2Screen';
import MakeStep3Screen from '../screens/wallet/MakeStep3Screen';


// import wallet make stack
import { WalletMakeStack }   from './WalletStack';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
// Stack and Drawer 생성
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeScreenStack = (navigation,route) => {
  
    return (
      <Stack.Navigator
          initialRouteName="MainScreen"
          screenOptions={{
            cardOverlayEnabled: true,
            //headerShown: false//여기에 옵션을 주면 하위 스택에 모두 적용
          }} 
      > 
        <Stack.Screen options={{headerShown: false}} name="MainScreen" component={MainScreen} />
        <Stack.Screen options={{headerShown: false}} name="LoginScreen" component={LoginScreen} />
        <Stack.Screen options={{headerShown: false}} name="LoginScreenSub" component={LoginScreenSub} />
        <Stack.Screen options={{headerShown: false}} name="MyWalletScreen" component={MyWalletScreen} />
        <Stack.Screen options={{headerShown: false}} name="AssetsScreen" component={AssetsScreen} />
        <Stack.Screen options={{headerShown: false}} name="AddCoinScreen" component={AddCoinScreen} />

        <Stack.Screen options={{headerShown: false}} name="ChatScreen" component={ChatScreen} />

        <Stack.Screen options={{headerShown: false}} name="NotificationScreen" component={NotificationScreen} />
        <Stack.Screen options={{headerShown: false}} name="NotificationDetail" component={NotificationDetail} />
        <Stack.Screen options={{headerShown: false}} name="GetWalletScreen" component={GetWalletScreen} />
        <Stack.Screen options={{headerShown: false}} name="SetWalletScreen" component={SetWalletScreen} />
        <Stack.Screen options={{headerShown: false}} name="IntruduceScreen" component={IntruduceScreen} />
        <Stack.Screen options={{headerShown: false}} name="BookMarkScreen" component={BookMarkScreen} />
        <Stack.Screen options={{headerShown: false}} name="BookMarkAdd" component={BookMarkAdd} />
        <Stack.Screen options={{headerShown: false}} name="AlarmSetup" component={AlarmSetup} />
        <Stack.Screen options={{headerShown: false}} name="NoticeScreen" component={NoticeScreen} />
        <Stack.Screen options={{headerShown: false}} name="WebSocket" component={WebSocket} />
        <Stack.Screen options={{headerShown: false}} name="DappScreen" component={DappScreen} />

        <Stack.Screen options={{headerShown: false}} name="CoinSendScreen" component={CoinSendScreen} />
        
        <Stack.Screen options={{headerShown: false}} name="WalletMakeStack" component={WalletMakeStack} />

        <Stack.Screen options={{headerShown: false}} name="MakeStep1Screen" >
              {props => <MakeStep1Screen {...props} extraData={route} />}
          </Stack.Screen>
          <Stack.Screen options={{headerShown: false}} name="MakeStep2Screen" >
              {props => <MakeStep2Screen {...props} extraData={route} />}
          </Stack.Screen>
          <Stack.Screen options={{headerShown: false}} name="MakeStep3Screen" >
              {props => <MakeStep3Screen {...props} extraData={route} />}
          </Stack.Screen>
        
        <Stack.Screen options={{ title: '스피치존' }} name="SampleScreen" >
          {props => <SampleScreen {...props}  extraData={route} />} 
        </Stack.Screen>        
      </Stack.Navigator>
    );
};

const AppStack = () => {
    return (      
        <Drawer.Navigator
          initialRouteName="HomeScreenStack"
          drawerContent={props => <CustomDrawer {...props} />}
          screenOptions={{
            // ...(Platform.OS === 'android' ? {swipeEnabled: false} : {swipeEnabled: true}),
            headerShown: false,  // 기본헤더 노출여부
            swipeEnabled: true, // 손으로 서랍을 열고닫을 옵션
            drawerStyle : {
              width:SCREEN_WIDTH
            }            
          }}>
          <Stack.Screen name="HomeScreenStack" component={HomeScreenStack} />
          <Stack.Screen options={{headerShown: false}} name="FaqScreen" component={FaqScreen} />
        </Drawer.Navigator>      
    )
}

export default AppStack;
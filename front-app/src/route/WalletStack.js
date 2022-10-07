import React, { Component } from 'react';
import {TouchableOpacity,Text,PixelRatio,View,Platform} from 'react-native';
const Stack = createStackNavigator();
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();

import {createStackNavigator} from '@react-navigation/stack';
import CommonUtils from '../utils/CommonUtils';

import MakeStep1Screen from '../screens/wallet/MakeStep1Screen';
import MakeStep2Screen from '../screens/wallet/MakeStep2Screen';
import MakeStep3Screen from '../screens/wallet/MakeStep3Screen';

const WalletMakeStack = ({navigation,route}) => {    
    
    return (
        <Stack.Navigator
            initialRouteName={'MakeStep1Screen'}
            screenOptions={{
                headerStyle: {shadowColor: 'transparent',elevation: 0,shadowOpacity: 0,borderBottomWidth: 0},
                headerLeft: () => (
                    <TouchableOpacity 
                        onPress= {()=> navigation.goBack(-1)} 
                        style={{flex:2,flexGrow:1,paddingLeft:20,flexDirection:'row',alignItems:'center'}}
                    >
                        <Icon
                            name="arrow-back-ios"
                            size={CommonUtils.scale(20)}
                            color={'#000'}
                        />                        
                    </TouchableOpacity>
                ),
                
                headerTitle : () => (
                    <View style={{flex:0.2,flexGrow:1,justifyContent:'center',alignItems:'center'}} >
                        <Text style={{color:'#000',fontWeight:'bold',fontSize: CommonUtils.scale(17),}}>새 지갑 만들기</Text>  
                    </View>
                ),
                headerRight : () => (
                    <TouchableOpacity 
                        onPress= {()=> navigation.goBack()} 
                        style={{ flex:1,flexGrow:1,justifyContent:'center',paddingRight:15}}
                    >
                        <Icon
                            name="close"
                            size={CommonUtils.scale(20)}
                            color={'#000'}
                        />   
                    </TouchableOpacity> 
                ), 
            }}
            
        >
        
            <Stack.Screen name="MakeStep1Screen" >
                {props => <MakeStep1Screen {...props} extraData={route} />}
            </Stack.Screen>
            <Stack.Screen name="MakeStep2Screen" >
                {props => <MakeStep2Screen {...props} extraData={route} />}
            </Stack.Screen>
            <Stack.Screen name="MakeStep3Screen" >
                {props => <MakeStep3Screen {...props} extraData={route} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
};

export {WalletMakeStack} ;
import React,{useEffect,useState} from 'react';
import { LogBox} from 'react-native';
import {createStackNavigator,} from '@react-navigation/stack';
const Stack = createStackNavigator();
LogBox.ignoreAllLogs();
import AgreeScreen from '../screens/AgreeScreen';
import PinCodeScreen from '../screens/PinCodeScreen';
import PinCodeSetup from '../screens/PinCodeSetup';
import Certification from '../screens/Certification';
import AuthCodeScreen from '../screens/AuthCodeScreen';
import DreamCertification from '../screens/DreamCertification';

import NotificationDetail from '../screens/NotificationDetail';

import QuizIntroScreen from '../screens/quiz/IntroScreen';
import QuizScreen from '../screens/quiz/QuizScreen';

const AuthStack = ({navigation,route,screenState}) => {
    const [initialScreenName, setInitialScreenName] = useState(screenState != undefined ? 'PinCodeScreen' : 'AgreeScreen');
        
    return (
        <Stack.Navigator initialRouteName={initialScreenName} screenOptions={{headerShown: false}}>
            <Stack.Screen name="AgreeScreen" >
                {props => <AgreeScreen {...props} extraData={route} />}
            </Stack.Screen> 
            <Stack.Screen name="DreamCertification" >
                {props => <DreamCertification {...props} extraData={route} />}
            </Stack.Screen> 
            <Stack.Screen name="AuthCodeScreen" >
                {props => <AuthCodeScreen {...props} extraData={route} />}
            </Stack.Screen> 
            <Stack.Screen name="Certification" >
                {props => <Certification {...props} extraData={route} />}
            </Stack.Screen> 
            <Stack.Screen name="PinCodeScreen" >
                {props => <PinCodeScreen {...props} extraData={screenState} />}
            </Stack.Screen> 
            <Stack.Screen name="PinCodeSetup" >
                {props => <PinCodeSetup {...props} extraData={route} />}
            </Stack.Screen> 
            <Stack.Screen name="NotificationDetail" >
                {props => <NotificationDetail {...props} extraData={route} />}
            </Stack.Screen> 

            <Stack.Screen name="QuizIntroScreen" >
                {props => <QuizIntroScreen {...props} extraData={route} />}
            </Stack.Screen> 
            <Stack.Screen name="QuizScreen" >
                {props => <QuizScreen {...props} extraData={route} />}
            </Stack.Screen> 
        </Stack.Navigator>
    );
};

export default AuthStack;
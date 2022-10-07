/**
 * @format
 */
 import './shim';
 import 'react-native-gesture-handler';
 import React from 'react';
 import {AppRegistry} from 'react-native';
 import App from './App';
 import {name as appName} from './app.json';
 
 
 import LoadingProvider from './src/store/LoadingProvider';
 import UserTokenProvider from './src/store/UserTokenProvider';
 
 const index = () => {
     return (
         <LoadingProvider>
             <UserTokenProvider>
                 <App />
             </UserTokenProvider>
         </LoadingProvider>
     );
 };
   
 AppRegistry.registerComponent(appName, () => index);
 
 //AppRegistry.registerComponent(appName, () => App);
 
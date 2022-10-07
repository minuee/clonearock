import React, {useState} from 'react';
import UserTokenContext from './UserTokenContext';

// import * as Keychain from 'react-native-keychain';

const UserTokenProvider = ({children}) => {
  const setIsSessionAlive = bool => {
    setUser(prevState => {
      return {
        ...prevState,
        isSessionAlive: bool,
      };
    });
  };

  const setUserInfo = data => {
    //console.log('setUserInfo',data)
    setUser(prevState => {
      return {
        ...prevState,
        ...data,
      };
    });
  };

  const resetUserInfo = async () => {
    // await Keychain.resetInternetCredentials('auth').then(setUser(initialState));
    setUser(initialState);
  };

  const initialState = {
    isSessionAlive: false,
    exitApp : false,
    myRewardToken : 0,
    myPoint : 0,
    openModalCount : 0,
    mqttTopic : false,
    mqttTopicMsg : [],
    focusTabHome : true,
    userEmail: '',
    walletInfo : {
      publicAddress : null,
      privateAddress : null,
    },
    walletMnemonic : null,
    currencyData : {
      eth : 0
    },
    walletCoins : [],
    setIsSessionAlive,
    setUserInfo,
    resetUserInfo,
  };

  const [user, setUser] = useState(initialState);

  return <UserTokenContext.Provider value={user}>{children}</UserTokenContext.Provider>;
};

export default UserTokenProvider;

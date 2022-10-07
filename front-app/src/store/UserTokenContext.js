import {createContext} from 'react';

const UserTokenContext = createContext({
  isSessionAlive: false,
  exitApp : false,
  userEmail: '',
  myRewardToken : 0,
  myPoint : 0,
  openModalCount : 0,
  mqttTopic : false,
  mqttTopicMsg : [],
  focusTabHome : true,
  walletInfo : {
      publicAddress : null,
      privateAddress : null
  },
  walletMnemonic : null,
  walletCoins : [
  ],
  setIsSessionAlive: () => {},
  setUserInfo: () => {},  
  resetUserInfo: () => {},
});

export default UserTokenContext;

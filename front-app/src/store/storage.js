import AsyncStorage from '@react-native-community/async-storage'

const FCM_KEY = 'mFcmToken'

const setItem = (key, value) => {
  try {
    AsyncStorage.setItem(key, value)
  } catch (error) {
    return false
  }
  return true
}
const getItem = async key => {
  try {
    return await AsyncStorage.getItem(key)
  } catch (error) {
    return undefined
  }
}
const removeItem = key => {
  try {
    AsyncStorage.removeItem(key)
  } catch (error) {
    return false
  }
  return true
}

const mStorage = {
  saveFcmToken: fcmToken => {
    return setItem(FCM_KEY, fcmToken)
  },
  loadFcmToken: async () => {
    return getItem(FCM_KEY)
  },
}

export default mStorage

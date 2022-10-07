import React, { useState,useEffect,useContext } from 'react';
import { View, Text, StyleSheet, TextInput, Alert,ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header,Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();
import UserTokenContext from '../store/UserTokenContext';
import { useFocusEffect,useIsFocused } from '@react-navigation/native';
import mConst from '../utils/Constants';
import CommonUtil from '../utils/CommonUtils';
import localStorage from '../store/LocalStorage';

const STORAGE_KEY = localStorage.MyHDWallet;
const tmpPrivateKey = "0xe6ebf18d26e2fc94d2cd0d7932722a4212d94b950896bb83c01a1d7645bb1766"

export default function LoginScreen(props) {
    const isFocused = useIsFocused();
    const [privateKey, setPrivateKey] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const {walletInfo,setUserInfo} = useContext(UserTokenContext);
    useEffect(() => {
        //setPrivateKey('0xe6ebf18d26e2fc94d2cd0d7932722a4212d94b950896bb83c01a1d7645bb1766')
        //setWalletAddress('0xcb30451512778ae649011e1150e430b031e437d4')
    }, [isFocused]);
    
    // reset method reset states to intial state
    function reset(str) {
        setPrivateKey(str);
    };

    // handleLogin method
    function handleLogin() {
        if ( !CommonUtil.isEmpty(privateKey)) {
            integrateWallet(privateKey);
        } else {
            if ( !CommonUtil.isEmpty(tmpPrivateKey)) {
                integrateWallet(tmpPrivateKey);
            }else{
                wrongPivateKeyAlert();
            }
        }
    };

    function wrongPivateKeyAlert() {
        Alert.alert(
            null,
            '잘못된 private key 입니다.',
            [
                { text: 'OK' }
            ]
        );
    }

    function integrateWallet(privateKey) {        
        try {
            const walletInstance = {
                accountKey: {
                    "_key": "0xe6ebf18d26e2fc94d2cd0d7932722a4212d94b950896bb83c01a1d7645bb1766",
                    "type": "AccountKeyPublic"
                },
                address: "0xcb30451512778ae649011e1150e430b031e437d4",
                privateKey: "0xe6ebf18d26e2fc94d2cd0d7932722a4212d94b950896bb83c01a1d7645bb1766"
            }
            setPrivateKey(privateKey)
            setWalletAddress('0xcb30451512778ae649011e1150e430b031e437d4')
            
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(walletInstance))            
        } catch (error) {
            wrongPivateKeyAlert();
        }
    }

    const removeWallet = async() => {
        try {            
            await AsyncStorage.removeItem(STORAGE_KEY);
            setUserInfo({
                walletInfo: {
                    publicAddress : null,
                    privateAddress : null,
                }
            });
            reset('');
            props.navigation.goBack()
        } catch (error) {
            console.log(error);
        }
    }

    if (privateKey || walletInfo.privateAddress) {
        return (
            <View style={styles.container}>
                <Header
                    backgroundColor="#fff"
                    statusBarProps={{translucent: true, backgroundColor: 'transparent', barStyle: 'dark-content', animated: true}}
                    leftComponent={(
                        <View style={{flex:1,paddingLeft:10,justifyContent:'center'}}>
                            <Icon
                                name="arrow-back-ios"
                                size={mConst.navIcon}
                                color="#000"
                                onPress={() => props.navigation.goBack()}
                            />
                        </View>
                    )}
                    centerComponent={{ text: 'Wallet로그인', style: { fontSize: mConst.navTitle,color: '#000' } }}                    
                    rightComponent={(
                        <View style={{flex:1,paddingRight:10,justifyContent:'center'}} />
                    )}
                    containerStyle={{borderBottomWidth: 0}}
                />  
                <View style={styles.mainContainer}>
                    <Text style={styles.title}>Integrated: {walletAddress || walletInfo.publicAddress}</Text>
                    <Button
                        title="Logout"
                        onPress={removeWallet}
                    />
                </View>
            </View>
        )
    }else{
        return (
            <View style={styles.container}>
                <Header
                    backgroundColor="#fff"
                    statusBarProps={{translucent: true, backgroundColor: 'transparent', barStyle: 'dark-content', animated: true}}
                    leftComponent={(
                        <View style={{flex:1,paddingLeft:10,justifyContent:'center'}}>
                            <Icon
                                name="arrow-back-ios"
                                size={mConst.navIcon}
                                color="#000"
                                onPress={() => props.navigation.goBack()}
                            />
                        </View>
                    )}
                    centerComponent={{ text: 'Wallet로그인', style: { fontSize: mConst.navTitle,color: '#000' } }}                    
                    rightComponent={(
                        <View style={{flex:1,paddingRight:10,justifyContent:'center'}}>
                            
                        </View>
                    )}
                    containerStyle={{borderBottomWidth: 0}}
                />  
                <View style={styles.mainContainer}>
                    <ScrollView
                        style={{width:'100%',height:'100%'}}
                        showsVerticalScrollIndicator={false}
                    >
                    <View style={{flex:1,marginBottom:100}}>
                        <Text style={styles.title}>Private Key: </Text>
                        <TextInput
                            style={styles.input}
                            keyboardType={'default'}
                            onChangeText={setPrivateKey}
                            value={tmpPrivateKey}
                            maxLength={100}
                            multiline
                        />
                        <Button
                            title="Login"
                            type='solid'
                            onPress={handleLogin}
                        />
                    </View>
                    </ScrollView>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center'
    },
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 16,
    },
    title: {
        textAlign: 'center',
        marginVertical: 8,
        fontSize: 20,
        fontWeight: 'bold',
        color:'#555'
    },
    input: {
        height: 50,
        marginVertical: 12,
        padding:5,
        borderWidth: 1,
        color:'#555'
    },
    unselectItem : {
        marginRight:10,
        padding:10,
        maxHeight:45,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor : '#ccc'
    },
    selectItem : {
        marginRight:10,
        padding:10,
        maxHeight:45,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor : '#000'
    },
    itemText : {
        fontSize:13,
        color:'#ffffff'
    }
});

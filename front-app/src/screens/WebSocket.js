import * as React from 'react';
import useWebSocket, { ReadyState } from 'react-native-use-websocket';
import { Button, Platform,Text, TextInput,FlatList, View, StyleSheet } from 'react-native';

import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();

import CommonUtils from '../utils/CommonUtils';
import mConst from '../utils/Constants';
import MoreLoading from "../utils/MoreLoading";

const roomNo = Platform.OS === 'ios' ? 'room1' : 'room1';
const userId = Platform.OS + '_id'
const userName = Platform.OS + '_name'
const WebSocket = (props) => {    
    //const socketUrl = 'ws://10.10.40.185:3000';
    const socketUrl = 'ws://10.10.0.2:3001?room=' + roomNo + '&user_id=' + userId+ '&user_name=' + userName;
    const messageHistory = React.useRef([]);

    const [isLoading, setLoading] = React.useState(true);
    const [message, setMessage] = React.useState(null);    
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);    
    React.useEffect(() => {        
        setTimeout(() => {
            setLoading(false);
        }, 500);        
    }, []);


    const connectionStatus = {
        [ReadyState.CONNECTING]: "Connecting",
        [ReadyState.OPEN]: "Open",
        [ReadyState.CLOSING]: "Closing",
        [ReadyState.CLOSED]: "Closed",
        [ReadyState.UNINSTANTIATED]: "Uninstantiated",
    }[readyState];

    messageHistory.current = React.useMemo(
        () => messageHistory.current.concat(lastMessage),
        [lastMessage]
    );

    const sendM = () => {
        sendMessage(message);
        setTimeout(() => {
            setMessage(null);
        }, 500);  
    }
    
    const handleClickSendMessage = React.useCallback(
        sendM, [sendM]
    );




    if ( isLoading ) {
        return (        
            <View style={styles.container}>
                <MoreLoading isLoading={isLoading} />
            </View>
        )
    }else{
        return (
            <View style={{flex:1}}>
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
                    centerComponent={{ text: 'Socket통신', style: { fontSize: mConst.navTitle,color: '#000' } }}                    
                    rightComponent={(
                        <View style={{flex:1,paddingRight:10,justifyContent:'center'}}>
                            <Text style={{color:'#ff0000'}}>{connectionStatus}</Text>
                        </View>
                    )}
                    containerStyle={{borderBottomWidth: 0}}
                /> 
                <View style={{flex:1,margin:20}}>
                    <TextInput 
                        value={message}
                        placeholder={"Click Me to send 'Hello'"}
                        placeholderTextColor={"#555"}
                        onChangeText={text => setMessage(text)} 
                        style={{borderWidth:1,borderColor:'#ccc',padding:10}}
                    />
                    <Button
                        onPress={handleClickSendMessage}
                        disabled={readyState !== ReadyState.OPEN}
                        title={"Click Me to send Messages"}
                    />
                    <Text style={styles.baseText}>The WebSocket is currently {connectionStatus}</Text>
                    {lastMessage ? <Text>Last message: {lastMessage?.data}</Text> : null}
                    <FlatList
                        keyExtractor={(item, i) => {
                            return item.toString() + i.toString();
                        }}
                        data={messageHistory.current}
                        renderItem={({ item }) =>
                            item && item.data && <Text  style={styles.baseText}>{item.data}</Text>
                        }
                    />
                </View>
            </View>
        );
    }
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    baseText : {
        color: '#555'
    }
});


export default WebSocket;
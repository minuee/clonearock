import * as React from 'react';
import useWebSocket, { ReadyState } from 'react-native-use-websocket';
import { ActivityIndicator,Keyboard,NativeModules,TouchableOpacity, Platform,Text, LogBox,Dimensions, View, StyleSheet } from 'react-native';
import { useFocusEffect,useIsFocused } from '@react-navigation/native';
import {GiftedChat,Bubble,Send,SystemMessage,InputToolbar} from 'react-native-gifted-chat';
import { Header,Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();

import CommonUtils from '../utils/CommonUtils';
import mConst from '../utils/Constants';
import MoreLoading from "../utils/MoreLoading";

const roomNo = Platform.OS === 'ios' ? 'room1' : 'room1';
const userId = Platform.OS === 'ios' ? '10' : '20';
const userName = Platform.OS + '_name';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

LogBox.ignoreLogs(['Animated.event now requires a second argument for options']);
LogBox.ignoreLogs(["EventEmitter.removeListener"]);
//LogBox.ignoreAllLogs()
const ChatScreen = (props) => {    
    //const socketUrl = 'ws://10.10.40.185:3000';
    const isFocused = useIsFocused();
    
    const socketUrliOS = 'ws://10.10.10.148:3001?room=' + roomNo + '&user_id=' + userId+ '&user_name=' + userName;
    const socketUrlAndroid = 'ws://10.10.10.148:3001?room=' + roomNo + '&user_id=' + userId+ '&user_name=' + userName;
    //const socketUrlAndroid = 'ws://10.0.2.2:3001?room=' + roomNo + '&user_id=' + userId+ '&user_name=' + userName;
    const [keyboardStatus, setKeyboardStatus] = React.useState(undefined);
    const didUnmount = React.useRef(false);
    const messageHistory = React.useRef([]);
    const giftedChatRef = React.useRef(null);
    const [seqnum, setSeqnum] = React.useState(0);
    const [isLoading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState(null);
    const [roomMembers, setRoomMembers] = React.useState([]);
    const [isListShow, setListShow] = React.useState(false);    
    const { sendMessage, sendJsonMessage,lastMessage, getWebSocket, readyState } = useWebSocket(Platform.OS == 'ios' ? socketUrliOS : socketUrlAndroid,{
        share:true,
        onOpen: () => console.log('opened'),
        shouldReconnect: (closeEvent) => {
            return didUnmount.current === false;
        },
        reconnectAttempts: 10,
        reconnectInterval: 3000,
    })

    React.useEffect(() => {    
        if ( readyState === 3 ) {
            props.navigation.goBack();
        }
    },[readyState])

    useFocusEffect(
        React.useCallback(() => {
            async function fetchData () {     
                const option = { timeout: 1000 };
                let ms;
                try {
                    ms = await NativeModules.RNReactNativePing.start('10.10.10.148', option);
                } catch (error) {
                    console.log('error',error.code, error.message);
                }
                const {receivedNetworkSpeed,sendNetworkSpeed,receivedNetworkTotal,sendNetworkTotal} = await NativeModules.RNReactNativePing.getTrafficStats();                  
            }
            if ( Platform.OS === 'android') fetchData();     
        }, [])
    );
    
    React.useEffect(() => {        
        const showSubscription = Keyboard.addListener("keyboardWillShow", () => {
            setKeyboardStatus("Keyboard Shown");
        });
        const hideSubscription = Keyboard.addListener("keyboardWillHide", () => {
            setKeyboardStatus("Keyboard Hidden");
        });
        const showSubscription2 = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardStatus("Keyboard Shown");
        });
        const hideSubscription2 = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardStatus("Keyboard Hidden");
        });
        Keyboard.removeAllListeners(showSubscription,showSubscription2,hideSubscription,hideSubscription2);
        messageHistory.current = [];  

        
        if ( !isFocused ) { // blur            
            showSubscription.remove();
            hideSubscription.remove();
            showSubscription2.remove();
            hideSubscription2.remove();
        }     
        
    }, [isFocused]);

    const connectionStatus = {
        [ReadyState.CONNECTING]: "Connecting",
        [ReadyState.OPEN]: "Open",
        [ReadyState.CLOSING]: "Closing",
        [ReadyState.CLOSED]: "Closed",
        [ReadyState.UNINSTANTIATED]: "Uninstantiated",
    }[readyState];

    /* messageHistory.current = React.useMemo(
        () => 
            messageHistory.current.concat(msg)
        ,[lastMessage]
    ); */

    const convertMessages = async(data) => {
        setLoading(true)
        let convertArray = [];        
        await data.forEach(function(element,index,array){         
            const reElement = JSON.parse(element);            
            if ( reElement.room == roomNo.toString()) {                
                convertArray.push(
                    {
                        _id: reElement.rdate,
                        text: reElement.msg,
                        createdAt: new Date(reElement.rdate*1000),
                        system : false,
                        user: {
                            _id: reElement.user_id,
                            name: reElement.user_name,
                            avatar: Platform.OS === 'ios' ? 'https://placeimg.com/140/140/2' : 'https://placeimg.com/140/140/5'
                        },
                    }
                )
            }
        });        
        //return convertArray;
        messageHistory.current = convertArray.sort((a, b) => ( parseInt(a._id) > parseInt(b._id)) ? -1 : 1);
        setLoading(false)
    }

    const fn_setMessages = async(inputMessage) => {
        //console.log('fn_setMessages',inputMessage);
        let msgArray = messageHistory.current == null ? [] : messageHistory.current;
        if ( !CommonUtils.isEmpty(inputMessage.data)) {
            const msgData = JSON.parse(inputMessage.data);            
            if ( msgData.type === 'beforList') {
                //console.log('msgData.users',msgData.users);
                if ( !CommonUtils.isEmpty(msgData.users) ) setRoomMembers(msgData.users); 
                //return msgArray;
                messageHistory.current = msgArray;
            }else if ( msgData.type === 'beforMsgList') {
                //console.log('beforMsgList',msgData.msgs.length);                
                convertMessages(msgData.msgs);
                //console.log('convertData',convertData);
                //return msgArray;//.concat(convertData);;
            }else{
                if ( msgData.type !== 'send' && msgData.fromUserID == userId ) {
                    return msgArray;
                }else{
                    let recMsg = msgData.param;
                    if ( msgData.type === 'welcome') {
                        recMsg = msgData.fromUserName + '님이 들어오셨습니다.';
                    }else if ( msgData.type === 'bye') {
                        recMsg = msgData.fromUserName + '님이 나가셨습니다.';
                    }
                    const convertMsg = 
                    {
                        _id: Math.round((new Date()).getTime() / 1000),
                        text: recMsg,
                        createdAt: Math.round((new Date()).getTime()),
                        system : msgData.type === 'send' ? false : true,
                        user: {
                            _id: msgData.fromUserID,
                            name: msgData.fromUserName,
                            avatar: Platform.OS === 'ios' ? 'https://placeimg.com/140/140/2' : 'https://placeimg.com/140/140/5'
                        },
                    }
                    //console.log('messageHistory.current',messageHistory.current);     
                    //console.log('convertMsgconvertMsg',convertMsg);     
                    const returnMsg = msgArray.concat(convertMsg);
                    setSeqnum(seqnum+1);
                    //return returnMsg.sort((a, b) => ( parseInt(a._id) > parseInt(b._id)) ? -1 : 1);
                    messageHistory.current = returnMsg.sort((a, b) => ( parseInt(a._id) > parseInt(b._id)) ? -1 : 1);
                }
            }
        }else{
            //return msgArray;
            messageHistory.current = msgArray;
        }
    };
    
    //messageHistory.current = React.useMemo(()=>fn_setMessages(lastMessage), [lastMessage]); // FAST
    React.useEffect(() => {
        fn_setMessages(lastMessage)        
    }, [lastMessage]);


    const sendM = () => {
        sendMessage(message);
        //console.log('sendMsendMsendMsendM',message)
        setTimeout(() => {
            setMessage(null);
        }, 500);  
    }
    
    const handleClickSendMessage = React.useCallback(
        sendM, [sendM]
    );
    
    const onDelete = (tmessage) => {
        console.log('onDelete',tmessage)
        sendJsonMessage({mode:'remove',message:tmessage.text,...tmessage})
    }
    const onLongPress = (context,message) => {
        console.log('onLongPress',context)
        const options = ['메시지 삭제', '취소'];
        const cancelButtonIndex = options.length - 1;
        context.actionSheet().showActionSheetWithOptions({
            options,
            cancelButtonIndex
        }, (buttonIndex) => {
            switch (buttonIndex) {
                case 0:
                    onDelete(message)
                    break;
                case 1 :
                    break;
            }
        });
    }
    const handleSend = async(tmpmessages) => {
        ///console.log('handleSend',tmpmessages)
        await setMessage(tmpmessages[0].text);
        sendMessage(tmpmessages[0].text)
    }
    
    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{right: {backgroundColor: mConst.baseColor}}}
                textStyle={{right: {color: '#fff'}}}
            />
        );
    }

    const renderLoading = () => {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color={mConst.baseColor} />
            </View>
        )
    }
    const renderSend = (props) =>{
        return (
            <Send {...props}>
                <View style={styles.sendingContainer}>
                    <Text style={{fontSize:CommonUtils.scale(15), color:'#fff'}}>전송</Text>
                </View>
            </Send>
        );
    }

    const scrollToBottomComponent = () =>{
        return (
            <View style={styles.bottomComponentContainer}>
                <Button
                    type={'clear'}
                    onPress={() => giftedChatRef.current.scrollToBottom()}
                    icon={<Icon name="arrow-downward" size={25} color={mConst.baseColor} />}
                    title={""}
                />
            </View>
        )
    }

    const renderInputToolbar = (props) => {
        return <InputToolbar {...props} containerStyle={styles.inputToolbarStyle} />;
    }

    const renderSystemMessage = (props) => {
        return (
            <SystemMessage
                {...props}
                wrapperStyle={styles.systemMessageWrapper}
                textStyle={styles.systemMessageText}
            />
        );
    }

    
    if ( isLoading ) {
        return (        
            <View style={styles.container}>
                <MoreLoading isLoading={isLoading} />
            </View>
        )
    }else{
        return (
            <View style={{flex:1}}>
                <TouchableOpacity 
                    onPress={()=>setListShow(!isListShow)}                    
                    style={styles.fixedWrap}
                >
                    <Icon name="people-outline" size={CommonUtils.scale(17)} color="#ccc" />
                </TouchableOpacity>
                <Header
                    backgroundColor="#fff"
                    statusBarProps={{translucent: true, backgroundColor: 'transparent', barStyle: 'dark-content', animated: true}}
                    leftComponent={(
                        <TouchableOpacity 
                            hitSlop={{left:10,right:10,bottom:10,top:10}}
                            onPress={() => props.navigation.goBack()}
                            style={{flex:1,paddingLeft:10,justifyContent:'center',zIndex:1000}}
                        >
                            <Icon
                                name="arrow-back-ios"
                                size={mConst.navIcon}
                                color="#000"
                                
                            />
                        </TouchableOpacity>
                    )}
                    centerComponent={{ text: 'ChatScreen', style: { fontSize: mConst.navTitle,color: '#000' } }}                    
                    rightComponent={(
                        <View style={{flex:1,paddingRight:10,justifyContent:'center'}}>
                            <Text style={{color:'#ff0000'}}>{connectionStatus}</Text>
                        </View>
                    )}
                    containerStyle={{borderBottomWidth: 0}}
                /> 
                <View style={{flex:1}}>
                    <GiftedChat
                        ref={giftedChatRef}
                        listViewProps={{
                            style: {backgroundColor: '#fff',},
                        }}
                        messages={messageHistory.current}
                        user={{
                            _id: userId,
                        }}
                        placeholder='텍스트를 입력해주세요'
                        placeholderStyle={{paddingTop:15}}
                        alwaysShowSend
                        showUserAvatar={false}
                        scrollToBottom
                        onLongPress={onLongPress}
                        onSend={(text)=>handleSend(text)}
                        renderUsernameOnMessage={true}
                        renderBubble={renderBubble}
                        renderLoading={renderLoading}
                        renderSend={renderSend}
                        scrollToBottomComponent={()=>scrollToBottomComponent()}
                        renderInputToolbar={renderInputToolbar}
                        renderSystemMessage={renderSystemMessage}
                        //renderActions={()=>renderAccessory()}
                        locale={'dayjs/locale/kr'}
                        dateFormat={'YYYY.M.D'}
                    />
                </View>
                <View style={[styles.leftFixedWrap,{width: isListShow ? SCREEN_WIDTH*0.6 : 0}]}>
                    <View style={styles.userListWrap}>
                        {                            
                            roomMembers.map((item, index) => {
                                return (
                                    <Text style={styles.baseText} key={index}>
                                        {
                                        JSON.parse(item).user_id == userId 
                                        ?
                                        "(ME)"+JSON.parse(item).user_name 
                                        :
                                        JSON.parse(item).user_name 
                                        }
                                    </Text>
                                )
                            })
                        }
                        {/* <FlatList
                            keyExtractor={(item, i) => {
                                return item.toString() + i.toString();
                            }}
                            data={roomMembers}
                            renderItem={({ item }) =>
                                item && (
                                    <Text style={styles.baseText}>
                                        {
                                        JSON.parse(item).user_id == userId 
                                        ?
                                        "(ME)"+JSON.parse(item).user_name 
                                        :
                                        JSON.parse(item).user_name 
                                        }
                                    </Text>
                                )
                            }
                        /> */}
                    </View>
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
    fixedWrap : {
        position:'absolute',right:15,top:100,width:30,height:30,backgroundColor:'#fff',zIndex:100,
        justifyContent: 'center',alignItems: 'center',borderWidth:1,borderColor:'#ccc',borderRadius:5
    },
    baseText : {
        color: '#fff',
        fontSize : CommonUtils.scale(20),
        lineHeight : CommonUtils.scale(20)*1.5,
        letterSpacing:-1
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sendingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height:30,width:60,marginRight:15,
        marginBottom:Platform.OS === 'ios' ? 5 :10,
        borderRadius:10,
        backgroundColor:mConst.baseColor
    },
    bottomComponentContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputToolbarStyle : {
        paddingLeft:10,
    }, 
    systemMessageWrapper: {
        backgroundColor: '#6646ee',
        borderRadius: 4,
        padding: 5
    },
    systemMessageText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: 'bold'
    },
    accessoryContainer: {
        position:'absolute',left:-30,top:10,
        justifyContent: 'center',
        alignItems: 'center',
        height:30,width:30
    },
    leftFixedWrap : {
        position:'absolute',
        left:0,
        top:0,
        height: SCREEN_HEIGHT,
        width :SCREEN_WIDTH*0.6,             
        backgroundColor:'#000',
        opacity:0.8,
        justifyContent:'center',
        zIndex:10
    },
    userListWrap : {
        flex:1,
        paddingVertical:50,  
        paddingHorizontal:20,
        width:'100%',
        height:'100%'
    }
});


export default ChatScreen;
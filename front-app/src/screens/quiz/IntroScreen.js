import React,{useState,useEffect,useRef,useCallback,useContext} from 'react';
import {TouchableOpacity,ImageBackground,StyleSheet,View,Image,Text,TextInput,Dimensions,ActivityIndicator,ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();
import { useFocusEffect,useIsFocused } from '@react-navigation/native';
import { Header } from 'react-native-elements';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';

import CommonUtils from '../../utils/CommonUtils';
import mConst from '../../utils/Constants';

const LANGUAGES = ["ko", "en", "ru", "th", "tu", "pt", "zh", "ja"];
const imagePath = {
    ko: require("../../../assets/quiz/ko.png"),
    en: require("../../../assets/quiz/en.png"),
    ru: require("../../../assets/quiz/ru.png"),
    th: require("../../../assets/quiz/th.png"),
    tu: require("../../../assets/quiz/tu.png"),
    pt: require("../../../assets/quiz/pt.png"),
    zh: require("../../../assets/quiz/zh.png"),
    ja: require("../../../assets/quiz/ja.png")
  };

const backgroundImg = require('../../../assets/images/quiz_bg.png');

const pc_unselect = require('../../../assets/quiz/pc.png');
const pc_select = require('../../../assets/quiz/pc_selected.png')
const mobile_unselect = require('../../../assets/quiz/mobile.png');
const mobile_select = require('../../../assets/quiz/mobile_selected.png')

const QuizIntroScreen = (props) => {
    const isFocused = useIsFocused();
    const [isLoading, setLoading] = useState(true);
    const [seleted, setSeleted] = useState({
        lang : 'ko',
        platform : null,
        nickname : null
    });
    
    const [socketStatus, setSocketStatus] = useState('대기');

    useEffect(() => {        
        setTimeout(() => {        
            setLoading(false) 
        }, 1000); 
    }, [isFocused]);

    // WS로 보상확인 메세지를 받으면 QUIZ 페이지로 넘어가면서 state값을 넘겨줌
    useEffect(() => {
        // db에 유저 정보 저장하면서 ws 재오픈 및 /quiz로 경로 이동
        const socket = new WebSocket(`${mConst.SERVER_WS}/quizes`);
        socket.onopen = () => {
            console.log("userInfo: 웹소켓 연결 OK");
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log("userInfo: data", data);
                const status = data.status;
                if (status === "퀴즈대기") {                    
                    props.navigation.navigate('QuizScreen')
                }
                
            };
        };
        return () => {
            socket.close();
        }
    }, []);

    useEffect(() => {
        console.log('socketStatus',socketStatus)
        if ( socketStatus == "퀴즈대기" && seleted.lang && seleted.platform ) {
            props.navigation.navigate('QuizScreen')
        }
    }, [socketStatus]);

    const moveNext = () => {
        if ( socketStatus == "입장허용" && seleted.lang && seleted.platform && seleted.nickname ) {
            saveData(seleted);
            //props.navigation.navigate('QuizScreen')
        }else{
            CommonUtils.fn_call_toast('필수항목입력',2000);
            return false;
        }
    }

    const saveData = async(data) => {
        let requestBody = {
            nickname :  data.nickname,
            language : data.lang,
            platform : data.platform,
        };
        try {
            fetch(`${mConst.SERVER_API}/users`, {
                method: "POST",
                body: JSON.stringify(requestBody),
            })
            .then((res) => res.json())
            .then((res) => {
                console.log('saveData',res);                
                AsyncStorage.setItem('Authorization', res["token"].toString());
                setTimeout(() => {
                    props.navigation.navigate('QuizScreen')
                }, 500);
            });      
        } catch (error) {
            console.log('error',error)
        }
    }

    return (

        isLoading 
        ? 
        <View style={styles.centerStyle}>
            <ActivityIndicator/> 
        </View>
        : 
        (
            <View style={styles.container}>      
                <Header
                    backgroundColor="#fff"
                    statusBarProps={{translucent: true, backgroundColor: 'transparent', barStyle: 'light-content', animated: true}}
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
                    centerComponent={{ text: 'Quiz Intro', style: { fontSize: mConst.navTitle,color: '#000' } }}
                    rightComponent={null}
                    containerStyle={{borderBottomWidth: 0}}
                />
                <ImageBackground
                    source={backgroundImg}    
                    style={styles.styleBackground}
                    resizeMode={'cover'}
                >
                    <View style={styles.logoWrap}>
                        <Image
                            source={require("../../../assets/quiz/title.png")}
                            resizeMode="contain"
                            style={{height:60,marginBottom:15}}
                        />
                        <Image
                            source={require("../../../assets/quiz/newlogo.png")}
                            resizeMode="contain"
                            style={{height:40}}
                        />
                    </View>
                    <View style={styles.languageOuterWrap}>
                        <View style={styles.languageTextWrap}>
                            <Text style={styles.baseText}>Language</Text>
                        </View>
                        <View style={styles.languageDataWrap}>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        >
                            {
                                LANGUAGES.map((item, index) => {
                                    return (
                                    <TouchableOpacity
                                        key={index}
                                        style={seleted.lang == item? styles.langSelWrap : styles.langWrap}
                                        onPress={()=>setSeleted({...seleted,lang:item})}
                                    >
                                        {/* <Text style={styles.baseText}>{item.toString()}</Text> */}
                                        <Image
                                            source={imagePath[item]}
                                            resizeMode="contain"
                                            style={{height:40}}
                                        />
                                    </TouchableOpacity>
                                    )
                                })
                            }
                        </ScrollView>
                        </View>
                    </View>
                    <View style={styles.languageOuterWrap}>
                        <View style={styles.languageTextWrap}>
                            <Text style={styles.baseText}>당신이 즐기고 있는 플랫폼은?</Text>
                        </View>
                        <View style={styles.platformWrap}>
                            <TouchableOpacity 
                                style={styles.platformButtonWrap}
                                onPress={()=>setSeleted({...seleted,platform:'pc'})}
                            >
                                <Text style={seleted.platform == 'pc' ? styles.selectedText : styles.unSelectedText}>PC{"&"}Console</Text>
                                <Image
                                    source={seleted.platform == 'pc' ? pc_select : pc_unselect}
                                    resizeMode="contain"
                                    style={{height:50}}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.platformButtonWrap}
                                onPress={()=>setSeleted({...seleted,platform:'mobile'})}
                            >
                                <Text style={seleted.platform == 'mobile' ? styles.selectedText : styles.unSelectedText}>Mobile</Text>
                                <Image
                                    source={seleted.platform == 'mobile' ? mobile_select : mobile_unselect}
                                    resizeMode="contain"
                                    style={{height:50}}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.languageOuterWrap}>
                        <TextInput 
                            value={seleted.nickname}
                            placeholder={"enter a nickname"}
                            placeholderTextColor={"#555"}
                            onChangeText={text => setSeleted({...seleted,nickname:text.trim()})}
                            style={styles.inputStyle}
                        />
                    </View>
                    {
                        socketStatus == "입장허용" 
                        ?
                            <TouchableOpacity 
                                style={styles.inputClickableWrap}
                                onPress={()=>moveNext()}
                            >
                                <Text style={[styles.selectedText,{fontSize: CommonUtils.scale(20),color:'#fff'}]}>입장하기</Text>
                            </TouchableOpacity>
                        :
                            <TouchableOpacity 
                                style={styles.inputWrap}
                                onPress={()=>setSocketStatus('입장허용')}
                            >
                                <Text style={[styles.unSelectedText,{fontSize: CommonUtils.scale(20)}]}>입장하기</Text>
                            </TouchableOpacity>
                    }

                </ImageBackground>
            </View>
        )
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'#fff'
    },
    centerStyle : {
        flex:1,
        justifyContent :'center',
        alignItems:'center'
    },
    styleBackground : {
        position:'absolute',
        left:0,
        right:0,
        top:100,
        bottom:0,
        width:SCREEN_WIDTH,
        height:SCREEN_HEIGHT-100
    },
    logoWrap : {
        flex:1,
        justifyContent:'center',
        alignItems:'center',        
    },
    languageOuterWrap : {
        flex:1,
        paddingHorizontal:20,        
        justifyContent:'center',
        alignItems:'center',        
    },
    languageTextWrap : {        
        justifyContent:'center',
        alignItems:'center',
        paddingBottom:20        
    },
    languageDataWrap : {        
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',        
    },
    langWrap : {
        flex:1, 
        width : SCREEN_WIDTH/5,
        height : SCREEN_WIDTH/5,
        marginRight:10,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        backgroundColor:'#ccc'
    },
    langSelWrap : {
        flex:1, 
        width : SCREEN_WIDTH/5,
        height : SCREEN_WIDTH/5,
        marginRight:10,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        backgroundColor:mConst.baseColor
    },
    baseText : {        
        fontSize: CommonUtils.scale(20),
        letterSpacing:-1
    },
    selectedText : {        
        fontSize: CommonUtils.scale(15),
        color:mConst.baseColor,
        fontWeight:'bold'
    },
    unSelectedText : {        
        fontSize: CommonUtils.scale(15),
        color:'#ffffff',
        fontWeight:'bold'
    },
    selectFormWrap : {
        flex:1,
        paddingHorizontal:20, 
    },
    platformWrap : {
        flexDirection:'row',
        justifyContent:'space-evenly',
        alignItems:'center'
    },
    platformButtonWrap : {
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    inputWrap : {
        flex : 0.5,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#ccc'
    },
    inputClickableWrap : {
        flex : 0.5,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:mConst.baseColor
    },
    inputStyle : {
        borderWidth:1,
        borderColor:'#ccc',
        padding:10,
        color:'#555',
        width:'100%',
        backgroundColor:'#fff'
    }
  });

  export default QuizIntroScreen;
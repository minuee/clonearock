import React,{useState,useEffect,useRef,useCallback,useContext} from 'react';
import {TouchableOpacity,ImageBackground,StyleSheet,View,Image,Text,Dimensions,ActivityIndicator,ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();
import { useFocusEffect,useIsFocused } from '@react-navigation/native';
import { Header } from 'react-native-elements';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';
import CommonUtils from '../../utils/CommonUtils';
import mConst from '../../utils/Constants';

const backgroundImg = require('../../../assets/images/quiz_bg.png');

const QuizScreen = (props) => {
    const isFocused = useIsFocused();
    const [isLoading, setLoading] = useState(true);
    const [myAuthorization, setMyAuthorization] = useState(null);
    const [quizNumber, setQuizNumber] = useState(1);
    const [quizReward, setQuizReward] = useState(null);
    const [quizContent, setQuizContent] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isCorrectAnswer, setIsCorrectAnswer] = useState(null);
    
    const [socketStatus, setSocketStatus] = useState('대기');

    useEffect(() => {        
        setTimeout(() => {        
            setLoading(false) 
        }, 1000); 
    }, [isFocused]);

    useEffect(() => {
        async function fetchData () {        
            const Authorization = await AsyncStorage.getItem('Authorization');        
            setMyAuthorization(Authorization);
        }
        fetchData();
    }, []);

    // WS로 보상확인 메세지를 받으면 QUIZ 페이지로 넘어가면서 state값을 넘겨줌
    useEffect(() => {
        // db에 유저 정보 저장하면서 ws 재오픈 및 /quiz로 경로 이동
        const socket = new WebSocket(`${mConst.SERVER_WS}/quizes`);
        socket.onopen = () => {
            console.log("userInfo: 웹소켓 연결 OK");
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log("userInfo: data", data);
                //const status = data.status;
                if ( !CommonUtils.isEmpty(data.status)) setSocketStatus(data.status);
                //if ( !CommonUtils.isEmpty(data.reward_rate)) setQuizReward(data.reward_rate);
                //if ( !CommonUtils.isEmpty(data.quiz)) setQuizContent(data.quiz);
                if ( !CommonUtils.isEmpty(data.quiz_num)) setQuizNumber(data.quiz_num);
                if ( data.status === 'next') {
                    setSocketStatus('대기');
                    setQuizReward(null);
                    setQuizContent(null);
                    setIsSuccess(false);
                    setIsCorrectAnswer(null)
                }
            };
        };
        return () => {
            socket.close();
        }
    }, []);

    useEffect(() => {
        console.log("socketStatus", socketStatus);
        if (socketStatus === "보상확인") {            
            fetch(`${mConst.SERVER_API}/reward/${quizNumber}`, {
                headers: {
                    Authorization: myAuthorization,
                },
            }).then((res) => res.json())
            .then((res) => {
                console.log("보상확인", res);
                setQuizReward(res)

                //setData(res);
                /* 보상확인 {"PC_reward": "피씨 보상 이름", "PC_reward_url": "https://images.velog.io/images/deonii/post/63297169-a499-4d8c-884f-24f2a2310c3c/003.png", "mobile_reward": "모바일 보상 이름", "mobile_reward_url": "https://images.velog.io/images/deonii/post/1801ff26-9524-4957-8097-f5ce66f249f7/001.png", "quiz_num": "1", "reward_rate": "0.10", "status": "보상응답확인"} */
            });
        } else if (socketStatus === "퀴즈시작") {            
            fetch(`${mConst.SERVER_API}/quiz/${quizNumber}`, {
                headers: {
                    Authorization: myAuthorization,
                },
            }).then((res) => res.json())
            .then((res) => {
                console.log("퀴즈시작", res);
                setQuizContent(res)
                //setData(res);
                /* {"ans": {"1": "ko) 보기 1번 내용", "2": "ko) 보기 2번 내용"}, "is_answer": {"1": false, "2": true}, "quiz": "ko) 1번문제는 무엇일까요?", "quiz_num": "1", "status": "퀴즈시작응답"} */
            });

        } else if (socketStatus === "정답확인") {            
            fetch(`${mConst.SERVER_API}/quiz`, {
                method: "POST",
                headers: {
                    Authorization: myAuthorization,
                },
                body: JSON.stringify({
                        quiz_num: quizNumber,
                        answer: isCorrectAnswer,
                    }),
            })
            .then((res) => res.json())
            .then((res) => {
                if (res.result === "success") {
                  // 정답확인중 component를 보여주다가 success를 받으면 정답/오답화면을 보여줌                  
                  console.log("정답확인", res);
                  setIsSuccess(true);
                  /* 정답확인 {"result": "success"} */
                }
            });
        } else if (socketStatus === "결과확인") {            
            fetch(`${mConst.SERVER_API}/result`, {
                headers: {
                    Authorization: myAuthorization,
                },
            }).then((res) => res.json())
            .then((res) => setData(res));
        } else if (socketStatus === "next") {
            //다음문제
        }
    }, [socketStatus]);



    const renderStatus = ( wstatus ) => {
        if ( wstatus == "보상확인" ) {
            return (
                <Text style={styles.statusText}>두근두근 보상상품입니다.</Text>
            )
        }else if ( wstatus == "퀴즈시작" ) {
            return (
                <Text style={styles.statusText}>제한시간 5분~ 퀴즈시작</Text>
            )
        }else if ( wstatus == "정답확인" ) {
            return (
                <Text style={styles.statusText}>기대하시라! 정답확인</Text>
            )
        }else if (  wstatus == "결과확인" ) {
            return (
                <Text style={styles.statusText}>두근두근! 결과확인</Text>
            )
        }else if (  wstatus == "next" || wstatus == "대기" ) {
            return (
                <Text style={styles.statusText}>다음퀴즈 준비중입니다...</Text>
            )
        }else{
            return (
                <Text style={styles.statusText}>잘못된 접근입니다.</Text>
            )
        }
    };

    const renderQuiz = () => {
        if ( quizReward && socketStatus == "보상확인") {
            return (
                <View style={styles.contentWrap}>
                    <Text style={styles.statusText}>{quizReward.PC_reward}</Text>
                    <Image 
                        source={{uri:quizReward.PC_reward_url}} 
                        style={{width:SCREEN_WIDTH*0.4,height:SCREEN_WIDTH*0.4,paddingTop:20}}
                    />
                </View>
            )
        }else if ( quizContent && socketStatus == "퀴즈시작") {
            return (
                <View style={styles.contentWrap}>
                    <View style={styles.contentTitleWrap}>
                        <Text style={styles.statusText}>{quizContent.quiz}</Text>
                    </View>
                    <View style={styles.contentDataWrap}>
                        {
                            quizContent.ans && (
                                Object.entries(quizContent.ans).map(([key, value], idx) => {
                                return (
                                <TouchableOpacity
                                    key={idx}
                                    style={isCorrectAnswer == idx+1 ? styles.langSelWrap : styles.langWrap}
                                    onPress={()=>setIsCorrectAnswer(idx+1)}
                                >
                                    <Text style={styles.baseText}>{key} : {value}</Text>
                                </TouchableOpacity>
                                )
                            })
                            )
                        }
                    </View>
                </View>
            )
        }else if ( quizContent && socketStatus == "정답확인") {
            return (
                <View style={styles.contentWrap}>
                    <View style={styles.contentTitleWrap}>
                        <Text style={styles.statusText}>
                            {isSuccess ? '정답입니다!' : '잔넹 틀렸습니다.'}
                        </Text>
                    </View>
                </View>
            )
        }else{
            return null;
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
                    centerComponent={{ text: 'Quiz풀기', style: { fontSize: mConst.navTitle,color: '#000' } }}
                    rightComponent={null}
                    containerStyle={{borderBottomWidth: 0}}
                />
                <ImageBackground
                    source={backgroundImg}    
                    style={styles.styleBackground}
                    resizeMode={'cover'}
                >
                    <View style={styles.quizNumberWrap}>
                        <Text style={styles.statusText}>
                            Quiz{" "}
                            <Text style={styles.numberText}>{quizNumber}</Text>
                        </Text>
                    </View>
                    <View style={styles.commonWrap}>
                        {renderStatus(socketStatus)}
                    </View>
                    <View style={styles.commonWrap}>
                        {renderQuiz()}
                    </View>
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
    quizNumberWrap : {
        height:50,
        justifyContent:'center',        
        paddingHorizontal:20
    },
    commonWrap : {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:20
    },
    statusText : {
        fontSize: CommonUtils.scale(20),
        letterSpacing:-1,
        fontWeight:'bold'
    },
    dataText : {
        fontSize: CommonUtils.scale(18),
        letterSpacing:-1,
        fontWeight:'bold',
        color:mConst.baseColor
    },
    baseText : {
        color: '#222',
        fontSize : CommonUtils.scale(16),
        lineHeight : CommonUtils.scale(16)*1.2,
        letterSpacing:-1
    },
    numberText : {
        color: '#222',
        fontSize : CommonUtils.scale(30)
    },
    langSelWrap : {
        padding:10,
        backgroundColor:'#ccc'
    },
    langWrap : {
        padding:10,
    },
    contentWrap : {
        flex:1,padding:15,alignItems:'center'
    },
    contentTitleWrap : {
        flex:1,
    },
    contentDataWrap : {
        flex:5
    }
    
  });

  export default QuizScreen;
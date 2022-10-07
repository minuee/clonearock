import React,{useState,useEffect,useRef,useCallback,useContext} from 'react';
import {Animated,TouchableOpacity,Linking,Easing,StyleSheet,View,Image,Text,Dimensions,ActivityIndicator,ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();
import { useFocusEffect,useIsFocused } from '@react-navigation/native';
import { Header } from 'react-native-elements';
import CommonUtils from '../utils/CommonUtils';
import mConst from '../utils/Constants';
//import FocusScrollView from '../utils/FocusScrollView';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const urls = [
    "https://github.com/c-bata/react-native-focus-scroll/blob/master/example/assets/paulaner.jpg?raw=true",
    "https://github.com/c-bata/react-native-focus-scroll/blob/master/example/assets/kilkenny.jpg?raw=true",
    "https://github.com/c-bata/react-native-focus-scroll/blob/master/example/assets/guiness.jpg?raw=true",
    "https://github.com/c-bata/react-native-focus-scroll/blob/master/example/assets/rokko-yamatanoorochi-ipa.jpg?raw=true",
    "https://github.com/c-bata/react-native-focus-scroll/blob/master/example/assets/paulaner.jpg?raw=true",
    "https://github.com/c-bata/react-native-focus-scroll/blob/master/example/assets/paulaner.jpg?raw=true",
];

const SAMPLE_IMAGE01 = require('../../assets/images/graphic_1.png');
const SAMPLE_IMAGE02 = require('../../assets/images/graphic_2.png');
const SAMPLE_IMAGE03 = require('../../assets/images/graphic_3.png');
const SAMPLE_IMAGE04 = require('../../assets/images/coin_graphic.png');

const IntruduceScreen = (props) => {
    const isFocused = useIsFocused();
    const [isLoading, setLoading] = useState(true);
    const refScrollView = useRef(null);
    const [isShowButton, setShowButton] = useState(false);
    const [sreenViewHeight, setScreenViewHeight] = useState(0);
    const [scrollViewHeight, setScrollViewHeight] = useState(0);
    const [scrollViewY, setScrollViewY] = useState(0);
   

    const fadeAnim01 = useRef(new Animated.Value(0)).current;
    const fallAnimation01 =  useRef(new Animated.Value(0)).current;
    const [isOpenTarget01, setOpenTarget01] = useState(false);

    const fadeAnim02 = useRef(new Animated.Value(0)).current;
    const fallAnimation02 =  useRef(new Animated.Value(0)).current;
    const [isOpenTarget02, setOpenTarget02] = useState(false);

    const fadeAnim03 = useRef(new Animated.Value(0)).current;
    const fallAnimation03 =  useRef(new Animated.Value(0)).current;
    const [isOpenTarget03, setOpenTarget03] = useState(false);

    const fadeAnim04 = useRef(new Animated.Value(0)).current;
    const fallAnimation04 =  useRef(new Animated.Value(0)).current;
    const [isOpenTarget04, setOpenTarget04] = useState(false);

    const fadeAnim05 = useRef(new Animated.Value(0)).current;
    const moveAnimation05 =  useRef(new Animated.Value(0)).current;
    const [isOpenTarget05, setOpenTarget05] = useState(false);

    const fadeAnim06 = useRef(new Animated.Value(0)).current;
    const moveAnimation06 =  useRef(new Animated.Value(0)).current;
    const [isOpenTarget06, setOpenTarget06] = useState(false);

    useEffect(() => {
        setLoading(false)
    }, []);  

    useEffect(() => {        
        if ( !isFocused ) { // blur
            props.navigation.toggleDrawer();
        }        
    }, [isFocused]);
    
    const getScrollViewSize = (event) => {        
        const {x, y, width, height} = event.nativeEvent.layout;
        setScreenViewHeight(height);
        setScrollViewY(y);
    }

    const getContentHeight = (w,h) => {
        setScrollViewHeight(parseInt(h))
    }

    const handleScroll = (event) => {
        //console.log('handleScroll',event.nativeEvent.contentOffset.y);
        const {y} = event.nativeEvent.contentOffset;
        const seq = parseInt(y/300);
        //console.log('parseInt(y/200',seq);
        //setOffsetY(y);
        //if ( seq > 0 ) setScroolFocusNum(seq+1)

        let paddingToBottom = 1;
        paddingToBottom += event.nativeEvent.layoutMeasurement.height;
        //console.log(Math.floor(paddingToBottom) + "-" + Math.floor(event.nativeEvent.contentOffset.y) + "-" + Math.floor(event.nativeEvent.contentSize.height));
        if (event.nativeEvent.contentOffset.y + paddingToBottom >= event.nativeEvent.contentSize.height) {
            //console.log('scrollEndscrollEndscrollEnd');
            setShowButton(true);
        }else{
            if ( y < 1200 ) setShowButton(false);
        }

        if ( y > 300 && !isOpenTarget01) {            
            setMoveTarget1();
        }else if ( y < 450 && isOpenTarget01) {
            setMoveTarget1();
        }
        if ( y > 350 && !isOpenTarget02) {
            setMoveTarget2()
        }else if ( y < 500 && isOpenTarget02) {
            setMoveTarget2();
        }
        if ( y > 600 && !isOpenTarget03) {
            setMoveTarget3();
        }else if ( y < 750 && isOpenTarget03) {
            setMoveTarget3();
        }

        if ( y > 650 && !isOpenTarget04) {
            setMoveTarget4();
        }else if ( y < 800 && isOpenTarget04) {
            setMoveTarget4();
        }

        if ( y > 900 && !isOpenTarget05) {
            setMoveTarget5();
        }else if ( y < 1050 && isOpenTarget05) {
            setMoveTarget5();
        }

        if ( y > 1050 && !isOpenTarget06) {
            setMoveTarget6()
        }else if ( y < 1200 && isOpenTarget06) {
            setMoveTarget6()
        }
    }

    const setMoveTarget1 = () => {
        //console.log('setMoveTarget1',isOpenTarget01);
        const fadeInOut =  Animated.timing(fadeAnim01, {
            toValue: isOpenTarget01 ? 0 : 1,
            duration: 500,
            useNativeDriver:false
          }).start();
      
        const fallAnimation = Animated.timing(
            fallAnimation01,
          {
            toValue: isOpenTarget01 ? 0 : 100,
            duration: 700,
            easing: Easing.bounce,
            useNativeDriver: false,
          }
        );
      
        Animated.parallel([
            fadeInOut,
            fallAnimation
        ]).start(()=>{
            setOpenTarget01(!isOpenTarget01)
        });    
    }

    const setMoveTarget2 = () => {
        //console.log('setMoveTarget2',isOpenTarget02);
        const fadeInOut =  Animated.timing(fadeAnim02, {
            toValue: isOpenTarget02 ? 0 : 1,
            duration: 500,
            useNativeDriver:false
          }).start();
      
        const fallAnimation = Animated.timing(
            fallAnimation02,
          {
            toValue: isOpenTarget02 ? 0 : 100,
            duration: 700,
            easing: Easing.bounce,
            useNativeDriver: false,
          }
        );
      
        Animated.parallel([
            fadeInOut,
            fallAnimation
        ]).start(()=>{
            setOpenTarget02(!isOpenTarget02)
        });    
    }

    const setMoveTarget3 = () => {
        //console.log('setMoveTarget3',isOpenTarget03);
        const fadeInOut =  Animated.timing(fadeAnim03, {
            toValue: isOpenTarget03 ? 0 : 1,
            duration: 500,
            useNativeDriver:false
          }).start();
      
        const fallAnimation = Animated.timing(
            fallAnimation03,
          {
            toValue: isOpenTarget03 ? 0 : 100,
            duration: 700,
            easing: Easing.bounce,
            useNativeDriver: false,
          }
        );
      
        Animated.parallel([
            fadeInOut,
            fallAnimation
        ]).start(()=>{
            setOpenTarget03(!isOpenTarget03)
        });    
    }

    const setMoveTarget4 = () => {
        //console.log('setMoveTarget4',isOpenTarget04);
        const fadeInOut =  Animated.timing(fadeAnim04, {
            toValue: isOpenTarget04 ? 0 : 1,
            duration: 500,
            useNativeDriver:false
          }).start();
      
        const fallAnimation = Animated.timing(
            fallAnimation04,
          {
            toValue: isOpenTarget04 ? 0 : 100,
            duration: 700,
            easing: Easing.bounce,
            useNativeDriver: false,
          }
        );
      
        Animated.parallel([
            fadeInOut,
            fallAnimation
        ]).start(()=>{
            setOpenTarget04(!isOpenTarget04)
        });    
    }

    const setMoveTarget5 = () => {
        //console.log('setMoveTarget5',isOpenTarget05);
        const fadeInOut =  Animated.timing(fadeAnim05, {
            toValue: isOpenTarget05 ? 0 : 1,
            duration: 500,
            useNativeDriver:false
          }).start();
      
        const moveAnimation = Animated.timing(
            moveAnimation05,
          {
            toValue: isOpenTarget05 ? 0 : SCREEN_WIDTH-150,
            duration: 700,
            easing: Easing.bounce,
            useNativeDriver: false,
          }
        );
      
        Animated.parallel([
            fadeInOut,
            moveAnimation
        ]).start(()=>{
            setOpenTarget05(!isOpenTarget05)
        });    
    }

    const setMoveTarget6 = () => {
        //console.log('setMoveTarget6',isOpenTarget06);
        const fadeInOut =  Animated.timing(fadeAnim06, {
            toValue: isOpenTarget06 ? 0 : 1,
            duration: 500,
            useNativeDriver:false
        }).start();
      
        const moveAnimation = Animated.timing(
            moveAnimation06,
            {
                toValue: isOpenTarget06 ? 0 : (SCREEN_WIDTH-150)*-1,
                duration: 700,
                easing: Easing.bounce,
                useNativeDriver: false,
            }
        );
      
        Animated.parallel([
            fadeInOut,
            moveAnimation
        ]).start(()=>{
            setOpenTarget06(!isOpenTarget06)
        });    
    }

    openBrowser = async () =>  {
        await Linking.openURL('https://www.prmagnet.kr')
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
                    centerComponent={{ text: '서비스 안내', style: { fontSize: mConst.navTitle,color: '#000' } }}
                    rightComponent={null}
                    containerStyle={{borderBottomWidth: 0}}
                />         
                <ScrollView 
                    ref={refScrollView}
                    scrollEventThrottle={100}
                    onLayout={(e)=>getScrollViewSize(e)}
                    onContentSizeChange={(w,h) => getContentHeight(w,h)}
                    onScroll={(e) => handleScroll(e)}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={[styles.coverWrap,{height:sreenViewHeight}]}>
                        <View style={styles.textWrap}>
                            <Text style={styles.subText}>가상자산 리워드 보관용</Text>
                            <Text style={styles.mainText}>개인 금고형 전자지갑</Text>
                        </View>
                        <View style={styles.imageWrap}>
                            <Image 
                                source={require('../../assets/images/dream.png')} 
                                resizeMode='contain' 
                                style={{width:SCREEN_WIDTH*0.6}} 
                            />
                        </View>
                        <View style={styles.arrowWrap}>
                            <Icon
                                name="arrow-downward"
                                size={CommonUtils.scale(20)}
                                color="#000"
                                onPress={() => props.navigation.goBack()}
                            />
                        </View>                        
                    </View>
                    <View style={[styles.coverWrap,{height:650}]}>
                        <View style={styles.textWrap}>
                            <Text style={styles.subText}>가상자산 리워드 보관용</Text>
                            <Text style={styles.mainText}>개인 금고형 전자지갑</Text>
                        </View>
                        <View style={styles.secondimageWrap}>
                            <Animated.View style={[
                                styles.imageFirstWrap
                                ,{
                                    opacity:fadeAnim01,
                                    transform: [
                                        { translateY: fallAnimation01 }
                                      ]
                                }
                            ]}>
                                <Animated.Image 
                                    source={SAMPLE_IMAGE01} 
                                    resizeMode='contain' 
                                    style={styles.aniImage} 
                                />
                                <Animated.Text style={styles.aniText}>니모닉 백업으로</Animated.Text>
                                <Animated.Text style={styles.aniText}>간편한 복구</Animated.Text>
                            </Animated.View>
                            <Animated.View style={[
                                styles.imageSecondWrap
                                ,{
                                    opacity:fadeAnim02,
                                    transform: [
                                        { translateY: fallAnimation02 }
                                      ]
                                }
                            ]}>
                                <Animated.Image 
                                    source={SAMPLE_IMAGE02} 
                                    resizeMode='contain' 
                                    style={styles.aniImage} 
                                />
                                <Animated.Text style={styles.aniText}>거래하고 보관하는</Animated.Text>
                                <Animated.Text style={styles.aniText}>개인 금고</Animated.Text>
                            </Animated.View>
                            <Animated.View style={[
                                styles.imageThirdWrap
                                ,{
                                    opacity:fadeAnim03,
                                    transform: [
                                        { translateY: fallAnimation03 }
                                      ]
                                }
                            ]}>
                                <Animated.Image 
                                    source={SAMPLE_IMAGE03} 
                                    resizeMode='contain' 
                                    style={styles.aniImage} 
                                />
                                <Animated.Text style={styles.aniText}>DApp 연동</Animated.Text>
                                <Animated.Text style={styles.aniText}>통합관리환경</Animated.Text>
                            </Animated.View>
                            <Animated.View style={[
                                styles.imageForthWrap
                                ,{
                                    opacity:fadeAnim04,
                                    transform: [
                                        { translateY: fallAnimation04 }
                                      ]
                                }
                            ]}>
                                <Animated.Image 
                                    source={SAMPLE_IMAGE04} 
                                    resizeMode='contain' 
                                    style={styles.aniImage} 
                                />
                                <Animated.Text style={styles.aniText}>KMS를 통한</Animated.Text>
                                <Animated.Text style={styles.aniText}>보안</Animated.Text>
                            </Animated.View>
                        </View>
                    </View>
                    <View style={[styles.coverWrap,{height:650}]}>
                        <View style={styles.textWrap}>
                            <Text style={styles.subText}>사용자 중심의 콘텐츠를 보호하는</Text>
                            <Text style={styles.mainText}>드림월렛 고유기능</Text>
                        </View>
                        <View style={styles.secondimageWrap}>
                        <Animated.View style={[
                                styles.imageFiveWrap
                                ,{
                                    opacity:fadeAnim05,
                                    transform: [
                                        { translateX: moveAnimation05 }
                                    ]
                                }
                            ]}>
                                <Animated.Image 
                                    source={SAMPLE_IMAGE01} 
                                    resizeMode='contain' 
                                    style={styles.aniImage} 
                                />
                                <Animated.View 
                                    style={{
                                        opacity:fadeAnim05,
                                        position:'absolute',
                                        right:0,
                                        bottom:-10,
                                        height:40,
                                        width:SCREEN_WIDTH-100,
                                        paddingHorizontal:10,
                                        borderRadius:10,
                                        alignItems:'flex-end',
                                        justifyContent:'center',
                                        backgroundColor:'#fff'

                                    }}
                                >
                                    <Animated.Text style={styles.aniText}>
                                        거래 비밀 키 관리 및 KMS
                                        <Animated.Text style={styles.aniTextBold}>안전한 암호키보호</Animated.Text>
                                    </Animated.Text>
                                </Animated.View>
                            </Animated.View>
                            <Animated.View style={[
                                styles.imageSixWrap
                                ,{
                                    opacity:fadeAnim06,
                                    transform: [
                                        { translateX: moveAnimation06 }
                                    ]
                                }
                            ]}>
                                <Animated.Image 
                                    source={SAMPLE_IMAGE02} 
                                    resizeMode='contain' 
                                    style={styles.aniImage} 
                                />
                                <Animated.View 
                                    style={{
                                        opacity:fadeAnim06,
                                        position:'absolute',
                                        left:0,
                                        bottom:-10,
                                        height:40,
                                        width:SCREEN_WIDTH-100,
                                        paddingHorizontal:10,
                                        borderRadius:10,
                                        alignItems:'flex-end',
                                        justifyContent:'center',
                                        backgroundColor:'#fff'

                                    }}
                                >
                                    <Animated.Text style={styles.aniText}>
                                        분실해도 걱정없는
                                        <Animated.Text style={styles.aniTextBold}>서버 내 지갑 백업 {"&"} 복구</Animated.Text>
                                    </Animated.Text>
                                </Animated.View>
                            </Animated.View>
                           
                        </View>
                    </View>
                   {/*  {
                        urls.map((url, index) => {
                            return (
                                <Image 
                                    key={index}
                                    style={[{width: SCREEN_WIDTH, height: 300},{opacity : (index+1) == scroolFocusNum ? 1 : 0.5}]} 
                                    source={{uri: url}} 
                                />
                            )
                        }
                    )} */}
                    <View style={{height:100,backgroundColor:'#ebebeb'}} />
                </ScrollView>
                {
                    isShowButton &&
                    (
                    <View style={styles.fixedBottomWrap}>
                        <TouchableOpacity 
                            style={styles.buttonWrap}
                            onPress={() => props.navigation.goBack()}
                        >
                            <Text style={styles.whiteText}>처음으로</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.buttonWrap2}
                            onPress={() => openBrowser()}
                        >
                            <Text style={styles.whiteText}>홈페이지바로가기</Text>
                        </TouchableOpacity>
                    </View>
                    )
                }
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
    textWrap : {        
        justifyContent :'center',
        alignItems:'center',
        paddingVertical:CommonUtils.scale(20),
        flex:1,
        width:'100%'
    },
    coverWrap : {
        backgroundColor:'#ebebeb',
        width:SCREEN_WIDTH,                            
        justifyContent:'center',
        alignItems:'center',
        flex:1
    },
    imageWrap : {
        justifyContent :'center',
        alignItems:'center',
        paddingVertical:CommonUtils.scale(20),
        flex:1.5,  
    },
    secondimageWrap : {
        justifyContent :'center',
        alignItems:'center',
        paddingVertical:CommonUtils.scale(20),
        flex:3,  
        width:'100%',        
    },
    imageFirstWrap : {
        position:'absolute',
        top: 0,
        left : SCREEN_WIDTH/2+10,
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:20,
        paddingHorizontal : 10,
        borderRadius :15,
        backgroundColor:'#fff'
    },
    imageSecondWrap : {
        position:'absolute',
        top: 50,
        right :SCREEN_WIDTH/2+10,  
        justifyContent:'center',
        alignItems:'center',  
        paddingVertical:20,
        paddingHorizontal : 10,
        borderRadius :15,
        backgroundColor:'#fff'
    },
    imageThirdWrap : {
        position:'absolute',
        top: 160,
        left : SCREEN_WIDTH/2+40,
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:20,
        paddingHorizontal : 10,
        borderRadius :15,
        backgroundColor:'#fff'
    },
    imageForthWrap : {
        position:'absolute',
        top: 210,
        right :SCREEN_WIDTH/2-20,
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:20,
        paddingHorizontal : 10,
        borderRadius :15,
        backgroundColor:'#fff'
    },
    imageFiveWrap : {
        position:'absolute',
        top: 0,
        left: 20,
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:20,
        paddingHorizontal : 10,
        borderRadius :15,
        backgroundColor:'#fff'
    },
    imageSixWrap : {
        position:'absolute',
        top: 150,
        right: 20,
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:20,
        paddingHorizontal : 10,
        borderRadius :15,
        backgroundColor:'#fff'
    },
    aniImage : {
        width:CommonUtils.scale(80),
        height:CommonUtils.scale(65),
        zIndex:5
    },
    aniText : {
        color:'#000',
        fontWeight:'500',
        fontSize: CommonUtils.scale(10),
    },
    aniTextBold : {
        color:'#000',        
        fontWeight:'bold',
        fontSize: CommonUtils.scale(10),
    },
    arrowWrap : {
        justifyContent :'center',
        alignItems:'center',        
        height:CommonUtils.scale(50),
        flex:1
    },
    secondScreen : {
        flex:1,
        justifyContent :'center',
        alignItems:'center',
        backgroundColor:'purple'
    },
    mainText : {
        color:'#000',
        fontWeight:'bold',
        fontSize: CommonUtils.scale(18),
        lineHeight: CommonUtils.scale(22),
    },
    subText : {
        color:'#555',
        fontWeight:'500',
        fontSize: CommonUtils.scale(14),
        lineHeight: CommonUtils.scale(18),
    },
    whiteText : {
        color:'#fff',
        fontWeight:'bold',
        fontSize: CommonUtils.scale(14),
    },
    buttonWrap : {
        width:SCREEN_WIDTH*0.4,
        backgroundColor:'#ccc',
        alignItems:'center',
        justifyContent:'center',
        paddingVertical:10,
        height:CommonUtils.scale(40),
        borderRadius:10
    },
    buttonWrap2 : {
        width:SCREEN_WIDTH*0.4,
        backgroundColor:'#e5293e',
        alignItems:'center',
        justifyContent:'center',
        paddingVertical:10,
        height:CommonUtils.scale(40),
        borderRadius:10
    },
    fixedBottomWrap : {
        position:'absolute',
        left:0,
        bottom:0,
        width:SCREEN_WIDTH,
        height: CommonUtils.isIphoneX() ? CommonUtils.scale(70) : CommonUtils.scale(50),        
        justifyContent:'space-evenly',        
        flexDirection:'row'
    },
  });

  export default IntruduceScreen;
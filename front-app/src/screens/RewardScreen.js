import React,{useState,useEffect,useRef,useCallback,useContext} from 'react';
import {Animated,Easing,Platform,StyleSheet,Pressable,View,Image,Text,Dimensions,ActivityIndicator,ScrollView} from 'react-native';
import { useFocusEffect,useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();

import HeaderScreen from '../route/HeaderScreen';
import CommonUtils from '../utils/CommonUtils';
import mConst from '../utils/Constants';
import UserTokenContext from '../store/UserTokenContext';
import { TouchableOpacity } from 'react-native-gesture-handler';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const RewardScreen = (props) => {
    //console.log('RewardScreen',props.route.params)
    const {myRewardToken, myPoint, setUserInfo} = useContext(UserTokenContext);
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [isLoading, setLoading] = useState(true);
    const [isTabMenu, setTabMenu] = useState(1);
    const [tabIndex, setTabIndex] = useState(1);
    const refScrollView = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        setLoading(false)
    }, []);

  
    useFocusEffect(
        useCallback(() => {            
            if ( props.route.params?.screenState?.tabIndex  === 1 ) {
                setTabIndex(1);
                startAnimation(0);
                setTimeout(() => {
                    refScrollView.current.scrollTo({y:0,animated:false})
                }, 500);
            }else{
                startAnimation(1);
                setTabIndex(2);
                setTimeout(() => {
                    refScrollView.current.scrollToEnd({animated:false})
                }, 500);
            }
        }, [props.route.params])
      );

    const startAnimation = (toValue) => {
        //console.log('startAnimation', toValue)
        Animated.timing(animatedValue, {
            toValue,
            duration: 400,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start(()=>{
            if ( toValue === 0 ) {
                setTabMenu(1)
                refScrollView.current.scrollTo({y:0,animated:false})
            }else{
                setTabMenu(2)
                refScrollView.current.scrollToEnd({y:0,animated:false})
            }
        });
    };

    const left = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['2%', '50%'],
      extrapolate: 'clamp',
    });

    const scale = animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.9, 1],
      extrapolate: 'clamp',
    });
    const togglecolor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#000', '#888'],
        extrapolate: 'clamp',
    });
    const togglecolor2 = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#888', '#000'],
        extrapolate: 'clamp',
    });

    const handleCurrentChange = (e) => {
        //console.log('handleCurrentChange',e.nativeEvent.contentOffset);        
        const nextCurrent = Math.floor(e.nativeEvent.contentOffset.x);
        //console.log('nextCurrent',nextCurrent)
        if (nextCurrent > SCREEN_WIDTH*0.5) {
            //console.log('true')
            startAnimation(1);
            return;
        }else{
            //console.log('false')
            startAnimation(0);
        }        
    };

    const goNavigaion = (nav,params=null) => {
        if ( !CommonUtils.isEmpty(nav)) {
            if ( !CommonUtils.isEmpty(params)) {
                props.navigation.navigate(nav,params)
            }else{
                props.navigation.navigate(nav)
            }
        }
    }

    return (
        <View style={styles.container}>
        { 
            isLoading 
            ? 
            <View style={styles.centerStyle}>
                <ActivityIndicator/> 
            </View>
            : 
            (
                <View>
                    <HeaderScreen 
                        screenProps={props}  
                        titlePosition='Left'
                        navTitle='나의 리워드' 
                        leftTool={null}
                    />
                    <ScrollView>
                        <View style={styles.sliderContainer}>
                            <Animated.View style={[styles.slider, { left }]} />
                            <Pressable
                                style={styles.clickableArea}
                                onPress={startAnimation.bind(null, 0)}
                            >
                                <Animated.Text style={[styles.sliderText, {color:togglecolor, transform: [{ scale }] }]}>
                                    리워드
                                </Animated.Text>
                            </Pressable>
                            <Pressable
                                style={styles.clickableArea}
                                onPress={startAnimation.bind(null, 1)}
                            >
                                <Animated.Text style={[styles.sliderText, { color:togglecolor2, transform: [{ scale }] }]}>
                                    포인트
                                </Animated.Text>
                            </Pressable>
                        </View>
                        <View style={styles.scrollWrap}>
                            <Animated.ScrollView
                                ref={refScrollView}
                                //ref={ref => (refScrollView = ref)}
                                horizontal={true}
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}                        
                                scrollEventThrottle={1}
                                onScrollEndDrag={handleCurrentChange}
                            >
                                <Animated.View style={styles.slideImageWrap}>
                                    <Animated.Image 
                                        source={require('../../assets/images/sample_11.jpeg')} 
                                        resizeMode='cover'
                                        style={styles.imageStyle}
                                    />
                                </Animated.View>
                                <Animated.View style={styles.slideImageWrap}>
                                    <Animated.Image 
                                        source={require('../../assets/images/sample_12.jpeg')} 
                                        resizeMode='cover'
                                        style={styles.imageStyle}
                                    />
                                </Animated.View>
                                
                                
                            </Animated.ScrollView>
                        </View>
                        <View style={styles.linkOuterWrap}>
                        {
                            isTabMenu === 1 
                            ?
                            <View style={styles.rewardWrap}>
                                <View style={styles.linkTitlteWrap}>
                                    <Text style={styles.linkText}>나의 보유 토큰 <Text style={styles.orangeText}>{"  "}{myRewardToken}</Text></Text>
                                </View>
                                <View style={styles.linkDataWrap}>
                                    <View style={styles.commonDataWrap}>
                                        <Text style={styles.linkText2}>아직 보유한 리워드가 없어요</Text>
                                    </View>
                                    <View style={styles.commonDataWrap}>
                                        <Image 
                                            source={require('../../assets/images/pig.jpeg')} 
                                            resizeMode='contain'
                                            style={{height:CommonUtils.scale(50)}}
                                        />
                                    </View>
                                    <TouchableOpacity 
                                        onPress={()=>goNavigaion('WebSocket')}
                                        style={styles.commonDataWrap}>
                                        <View style={styles.buttonWrap}>
                                            <Text style={styles.whiteText}>지금 바로 리워드 받기</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            :
                            <View style={styles.pointWrap}>
                                 <View style={styles.linkTitlteWrap}>
                                    <Text style={styles.linkText}>제휴포인트 목록</Text>
                                </View>
                                 <View style={styles.linkDataWrap}>
                                    <View style={styles.commonDataWrap}>
                                        <Text style={styles.linkText2}>고객님께 필요한 포인트가</Text>
                                        <Text style={styles.linkText2}>무엇인지 준비중에 있어요!</Text>
                                    </View>
                                    <View style={styles.commonDataWrap}>
                                        <Image 
                                            source={require('../../assets/images/pig.jpeg')} 
                                            resizeMode='contain'
                                            style={{height:CommonUtils.scale(50)}}
                                        />
                                    </View>
                                    <View style={styles.commonDataWrap}>
                                        <View style={styles.buttonWrap}>
                                            <Text style={styles.whiteText}>드림 포인트, 어떻게 사용할까?</Text>
                                        </View>
                                        <View style={styles.buttonWrap2}>
                                            <Text style={styles.whiteText}>내가 원하는 포인트 알려주기</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                        }
                        </View>
                    </ScrollView>
                </View>
            )
        }
        </View>
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
    scrollWrap : {
        flex:1,
        justifyContent :'center',
    },
    imageStyle : {
        width:SCREEN_WIDTH*0.7,
        height:SCREEN_WIDTH*0.3,
        borderRadius:CommonUtils.scale(10)
    },
    slideImageWrap : {
        flex:1,marginHorizontal:20,
        height:SCREEN_WIDTH*0.3,
        overflow:'hidden'
    },
    sliderContainer: {
      width: SCREEN_WIDTH-80,
      height: 40,      
      marginVertical:20,
      marginHorizontal:40,
      borderRadius: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#e0e0e0',
    },
    clickableArea: {
      width: '50%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    sliderText: {
      fontSize: mConst.subTitle,
      fontWeight: '500',
      color:'#555'
    },
    slider: {
      position: 'absolute',
      width: '48%',
      height: '80%',
      borderRadius: 20,
      backgroundColor: '#f4f4f4',
    },
    linkOuterWrap : {
        flex : 1,
        margin : 20
    },
    linkTitlteWrap : {
        flex:1,
        borderRadius:10
    },
    linkDataWrap : {
        flex:1,
        width:'100%',
        marginTop:20,
        borderWidth:1,
        backgroundColor:'#fff',
        borderColor:'#ccc',
        borderRadius:10,
        ...Platform.select({
            ios: {
                shadowColor: "#555",
                shadowOpacity: 0.5,
                shadowRadius: 10,
                shadowOffset: {
                    height: 2,
                    width: 0,
                },
            },
            android: {
              elevation: 3,
            },
        })
    },
    commonDataWrap : {
        flex:1,
        paddingVertical:20,
        justifyContent:'center',
        alignItems:'center'
    },
    rewardWrap : {
        flex : 1,
        paddingVertical:10,
        justifyContent:'center',
        
    },
    pointWrap:{
        flex : 1,
        paddingVertical:10,
        justifyContent:'center'
    },
    linkText : {
        color:'#333',
        fontWeight:'500',
        fontSize:mConst.mainTitle   
    },
    linkText2 : {
        color:'#555',
        fontWeight:'500',
        fontSize: mConst.subTitle
    },
    orangeText : {
        color:'orange',
        fontWeight:'500',
        fontSize: mConst.subTitle
    },
    whiteText : {
        color:'#fff',
        fontWeight:'bold',
        fontSize: mConst.subTitle
    },
    buttonWrap : {
        width:'80%',
        backgroundColor:'#e5293e',
        alignItems:'center',
        justifyContent:'center',
        paddingVertical:10,
        borderRadius:10
    },
    buttonWrap2 : {
        marginTop:20,
        width:'80%',
        backgroundColor:'#bbb',
        alignItems:'center',
        justifyContent:'center',
        paddingVertical:10,
        borderRadius:10
    }
  });

  export default RewardScreen;
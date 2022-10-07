import React,{useState,useEffect,useRef} from 'react';
import {StyleSheet,View,Text,Animated,Platform,Dimensions,StatusBar,TouchableOpacity,Easing} from 'react-native';
import FastImage from 'react-native-fast-image';
import AnimateNumber from 'react-native-animate-number';
import CommonUtils from '../utils/CommonUtils';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const baseScreenEndX = SCREEN_HEIGHT-100;
const ICON_BITCOIN = require('../../assets/images/bitcoin.png')
const ICON_DREAM = require('../../assets/images/dream.png')

const CustomSplash = (props) => {
    
    const [actorCount, setActorCount] = useState(0);
    const [directorCount, setDirectorCount] = useState(0);

    const [ locationY, setLocationY] = useState(0);
    const [ isSequence, setIsSequence] = useState(50);
    const fadeYLocation = useRef(new Animated.Value(locationY)).current;
    const transformAnimation =  useRef(new Animated.Value(ICON_BITCOIN)).current;
    const fallAnimation =  useRef(new Animated.Value(0)).current;

    useEffect(() => {
        setActorCount(19000000);
        setDirectorCount(4500);
        moveY();
        if ( Platform.OS === 'android'){
            setPparallel();
        }        
    }, []);


    const thisSetUserInfo = (bool) => {
        setUserInfo({
            isSessionAlive: bool,
            userEmail : 'minuee@nate.com'
        });
    }

    const setPparallel = () => {
        const transformToBallAnimation = Animated.timing(
          transformAnimation,
          {
            toValue: isSequence == 50 ? ICON_DREAM: ICON_BITCOIN ,
            duration: 1000,
            useNativeDriver: false,
          }
        );
      
        const fallformAnimation = Animated.timing(
          fallAnimation,
          {
            toValue: isSequence == 50 ? baseScreenEndX : 50,
            duration: 3000,
            easing: Easing.bounce,
            useNativeDriver: false,
          }
        );
      
        Animated.parallel([
            transformToBallAnimation,
            fallformAnimation
        ]).start();
    
        setTimeout(() => {
            if ( isSequence == 50 ) setIsSequence(baseScreenEndX);
            else setIsSequence(50)
        }, 1000);
    }

    const moveY = () => {
        Animated.timing(fadeYLocation, {
          toValue: locationY === 100 ? 0 : 100,
          duration: 1500,
          easing: Easing.ease,
          useNativeDriver:false
        }).start(()=>{
            setLocationY(locationY === 0 ? 100 : 0);
        });   
    }

    return (        
        <View style={{...StyleSheet.absoluteFill, flex: 1}}>        
            <StatusBar translucent={true} backgroundColor={'transparent'} barStyle={'dark-content'} animated={true} />
            <FastImage
                source={require('../../assets/images/splash.png')}
                style={styles.container}
            >
                <Text style={{color: 'white', marginTop: '20%'}}>
                    <Text style={{fontWeight: 'bold'}}>
                        <AnimateNumber
                            value={directorCount}
                            timing="linear"
                            formatter={val => {
                                return CommonUtils.AddComma(Math.floor(val));
                            }}
                        />
                        명
                    </Text>
                    의 유저가{'\n'}
                    <Text style={{fontWeight: 'bold'}}>
                        <AnimateNumber
                            value={actorCount}
                            timing="linear"
                            formatter={val => {
                                return CommonUtils.AddComma(Math.floor(val));
                            }}
                        />
                        원
                    </Text>
                    의 지갑금액을 이용중입니다.
                </Text>
                <Animated.View style={[styles.fixedBox,{                
                    transform: [
                        {translateY: fadeYLocation },
                    ]}]}>
                    <Animated.Text style={styles.aniText}>
                        개인금고형{"\n"}전자지갑{"\n"}
                        <Animated.Text style={styles.aniTitleText}>
                            Dream E-Wallet
                        </Animated.Text>
                    </Animated.Text>
                </Animated.View>
                {/* <View style={styles.section}>
                    <Animated.Image 
                        source={transformAnimation}
                        style={
                        { 
                            width: 100,height: 100,
                            //borderRadius: transformAnimation,
                            transform: [
                                { translateY: fallAnimation }
                            ]
                        }
                    } 
                    />
                </View> */}
                <TouchableOpacity style={styles.buttonWrap} onPress={()=>props.propsSplashScreen(false)}>
                    <View style={styles.buttonOuter} >
                        <Text style={styles.actionText}>시작하기</Text>
                    </View>
                </TouchableOpacity>
            </FastImage>
        </View> 
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    fixedBox : {
        position:'absolute',
        left : 50,
        top : 50,
        width : SCREEN_WIDTH-100,
        height:100,
        justifyContent : 'flex-end',
        alignItems : 'flex-start',        
    },
    aniText : {
        fontWeight: 'bold',
        color:'#fff',
        fontSize:CommonUtils.scale(15)
    },
    aniTitleText : {
        fontWeight: 'bold',
        color:'gold',
        fontSize:CommonUtils.scale(20)
    },
    section : {
        position:'absolute',
        right : 20,
        top : 0,
        width : SCREEN_WIDTH-100,
        height:SCREEN_HEIGHT-100,
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
    },
    buttonWrap : {
        position:'absolute',
        left : 0,
        bottom : 100,
        width : SCREEN_WIDTH,
        height:  100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonOuter : {
        padding:10,
        width : 150,
        height:50,
        borderRadius:15,
        backgroundColor:'#fff',
        justifyContent:'center',
        alignItems:'center'
    },
    actionText : {
        color:'#ff0000',
        fontWeight:'bold',
        fontSize: CommonUtils.scale(16)
    },
});

export default CustomSplash;
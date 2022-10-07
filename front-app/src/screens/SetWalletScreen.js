import React,{useState,useEffect,useRef,useCallback,useContext} from 'react';
import {Alert,TouchableOpacity,Platform,StyleSheet,View,StatusBar,Text,Dimensions,ActivityIndicator,ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();
import { ifIphoneX, getBottomSpace } from 'react-native-iphone-x-helper'
import CommonUtils from '../utils/CommonUtils';
import mConst from '../utils/Constants';
import { SafeAreaView } from 'react-native-safe-area-context';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const WalletScreen = (props) => {

    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false)
    }, []);     
 
    const setWallet = () => {
        Alert.alert(
            mConst.appName,
            '지갑을 생성하시겠습니까?',
            [
                {text: '네', onPress: () => actionSetWallet()},
                {text: '아니오', onPress: () => console.log('no')},
            ],
            {cancelable: false},
        );        
    }

    const actionSetWallet = () => {
        //props.navigation.navigate('WalletMakeStack');
        props.navigation.navigate('MakeStep1Screen');
        /* CommonUtils.fn_call_toast('처리완료하였습니다.');
        setTimeout(() => {
            props.navigation.goBack();
        }, 2000); */
    }
    return (

        isLoading 
        ? 
        <View style={styles.centerStyle}>
            <ActivityIndicator/> 
        </View>
        : 
        (
            <SafeAreaView style={styles.container}>
                <StatusBar translucent={true} backgroundColor={'transparent'} barStyle={'dark-content'} animated={true} />
                <ScrollView>       
                    <View style={styles.titleBox}>
                        <View style={styles.titleLeftBox}>
                            <Icon
                                name="menu-book"
                                size={CommonUtils.scale(40)}
                                color="orange"
                            />
                        </View>
                        <View style={[styles.titleLeftBox,{marginTop:15}]}>
                            <Text style={styles.mainText}>지갑 사용 안내</Text>                            
                        </View>
                    </View>                 
                    <View style={styles.linkOuterWrap}>                        
                        <View style={styles.linkDataWrap}>
                            <View style={styles.commonTitleWrap}>
                                <Text style={styles.linkText}>◦ 고객님의 휴대폰 번호로 인증된 드림월렛 앱 사용 이력이 있습니다.</Text>
                            </View>
                            <View style={styles.commonTitleWrap}>
                                <Text style={styles.linkText}>◦ 드림 월렛은 하나의 앱에서만 로그인이 유지되며 <Text style={styles.linkText2}>지갑 생성, 지갑 불러오기 진행시 이전 앱은 자동으로 사용중지 됩니다.</Text></Text>
                            </View>
                            <View style={styles.commonTitleWrap}>
                                <Text style={styles.linkText}>◦ 반드시 이전 앱의 복구단어를 백업 후 사용해 주세요.</Text>
                            </View>
                            <View style={styles.commonTitleWrap}>
                                <Text style={styles.linkText}>◦ 계속 진행하시려면 [확인]버튼을 선택해주세요.</Text>
                            </View>
                        </View>
                    </View>                        
                    <View style={{height:100}} />
                </ScrollView>
                <View style={styles.fixedBottomWrap}>
                    <TouchableOpacity 
                        style={styles.buttonWrap}
                        onPress={() => props.navigation.goBack()}
                    >
                        <Text style={styles.whiteText}>취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.buttonWrap2}
                        onPress={() => setWallet()}
                    >
                        <Text style={styles.whiteText}>확인</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
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
    titleBox : {
        flex:1,        
        marginTop:30,
        alignItems:'center',
        justifyContent:'center'
    },
    titleLeftBox : {
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },    
    mainText : {
        color:'#000',
        fontWeight:'bold',
        fontSize: CommonUtils.scale(18),
        lineHeight: CommonUtils.scale(22),
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
    clickableArea: {
      width: '50%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },    
    linkOuterWrap : {
        flex : 1,
        marginHorizontal : 20
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
        borderRadius:20,
        ...Platform.select({
            ios: {
                shadowColor: "#555",
                shadowOpacity: 0.5,
                shadowRadius: 5,
                shadowOffset: {
                    height: 1.5,
                    width: 0,
                },
            },
            android: {
              elevation: 3,
            },
        })
    },
    MainText : {
        color:'#000',
        fontWeight:'bold',
        fontSize: CommonUtils.scale(13),
        lineHeight: CommonUtils.scale(20),
    },
    subText : {
        color:'#555',      
        fontWeight:'500',  
        fontSize: CommonUtils.scale(10),
    },
    modalCommonWrap : {        
        flexDirection:'row',
        marginVertical:15,
        paddingHorizontal:20
    },
    modalCommonFlex1Wrap : {
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    modalCommonFlex5Wrap : {
        flex:5,
        justifyContent:'center',        
    },
    commonTitleWrap : {
        flex:1,
        padding:20,
        justifyContent:'center'
    },
    commonDataWrap : {
        flex:1,
        paddingVertical:20,
        justifyContent:'center',
        alignItems:'center'
    },
 
    pointWrap:{
        flex : 1,
        paddingVertical:10,
        justifyContent:'center'
    },
    linkText : {
        color:'#555',
        fontWeight:'500',
        fontSize: CommonUtils.scale(13),
        lineHeight: CommonUtils.scale(18),
    },
    linkText2 : {
        color:'#000',
        fontWeight:'500',
        fontSize: CommonUtils.scale(13),
        lineHeight: CommonUtils.scale(18),
    },
    orangeText : {
        color:'orange',
        fontWeight:'500',
        fontSize: CommonUtils.scale(14),
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
        ...ifIphoneX({
            height: CommonUtils.scale(60)
        }, {
            height: CommonUtils.scale(50)
        }),
        justifyContent:'space-evenly',        
        flexDirection:'row'
    },
  });

  export default WalletScreen;
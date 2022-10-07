import React,{useState,useEffect,useRef,useCallback,useContext} from 'react';
import {Animated,TouchableOpacity,Platform,StyleSheet,Pressable,View,Image,Text,Dimensions,ActivityIndicator,ScrollView} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();

import HeaderScreen from '../route/HeaderScreen';
import CommonUtils from '../utils/CommonUtils';
import mConst from '../utils/Constants';
import MoreLoading from '../utils/MoreLoading';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const WalletScreen = (props) => {
    const [isLoading, setLoading] = useState(true);
    const [isMoreLoading, SetIsMoreLoading] = useState(false);
    
    useEffect(() => {
        setLoading(false)
    }, []);

    
    const goNavigaion = (nav,params=null) => {
        //console.log('goNavigaion',params)   
        if ( !CommonUtils.isEmpty(nav)) {
            if ( !CommonUtils.isEmpty(params)) {
                props.navigation.navigate(nav,params)
            }else{
                props.navigation.navigate(nav)
            }
            
        }
    }

    const getSafeWallet = () => {
        SetIsMoreLoading(true);        
        setTimeout(() => {            
            SetIsMoreLoading(false);
        }, 2000);
        setTimeout(() => {
            CommonUtils.fn_call_toast('안심서버에 지갑이 존재하지 않습니다.');            
        }, 2500);
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
                <View style={{flex:1}}>
                    <HeaderScreen 
                        screenProps={props}  
                        titlePosition='Left'
                        navTitle='나의 지갑' 
                        leftTool={null}
                    />
                    <ScrollView>                        
                        <View style={styles.linkOuterWrap}>
                            <View style={styles.rewardWrap}>
                                <View style={styles.linkDataWrap}>
                                    <View style={styles.commonTitleWrap}>
                                        <Text style={styles.linkText2}>여기 안전하고</Text>
                                        <Text style={styles.linkText2}>편리한 지갑이 있습니다.</Text>
                                    </View>
                                    <View style={styles.commonDataWrap}>
                                        <Image 
                                            source={require('../../assets/images/pig.jpeg')} 
                                            resizeMode='contain'
                                            style={{height:CommonUtils.scale(50)}}
                                        />
                                    </View>
                                    <View style={styles.commonDataWrap}>
                                        <TouchableOpacity 
                                            onPress={()=>goNavigaion('SetWalletScreen') }
                                            style={styles.buttonWrap}
                                        >
                                            <Text style={styles.whiteText}>지갑 새로 만들기</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>                           
                        </View>
                        <View style={[styles.linkOuterWrap,{marginVertical:0}]}>
                            <View style={styles.linkDataWrap}>
                                <View style={styles.modalCommonWrap}>
                                    <View style={[styles.modalCommonFlex1Wrap,{alignItems:'flex-start'}]}>
                                        <Icon
                                            name="cases"
                                            style={{paddingRight:5}}
                                            size={CommonUtils.scale(25)}
                                            color="red"                                            
                                        />
                                    </View>
                                    <View style={styles.modalCommonFlex5Wrap}>
                                        <Text style={styles.subText}>보유한 지갑이 있다면</Text>
                                        <Text style={styles.MainText}>지갑 가져오기</Text>
                                    </View>
                                    <TouchableOpacity 
                                        onPress={()=>goNavigaion('GetWalletScreen') }
                                        style={[styles.modalCommonFlex1Wrap,{alignItems:'flex-end'}]}
                                    >
                                        <Icon
                                            name="navigate-next"
                                            style={{paddingRight:5}}
                                            size={CommonUtils.scale(25)}
                                            color="#555"                                            
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.linkDataWrap}>
                                <View style={styles.modalCommonWrap}>
                                    <View style={[styles.modalCommonFlex1Wrap,{alignItems:'flex-start'}]}>
                                        <Icon
                                            name="phonelink-lock"
                                            style={{paddingRight:5}}
                                            size={CommonUtils.scale(25)}
                                            color="red"
                                            onPress={()=>setScanView(false) }
                                        />
                                    </View>
                                    <View style={styles.modalCommonFlex5Wrap}>
                                        <Text style={styles.subText}>안심서버에 백업해 두셨나요?</Text>
                                        <Text style={styles.MainText}>안심서버에서 지갑 가져오기</Text>
                                    </View>
                                    <TouchableOpacity 
                                        onPress={()=>getSafeWallet()}                                    
                                        style={[styles.modalCommonFlex1Wrap,{alignItems:'flex-end'}]}
                                    >
                                        <Icon
                                            name="navigate-next"
                                            style={{paddingRight:5}}
                                            size={CommonUtils.scale(25)}
                                            color="#555"                                            
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={{height:100}} />
                    </ScrollView>
                    {
                        isMoreLoading &&
                        <MoreLoading isLoading={isMoreLoading} />
                    }
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
      fontSize: CommonUtils.scale(15),
      fontWeight: '500',
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
        fontSize: mConst.mainTitle,
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
        fontSize: CommonUtils.scale(14),        
    },
    linkText2 : {
        color:'#000',
        fontWeight:'bold',
        fontSize: mConst.mainTitle
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

  export default WalletScreen;
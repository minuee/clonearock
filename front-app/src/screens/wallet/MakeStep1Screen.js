import React,{useState,useEffect,useRef,useCallback,useContext} from 'react';
import {Alert,TouchableOpacity,Platform,StyleSheet,View,StatusBar,Text,Dimensions,ActivityIndicator,SafeAreaView,ScrollView} from 'react-native';
import { Overlay,Header } from 'react-native-elements';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();
import { ifIphoneX, getBottomSpace } from 'react-native-iphone-x-helper'
import etherUtil from '../../ether/utils';
import CommonUtils from '../../utils/CommonUtils';
import mConst from '../../utils/Constants';
import MoreLoading from "../../utils/MoreLoading";

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const langList = [
    { id : 1, code : 'english', code2  : 'en', name : '영어' },
    { id : 2, code : 'korean', code2  : 'ko', name : '한국어' },
    { id : 3, code : 'japaness', code2  : 'ja', name : '일본어' },
    { id : 4, code : 'chinese', code2  : 'zh_cn', name : '중국어' },
    { id : 5, code : 'french', code2  : 'fr', name : '프랑스어' },
    { id : 6, code : 'italian', code2  : 'it', name : '이탈리아어' },
    { id : 7, code : 'spanish', code2  : 'es', name : '스페인어' }
]

const MakeStep1Screen = (props) => {
    const isFocused = useIsFocused();
    const [isMoreLoading, SetIsMoreLoading] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [mnemonicCodeOrigin, setMnemonicCodeOrigin] = useState(null);
    const [mnemonicCode, setMnemonicCode] = useState([]);
    const [popLayerView, setPopLayerView] = useState(false);
    const [selectLanaguage, setLanguage] = useState(null);
    const [selectLanaguage2, setLanguage2] = useState(null);

    useEffect(() => {
        if ( isFocused ) {
            setPopLayerView(true);
            setLoading(false);
            setMnemonicCodeOrigin(null)
            setMnemonicCode([])
        }else{
            setMnemonicCodeOrigin(null)
            setMnemonicCode([])
        }
    }, [isFocused]);

 
    useEffect(() => {
        if ( mnemonicCode.length > 0 ) {
            props.navigation.navigate('MakeStep2Screen',{
                langSet : selectLanaguage2,
                data : mnemonicCode,
                originData :  mnemonicCodeOrigin
            }); 
        }
    }, [mnemonicCode]);  

    const setNmonicLang = (mode) => {
        setLanguage2(mode);
        const randomX = CommonUtils.getRandNums(1,12,3,null);
        
        Alert.alert(
            mConst.appName,
            '해당언어로 진행하시겠습니까',
            [
                {text: '네', onPress: () => getMnemonicCodeEther(mode,randomX)},
                {text: '아니오', onPress: () => console.log('no')},
            ],
            {cancelable: false},
        );        
    }

    const getMnemonicCodeEther = async(mode,randomX) => {        
        const mnemonicData =  etherUtil.generateMnemonicsSplit(16,mode);        
        let convertArray = [];
        mnemonicData.splitData.forEach(function(element,index,array){
            let idNumber = index+1;            
            convertArray.push({
                id : idNumber,
                name : element,
                isCheck:  randomX.indexOf(idNumber*1) != -1 ? true : false,
                isCheckResult:null
            })
        })        
        if ( convertArray.length > 0 ) {
            setMnemonicCodeOrigin(mnemonicData.originData)
            setMnemonicCode(convertArray);        
        }
        else CommonUtils.fn_call_toast('생성중 오류가 발생하였습니다')
    }

    const getMnemonicCode = async(mode,randomX) => {
        SetIsMoreLoading(true);        
        const option = {
            method: 'POST', 
            headers: {
                'Content-type': 'application/json'
            }, 
            body: JSON.stringify({
                language : mode,
                data :  mnemonicCode
            })
        }
        try{
            fetch( Platform.OS === 'ios' ? 'http://127.0.0.1:4000/wallet/newmnemonic' : 'http://10.0.2.2:4000/wallet/newmnemonic' , {
                headers: {
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    language : mode
                }),
                })
                .then(res => res.json())
                .then(result => {
                    if ( result.success ) {                        
                        if ( !CommonUtils.isEmpty(result.data)) {
                            const newmnemonicData = result.data.split(' ');                            
                            let convertArray = [];        
                            newmnemonicData.forEach(function(element,index,array){
                                convertArray.push({
                                    id : index+1,
                                    name : element,
                                    isCheck:  randomX.indexOf(index+1) != -1 ? true : false,
                                    isCheckResult:null
                                })
                            })                            
                            setMnemonicCode(convertArray)
                        }
                        SetIsMoreLoading(false);
                        //setMnemonicCode(result.data)
                    }else{
                        CommonUtils.fn_call_toast('네트워크 오류')
                        SetIsMoreLoading(false);
                    }
                });
            
        }catch(e){
            console.log('eeeeee',e)
            SetIsMoreLoading(false);
            CommonUtils.fn_call_toast('네트워크 오류입니다.');          
        }        
    }


    const actionsetNmonicLang = (mode) => {
        props.navigation.navigate('WalletStep2Screen',{
            langSet : mode
        });        
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
                    leftComponent={(
                        <TouchableOpacity 
                            onPress= {()=> props.navigation.goBack()} 
                            style={{flex:2,flexGrow:1,paddingLeft:20,flexDirection:'row',alignItems:'center',zIndex:11}}
                        >
                            <Icon
                                name="arrow-back-ios"
                                size={CommonUtils.scale(20)}
                                color={'#000'}
                            />                        
                        </TouchableOpacity>
                    )}
                    centerComponent={{ text: '새 지갑 만들기', style: { fontSize: mConst.navTitle,color: '#000' } }}
                    rightComponent={(
                        <TouchableOpacity 
                            onPress= {()=> props.navigation.goBack()} 
                            style={{ flex:1,flexGrow:1,justifyContent:'center',paddingRight:15}}
                        >
                            <Icon
                                name="close"
                                size={CommonUtils.scale(20)}
                                color={'#000'}
                            />   
                        </TouchableOpacity>
                    )}
                    containerStyle={{borderBottomWidth: 0}}
                />
                <ScrollView>       
                    <View style={{flexDirection:'row',paddingTop:15}}>
                        <View style={{flex:5,justifyContent:'center',alignItems:'center',paddingLeft:20}}>
                            <View style={{height:5,width:'100%',backgroundColor:'#ebebeb'}}>
                                <View style={{height:5,width:'33%',backgroundColor:mConst.baseColor}}/>
                            </View>
                        </View>
                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Text style={styles.subText}><Text style={[styles.subText,{color:mConst.baseColor}]}>1</Text>/3</Text>
                        </View>
                    </View>
                    <View style={styles.titleBox}>
                        <View style={[styles.titleLeftBox,{marginTop:15}]}>
                            <Text style={styles.mainText}>복구단어 언어설정</Text>
                        </View>
                        <View style={[styles.titleLeftBox,{marginTop:15}]}>
                            <Text style={styles.subText}>복구단어 생성시</Text>
                            <Text style={styles.subText}>원하는 언어를 선택하세요.</Text>
                        </View>
                        <View style={[styles.titleLeftBox,{marginTop:25}]}>
                            <Icon
                                name="menu-book"
                                size={CommonUtils.scale(100)}
                                color="orange"
                            />
                        </View>
                    </View>                 
                                 
                    <View style={{height:100}} />
                </ScrollView>
                <View style={styles.fixedBottomWrap}>
                    <ScrollView 
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    >
                        {
                            langList.map((item,index) => {
                                return (                                        
                                    <TouchableOpacity 
                                        style={selectLanaguage2 == item.code2 ? styles.selectItem : styles.unselectItem} 
                                        key={index}
                                        onPress={() => setNmonicLang(item.code2)}
                                    >
                                        <Text style={styles.whiteText}>{item.name}</Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
                   </ScrollView>
                </View>
                { popLayerView && 
                <View style={styles.fixedFullWidth}>
                    <Overlay
                        isVisible={popLayerView}                        
                        windowBackgroundColor="rgba(0, 0, 0, 0.8)"
                        overlayBackgroundColor="tranparent"
                        overlayStyle={styles.overStyle}
                    >
                        <View style={styles.overlayDataWrap}>
                            <Text style={styles.mainTitleText}>스크린샷을 찍지 마세요!</Text>
                            <Text style={styles.titleSubText}>
                                복구단어가 노출되면 누구든지 지갑에 접근하여 암호화폐를 출금할 수 있습니다. 반드시 종이에 메모하여 안전한 장소에 보관하세요.
                            </Text>
                            <TouchableOpacity 
                                onPress={()=>setPopLayerView(false)}
                                style={styles.overlayButtonWrap}>
                                <Text style={styles.overlayButtonText}>
                                    확인했습니다.
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Overlay>
                </View>
                }
                {
                    isMoreLoading &&
                    <MoreLoading isLoading={isMoreLoading} />
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
    fixedFullWidth : {
        position: 'absolute',
        top:0,
        left:0,        
        width:SCREEN_WIDTH,
        height:SCREEN_HEIGHT,
        margin:0,
        justifyContent:'center',
        alignItems:'center',
        zIndex:10
    },
    overStyle : {
        borderRadius:CommonUtils.scale(20),
        margin:0,
        padding:0,
    },
    overlayDataWrap : {
        width:SCREEN_WIDTH*0.8,
        height:CommonUtils.scale(200),
        padding:15,
        backgroundColor:'#222'
    },
    overlayButtonWrap : {
        position:'absolute',
        bottom:20,
        right:20,
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
    subText : {
        color:'#555',        
        fontSize: CommonUtils.scale(15),
        lineHeight: CommonUtils.scale(18),
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
    mainTitleText : {
        color:'#fff',
        fontWeight:'bold',
        fontSize: CommonUtils.scale(16),
        lineHeight: CommonUtils.scale(40),
    },
    titleSubText : {
        color:'#fff',      
        fontWeight:'500',  
        fontSize: CommonUtils.scale(13),
        lineHeight: CommonUtils.scale(20),
    },
    overlayButtonText : {
        color:mConst.baseColor,      
        fontWeight:'500',  
        fontSize: CommonUtils.scale(12),
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
        left:10,
        bottom:0,
        width:SCREEN_WIDTH-10,
        ...ifIphoneX({
            height: CommonUtils.scale(60)
        }, {
            height: CommonUtils.scale(50)
        }),
        justifyContent:'space-evenly',        
        flexDirection:'row',

        zIndex:20
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
  });

  export default MakeStep1Screen;
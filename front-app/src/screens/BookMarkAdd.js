import React,{useState,useEffect,useRef,useCallback,useContext} from 'react';
import {Alert,Vibration,Animated,TouchableOpacity,Platform,StyleSheet,View,Image,Text,Dimensions,ActivityIndicator,ScrollView} from 'react-native';
import { Header,Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();
import Modal from "react-native-modal";
import Clipboard from '@react-native-clipboard/clipboard';
import CommonUtils from '../utils/CommonUtils';
import localStorage from '../store/LocalStorage';
import mConst from '../utils/Constants';
import MoreLoading from '../utils/MoreLoading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect,useIsFocused } from '@react-navigation/native';
import QRScaner from '../component/QRScaner';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const STORAGE_KEY = localStorage.WalletAddressBook;// '@Storage/Wallet';

/* https://github.com/ErikThiart/cryptocurrency-icons */
const coinMakerList = [
    { id : 1, name:'비트코인', code : 'BTC', img_url : 'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/32/bitcoin.png'},
    { id : 2, name:'테더', code : 'USDT', img_url : 'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/32/tether.png'},
    { id : 3, name:'이더리움', code : 'ETH', img_url : 'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/32/ethereum.png'},
    { id : 4, name:'클레이튼', code : 'KLAY', img_url : 'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/32/cosmos.png'},
    { id : 5, name:'USD코인', code : 'USDC', img_url : 'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/32/usd-coin.png'},
    { id : 6, name:'미콘캐시', code : 'MCH', img_url : 'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/32/equal.png'},
    { id : 7, name:'유니스왑', code : 'UNI', img_url : 'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/32/uniswap.png'},
    { id : 8, name:'모비스트', code : 'MITX', img_url : 'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/32/moac.png'},
    { id : 9, name:'핀', code : 'FIN', img_url : 'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/16/yearn-finance.png'},
    { id : 10, name:'드림버스', code : 'DV', img_url : 'https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/16/dreamteam-token.png'}
]

const BookMarkScreen = (props) => {
    const [isLoading, setLoading] = useState(true);
    const [isMoreLoading, SetIsMoreLoading] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);  
    const isFocused = useIsFocused();

    const [isScanView, setScanView] = useState(false);
    const [scaned, setScaned] = useState(true);    

    const [keyword, setKeyword] = useState(null);
    const [memo, setMemo] = useState(null);
    const [address, setAddress] = useState(null);
    const [addressName, setAddressName] = useState(null);
    const [coinMaker, setCoinMaker] = useState(null);
    const [nowAddress, setNowAddress] = useState(null);
    const animatedHeight = useRef(new Animated.Value(SCREEN_HEIGHT*0.7)).current;
    
    
    useEffect(() => {
        async function fetchData () {                
            const rdata = await AsyncStorage.getItem(STORAGE_KEY);
            if ( !CommonUtils.isEmpty(rdata)) {                    
                setNowAddress(JSON.parse(rdata))
            }else{
                setNowAddress([])
            }
            setLoading(false)
        }
        fetchData();
    }, [])
    

    const selectCoinMaker = async(item) => {
        setCoinMaker(item);
        setModalVisible(false);
    };

    const onBarCodeRead = (event) => {
        if (!scaned) return;
        setScaned(false);
        Vibration.vibrate();
        Alert.alert("QR Code", event.nativeEvent.codeStringValue, [
          { text: "OK", onPress: () => {
            setScaned(true);setScanView(false);setAddress(event.nativeEvent.codeStringValue)} 
            },
        ]);
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
    const fn_hideMode = (e) => {
        if ( e < 0.20 ) {            
            setModalVisible(false)
        }
    }

    const copiedClipBaord = async() => {
        const ctext = await Clipboard.getString();
        if ( CommonUtils.isEmpty(ctext)) {
            CommonUtils.fn_call_toast('복사할 대상이 없습니다.');return;
        }else{
            setAddress(ctext)
        }
    }

    const addBookmark = () => {
        if ( !CommonUtils.isEmpty(address) && !CommonUtils.isEmpty(addressName) && !CommonUtils.isEmpty(coinMaker)) {  
            Alert.alert(
                mConst.appName,
                '주소록을 등록하시겠습니까?',
                [
                  {text: '네', onPress: () => actionaddBookmark()},
                  {text: '아니오', onPress: () => console.log('no')},
                ],
                {cancelable: false},
              );
        }
    }

    const actionaddBookmark = async() => {
        const addAddress = await nowAddress.concat({
            'walletCoin' : coinMaker,
            'walletAddress' : address,
            'walletName' : addressName,
            'walletMemo' : memo,
        })
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(addAddress));
        setTimeout(() => {
            props.navigation.goBack();
        }, 1000);  
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
                isScanView ?
                <QRScaner
                    setScanView={setScanView}  
                    onBarCodeRead={onBarCodeRead}
                />
                :
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
                        centerComponent={{ text: '주소록 등록', style: { fontSize: mConst.navTitle,color: '#000' } }}                    
                        rightComponent={(
                            <View style={{flex:1,paddingRight:10,justifyContent:'center'}}>
                                
                            </View>
                        )}
                        containerStyle={{borderBottomWidth: 0}}
                    /> 
                    <ScrollView
                        style={{width:'100%',height:'100%'}}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={[styles.linkOuterWrap,{marginTop:20}]}>
                            <Text style={styles.MainText}>필수정보 입력</Text>
                        </View>
                        <View style={styles.linkOuterWrap}>
                            <View style={styles.rewardWrap}>
                                <View style={styles.linkDataWrap}>
                                    <View style={styles.modalFlexCommonWrap}>
                                        <View style={styles.modalCommonFlex1Wrap}>
                                            <Text style={styles.subText}>이름</Text>
                                        </View>
                                        <View style={styles.modalCommonFlex4Wrap}>
                                            <Input 
                                                value={addressName}
                                                placeholder={"10자 이내의 이름을 입력하세요"}
                                                placeholderTextColor={"#555"}
                                                maxLength={11}
                                                onChangeText={text => setAddressName(text)} 
                                                inputContainerStyle={styles.inputContainer}
                                                inputStyle={{color:'#555',fontSize:12}}
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.modalFlexCommonWrap}>
                                        <View style={styles.modalCommonFlex1Wrap}>
                                            <Text style={styles.subText}>코인종류</Text>
                                        </View>
                                        <TouchableOpacity 
                                            style={styles.modalCommonFlex4Wrap}
                                            onPress={() => setModalVisible(!isModalVisible)}
                                        >   
                                            {
                                                CommonUtils.isEmpty(coinMaker) ?
                                                <Input 
                                                    disabled={true}
                                                    placeholder={"코인종류를 선택해주세요"}
                                                    placeholderTextColor={"#555"}
                                                    inputContainerStyle={styles.inputContainer}
                                                    inputStyle={{color:'#555',fontSize:12}}
                                                    rightIcon={{ type: 'ant-design', name: 'menu-fold', color:'#ccc', size:20 }}
                                                />
                                                :
                                                <View style={styles.coinSelectBoxWrap}>
                                                    <Image source={{uri:coinMaker.img_url}} style={styles.iconWrap2} resizeMode={"contain"} />
                                                    <Text style={styles.coinText}>{coinMaker.code}</Text>
                                                </View>

                                            }
                                        </TouchableOpacity>
                                    </View>
                                    
                                    <View style={styles.modalFlexCommonWrap}>
                                        <View style={styles.modalCommonFlex1Wrap}>
                                            <Text style={styles.subText}>주소</Text>
                                        </View>
                                        <View style={styles.modalCommonFlex4Wrap}>
                                        <Input 
                                            value={address}
                                            placeholder={"코인주소를 입력해주세요"}
                                            placeholderTextColor={"#555"}
                                            onChangeText={text => setAddress(text)} 
                                            inputContainerStyle={styles.inputContainer}
                                            inputStyle={{color:'#555',fontSize:12}}
                                        />
                                        </View>
                                    </View>
                                       
                                    
                                    <View style={styles.buttonOuterWrap}>
                                        <TouchableOpacity 
                                            onPress={copiedClipBaord}
                                            style={styles.buttonWrap}
                                        >
                                            <Text style={styles.whiteText}>붙여넣기</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            onPress={()=> setScanView(true) }
                                            style={styles.buttonWrap}
                                        >
                                            <Text style={styles.whiteText}>QR코드 스캔</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>                           
                        </View>
                        <View style={[styles.linkOuterWrap,{marginTop:50}]}>
                            <Text style={styles.MainText}>추가 정보 입력</Text>
                        </View>
                        <View style={[styles.linkOuterWrap,{marginVertical:0}]}>
                            <View style={styles.linkDataWrap}>
                                <View style={styles.modalFlexCommonWrap}>
                                    <View style={styles.modalCommonFlex1Wrap}>
                                        <Text style={styles.subText}>메모</Text>
                                    </View>
                                    <View style={styles.modalCommonFlex4Wrap}>
                                    <Input 
                                        value={memo}
                                        placeholder={"10자 이내의 메모를 입력하세요"}
                                        placeholderTextColor={"#555"}
                                        maxLength={11}                                        
                                        onChangeText={text => setMemo(text)} 
                                        inputContainerStyle={styles.inputContainer}
                                        inputStyle={{color:'#555',fontSize:12}}                                        
                                    />
                                    </View>                                   
                                </View>
                            </View>                            
                        </View>
                        <View style={{height:100}} />
                    </ScrollView>
                    {
                        isMoreLoading &&
                        <MoreLoading isLoading={isMoreLoading} />
                    }
                    {
                        ( !CommonUtils.isEmpty(address) && !CommonUtils.isEmpty(addressName) && !CommonUtils.isEmpty(coinMaker) ) ?
                            <TouchableOpacity
                                onPress={addBookmark}
                                style={styles.clickAbleWrap}
                            >
                                <Text style={styles.actionText}>등록하기</Text>
                            </TouchableOpacity>                        
                            :
                            <View style={styles.emptyButtonWrap}>
                                <Text style={styles.actionText}>등록하기</Text>
                            </View>
                        }
                    <Modal 
                        isVisible={isModalVisible}
                        backdropOpacity={0.5}
                        deviceHeight={SCREEN_HEIGHT}
                        deviceWidth={SCREEN_WIDTH}
                        onBackdropPress={()=>setModalVisible(false)}
                        useNativeDriver={false}
                        useNativeDriverForBackdrop
                        //swipeDirection={['down']}
                        //onSwipeStart={(e)=> null}                        
                        //onSwipeMove={(e) => fn_hideMode(e)}                        
                        style={styles.modalStyle}
                        propagateSwipe={true}
                    >
                        <Animated.View style={[styles.modalContainer,{ marginTop:SCREEN_HEIGHT*0.3 ,height: animatedHeight }]}>            
                            <TouchableOpacity 
                                onPress={()=>setModalVisible(false)}
                                style={styles.modalTopBottomWrap}
                            >
                                <Icon
                                    name="drag-handle"
                                    style={{paddingRight:5}}
                                    size={CommonUtils.scale(30)}
                                    color="#fff"                        
                                />
                            </TouchableOpacity>
                            <View style={styles.modalDataWrap}>
                                
                                <View style={styles.modalCommonWrap}>
                                    <View style={{height:50,marginHorizontal:10}}>
                                        <Input 
                                            value={keyword}
                                            placeholder={"검색하기"}
                                            placeholderTextColor={"#555"}
                                            onChangeText={text => setKeyword(text)} 
                                            inputContainerStyle={{
                                                width:'100%',borderWidth:0,borderBottomColor:'#f7f7f7',
                                                backgroundColor:'#f7f7f7', borderRadius:10,paddingHorizontal:10
                                            }}
                                            inputStyle={{color:'#555',fontSize:15}}
                                            leftIcon={{ type: 'ant-design', name: 'search1', color:'#555', size:20 }}
                                        />
                                    </View>
                                    <ScrollView                            
                                        showsVerticalScrollIndicator={false}
                                        indicatorStyle={'white'}
                                        scrollEventThrottle={16}
                                        keyboardDismissMode={'on-drag'}                        
                                        style={{width:'100%',height:'100%'}}
                                        
                                    >
                                        <View style={styles.coinOuterWrap}>
                                            { 
                                            coinMakerList.map((item, idx) => {
                                                return (
                                                    <TouchableOpacity 
                                                        key={idx} style={styles.coinBoxWrap}
                                                        onPress={()=>selectCoinMaker(item)}
                                                    >
                                                        <Image source={{uri:item.img_url}} style={styles.iconWrap} resizeMode={"contain"} />
                                                        <Text style={styles.coinText}>{item.name}</Text>
                                                        <Text style={styles.coinText}>{item.code}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })}
                                            
                                        </View>
                                        <View style={{height:100}} />
                                    </ScrollView>
                                </View>
                            </View>                
                        </Animated.View>
                    </Modal>
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
    emptyButtonWrap : {
        position:'absolute',
        left:0,
        bottom:0,
        width:SCREEN_WIDTH,
        height: CommonUtils.isIphoneX() ? CommonUtils.scale(70) : CommonUtils.scale(50),
        backgroundColor:'#ccc',
        justifyContent:'center',
        alignItems:'center'
    },
    clickAbleWrap  : {
        position:'absolute',
        left:0,
        bottom:0,
        zIndex:10,
        width:SCREEN_WIDTH,
        height: CommonUtils.isIphoneX() ? CommonUtils.scale(70) : CommonUtils.scale(50),
        backgroundColor:'#000',
        justifyContent:'center',
        alignItems:'center'
    },
    actionText : {
        color:'#fff',      
        fontWeight:'bold',  
        fontSize: CommonUtils.scale(16)
    },
    coinOuterWrap : {
        marginVertical:10,
        marginHorizontal:20,
        flexDirection:'row',
        flexWrap:'wrap',
        justifyContent:'space-between',
        alignItems:'center'
    },
    coinBoxWrap : {
        justifyContent:'center',
        alignItems:'center',
        width:SCREEN_WIDTH/3-20,
        height:SCREEN_WIDTH/3-20,
        backgroundColor:'#f7f7f7',
        borderRadius:10,   
        marginBottom:10     
    },
    iconWrap : {
        width:25,
        height:25,
        marginBottom:10
    },
    iconWrap2 : {
        width:16,
        height:16,
        marginRight:5
    },
    coinSelectBoxWrap : {
        flexDirection:'row',
        justifyContent:'flex-end',
        alignItems:'center',
        paddingRight:15
    },
    modalStyle : {
        //position:'absolute',
        left:0,
        bottom:0,
        width:SCREEN_WIDTH,
        height:SCREEN_HEIGHT*0.7,
        zIndex:50,    
        justifyContent:'flex-end',
        margin: 0,
    },
    modalContainer : {
        flex:1,
        width:'100%',
        height:'100%',
    },
    modalTopBottomWrap : {
        height:40,
        justifyContent:'center',
        alignItems:'center'
    },
    modalDataWrap : {
        flex:1,
        paddingTop:20,
        backgroundColor:'#fff',
    },
    modalCommonWrap : {
        marginVertical:15,        
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
        color:'#222',
        fontWeight:'bold',
        fontSize: mConst.mainTitle,
        lineHeight: CommonUtils.scale(20),
    },
    subText : {
        color:'#555',      
        fontWeight:'500',  
        fontSize: CommonUtils.scale(13),
    },
    coinText :{ 
        color:'#555',
        fontWeight:'500',
        fontSize: CommonUtils.scale(13), 
        lineHeight: CommonUtils.scale(16),
    },
    modalFlexCommonWrap : {        
        flexDirection:'row',
        marginVertical:10,
        marginHorizontal:10,
        maxHeight:40,
    },
    modalCommonFlex1Wrap : {
        flex:1,
        justifyContent:'center',
        paddingLeft:10
    },
    modalCommonFlex4Wrap : {
        flex:4,
        alignContent:'center',
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
    buttonOuterWrap : {
        flex:1,
        flexDirection:'row',
        paddingVertical:20,
        justifyContent:'space-evenly'
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
        width:'45%',
        backgroundColor:'#aaa',
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
    },
    inputContainer : {        
        borderWidth:0,
        paddingHorizontal:10,        
        borderBottomColor:'#fff',
        backgroundColor:'#fff'
    }
  });

  export default BookMarkScreen;
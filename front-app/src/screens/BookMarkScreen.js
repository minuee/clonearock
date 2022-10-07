import React,{useState,useEffect,useRef,useCallback,useContext} from 'react';
import {Animated,TouchableOpacity,PixelRatio,StyleSheet,Alert,View,Image,Text,Dimensions,ActivityIndicator,ScrollView} from 'react-native';
import { Header,Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect,useIsFocused } from '@react-navigation/native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import localStorage from '../store/LocalStorage';
import CommonUtils from '../utils/CommonUtils';
import mConst from '../utils/Constants';
import MoreLoading from '../utils/MoreLoading';
const STORAGE_KEY = localStorage.WalletAddressBook;// '@Storage/Wallet';

const BookMarkScreen = (props) => {
    const isFocused = useIsFocused();
    const [isLoading, setLoading] = useState(true);
    const [isMoreLoading, SetIsMoreLoading] = useState(false);
    const [bookmarkList, setBookmarkList] = useState([]);
    const [message, setMessage] = useState(null);
        
    useEffect(() => {
        async function fetchData () {                
            const rdata = await AsyncStorage.getItem(STORAGE_KEY);            
            if ( !CommonUtils.isEmpty(rdata)) {                    
                setBookmarkList(JSON.parse(rdata))
            }else{
                setBookmarkList([])
            }
            setLoading(false)
        }
        fetchData();
    }, [])

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

    const handleDelete = (item) => {
        Alert.alert(
            mConst.appName,
            "주소록을 삭제하시겠습니까?",
            [
                {text: '네', onPress: () => handleDeleteAction(item)},
                {text: '아니오', onPress: () => console.log('Cancle')}
            ],
            { cancelable: true }
        ) 
    }

    const handleDeleteAction = async(sitem) => {   
        let newBookmarkList = bookmarkList.filter((item) => item.walletAddress != sitem.walletAddress ) 
        setBookmarkList(newBookmarkList);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newBookmarkList));
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

    renderListView = (item) => {        
        const RightSwipe = (progress, dragX) => {
            const scale = dragX.interpolate({
                inputRange: [-100, 0],
                outputRange: [0.7, 0],
              extrapolate: 'clamp',
            });
            return (
              <TouchableOpacity onPress={()=>handleDelete(item)}>
                <View style={styles.deleteBoxWrap}>
                  <Animated.Text style={{color:'#fff',fontSize:PixelRatio.roundToNearestPixel(20),transform: [{scale: scale}]}}>삭제</Animated.Text>
                </View>
              </TouchableOpacity>
            );
        }
 
        return (
            <Swipeable renderRightActions={RightSwipe}>
                <View style={styles.dataWrap}>
                    <View style={{flex:1,paddingVertical:5}}>
                        <Text style={styles.titleText}>
                            월렛이름 : {item.walletName} ({item.walletCoin.name})
                        </Text>
                    </View>
                    <View style={{flex:1,paddingVertical:5,flexDirection:'row',alignItems:'center',paddingRight:5}}>
                        <Image source={{uri:item.walletCoin.img_url}} style={styles.iconWrap2} resizeMode={"contain"} />
                        <Text style={styles.titleText}>{item.walletAddress}</Text>
                    </View>
                </View>
            </Swipeable>
        )
        
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
                        centerComponent={{ text: '주소록', style: { fontSize: mConst.navTitle,color: '#000' } }}                    
                        rightComponent={(
                            <View style={{flex:1,paddingRight:10,justifyContent:'center'}}>
                                
                            </View>
                        )}
                        containerStyle={{borderBottomWidth: 0}}
                    />  
                    <ScrollView>
                        <View style={{flex:1,marginVertical:10}}>
                            <Input 
                                value={message}
                                placeholder={"검색하기"}
                                placeholderTextColor={"#555"}
                                onChangeText={text => setMessage(text)} 
                                inputContainerStyle={{
                                    borderWidth:0,paddingHorizontal:10,borderBottomColor:'#f7f7f7',
                                    backgroundColor:'#f7f7f7', borderRadius:10
                                }}
                                inputStyle={{color:'#555'}}
                                leftIcon={{ type: 'ant-design', name: 'search1', color:'#555' }}
                            />
                        </View>
                        <TouchableOpacity 
                            style={styles.mainTitleWrap}
                            onPress={() => props.navigation.navigate('BookMarkAdd')}
                        >
                            <View style={{marginRight:5}}>
                                <Icon
                                    name="add-circle"
                                    size={25}
                                    color="#555"
                                    onPress={() => props.navigation.goBack()}
                                />
                            </View>
                            <Text style={styles.titleText}>주소록 추가하기</Text>
                        </TouchableOpacity>
                        <View style={styles.listWrap}>
                            <Text style={styles.titleText}>주소 목록<Text style={styles.redText}> {bookmarkList.length}</Text></Text>
                        </View>
                        <View style={styles.listDataWrap}>
                            {
                                bookmarkList.map((item,index) => (
                                    <View key={index}>
                                        { renderListView(item)}
                                    </View>
                                ))
                            }
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
    mainTitleWrap : {
        flex:1,
        marginHorizontal:20,
        flexDirection:'row',
        alignItems:'center'
    },
    titleText : {
        color:'#555',
        fontWeight:'bold',
        fontSize: mConst.mainTitle,
        lineHeight: CommonUtils.scale(20),
    },
    redText : {
        color: mConst.baseColor,
        fontWeight:'bold',
        fontSize: mConst.mainTitle,
        lineHeight: CommonUtils.scale(20),
    },
    listWrap : {
        flex:1,
        marginHorizontal:20,
        marginTop:20,
        justifyContent:'center'
    },
    listDataWrap : {
        flex:1,
        marginVertical:5,        
        justifyContent:'center'
    },
    dataWrap : {
        flex:1,
        paddingHorizontal:20,
        paddingVertical:10,
        backgroundColor:'#ebebeb',
        borderBottomColor:'#ccc',
        borderBottomWidth:1
    },
    iconWrap : {
        width:25,
        height:25,
        marginBottom:10
    },
    iconWrap2 : {
        width:18,
        height:18,
        marginRight:5
    },
    deleteBoxWrap : {
        backgroundColor:mConst.baseColor,
        justifyContent:'center',alignItems:'center',
        width:100,height:'100%'
    },
    
  });

  export default BookMarkScreen;
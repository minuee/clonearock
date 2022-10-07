import React,{useState,useEffect,useRef,useCallback,useContext} from 'react';
import {Alert,TouchableOpacity,SafeAreaView,StyleSheet,View,Image,Text,Dimensions,ActivityIndicator,ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();
import { ifIphoneX, getBottomSpace } from 'react-native-iphone-x-helper'
import { Header } from 'react-native-elements';

import CommonUtils from '../../utils/CommonUtils';
import mConst from '../../utils/Constants';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const MakeStep2Screen = (props) => {
    
    const [isLoading, setLoading] = useState(true);
    const [repairKeyWord, setRepairKeyWord] = useState([]);
    const [langSet, setlangSet] = useState( CommonUtils.isEmpty(props.route.params.langSet) ? 'en' : props.route.params.langSet);
    const [originData, setOriginData] = useState( CommonUtils.isEmpty(props.route.params.originData) ? null : props.route.params.originData);

    useEffect(() => {        
        const copiedObj = Object.assign([],props.route.params.data); 
        setRepairKeyWord(copiedObj);
        setTimeout(() => {        
            setLoading(false);
        }, 500); 
    }, []);     
 
    const setWallet = () => {
        Alert.alert(
            mConst.appName,
            '다음으로 진행하시겠습니까?',
            [
                {text: '네', onPress: () => actionSetWallet()},
                {text: '아니오', onPress: () => console.log('no')},
            ],
            {cancelable: false},
        );        
    }
    const actionSetWallet = async() => {
        const copiedObj2 = repairKeyWord;
        //console.log('repairKeyWord',copiedObj)
        props.navigation.navigate('MakeStep3Screen',{
            langSet,
            originData,
            repairKeyWord : copiedObj2
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
                                <View style={{height:5,width:'66%',backgroundColor:mConst.baseColor}}/>
                            </View>
                        </View>
                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Text style={styles.subText}><Text style={[styles.subText,{color:mConst.baseColor}]}>2</Text>/3</Text>
                        </View>
                    </View>
                    <View style={styles.titleBox}>
                        <View style={[styles.titleLeftBox,{marginTop:15}]}>
                            <Text style={styles.mainText}>복구단어 생성</Text>
                        </View>
                        <View style={[styles.titleLeftBox,{marginTop:15}]}>
                            <Text style={styles.subText}>화면에 표시되는 12개의 단어를</Text>
                            <Text style={styles.subText}>순서대로 메모하여 안전하게 보관하세요!</Text>
                        </View>
                        <View style={[styles.keywordWrap,{marginTop:25}]}>
                        {
                            repairKeyWord.map((item,index) => {
                                return (
                                    <View key={index} style={styles.themeWrap}>
                                        <Text style={styles.themeText}>{index+1}. {item.name}</Text>
                                    </View>
                                )
                            })
                        }                            
                        </View>
                    </View>      
                    <View style={{height:100}} />
                </ScrollView>              
                <TouchableOpacity
                    onPress={() => setWallet()}
                    style={styles.clickAbleWrap}
                >
                    <Text style={styles.actionText}>다음</Text>
                </TouchableOpacity>
                
            </View>
        )
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'#f7f7f7'
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
    keywordWrap : {
        flex:1,
        width:SCREEN_WIDTH*0.8,
        flexDirection:'row',
        flexWrap:'wrap'
    },
    themeWrap : {        
        width:'30%',
        marginRight:'3%',
        marginBottom:10,
        paddingVertical:10,
        paddingHorizontal:5,
        borderRadius:10,
        backgroundColor:'#fff',
        justifyContent:'center',
        alignItems:'center'
    },
    themeText : {
        color:'#555',
        fontSize: mConst.subTitle,
        letterSpacing:-1

    },
    mainText : {
        color:'#000',
        fontWeight:'bold',
        fontSize: mConst.mainTitle,
        lineHeight: CommonUtils.scale(22),
    },
    subText : {
        color:'#555',        
        fontSize: mConst.subTitle,
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
    clickAbleWrap  : {
        position:'absolute',
        left:0,
        bottom:0,
        width:SCREEN_WIDTH,
        ...ifIphoneX({
            height: CommonUtils.scale(60)
        }, {
            height: CommonUtils.scale(50)
        }),
        backgroundColor: mConst.baseColor,
        justifyContent:'center',
        alignItems:'center'
    },
    actionText : {
        color:'#fff',      
        fontWeight:'bold',  
        fontSize: CommonUtils.scale(16)
    }
  });

  export default MakeStep2Screen;
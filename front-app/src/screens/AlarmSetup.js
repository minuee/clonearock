import React,{useState,useEffect,useRef} from 'react';
import {StyleSheet,View,Text,ActivityIndicator,ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();
import { useFocusEffect,useIsFocused } from '@react-navigation/native';

import { Header,Switch,CheckBox } from 'react-native-elements';
import CommonUtils from '../utils/CommonUtils';
import mConst from '../utils/Constants';

const AlarmSetup = (props) => {

    const isFocused = useIsFocused();
    const [isLoading, setLoading] = useState(true);
    const refScrollView = useRef(null);   
    const [checked, setChecked] = useState(true);
    const [subChecked, setSubChecked] = useState(true);
    const [sub1Checked, setSub1Checked] = useState(true);
    const [sub2Checked, setSub2Checked] = useState(false);

    useEffect(() => {
        setLoading(false);
        if ( sub1Checked && sub2Checked) {
            setSubChecked(true);
        }else{
            setSubChecked(false);
        }
    }, []); 
    
    useEffect(() => {        
        if ( sub1Checked && sub2Checked) {
            setSubChecked(true);
        }else{
            setSubChecked(false);
        }
    }, [sub1Checked,sub2Checked]); 

    useEffect(() => {        
        if ( !isFocused ) { // blur            
            props.navigation.toggleDrawer();
        }        
    }, [isFocused]);
    
    const toggleSwitch = () => setChecked(previousState => !previousState);
    const toggleSwitch2 = () => setSubChecked(previousState => !previousState);

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
                                size={mConst.navTitle}
                                color="#000"
                                onPress={() => props.navigation.goBack()}
                            />
                        </View>
                    )}
                    centerComponent={{ text: '알림설정', style: { fontSize: mConst.navIcon,color: '#000' } }}
                    rightComponent={null}
                    containerStyle={{borderBottomWidth: 0}}
                />         
                <ScrollView 
                    ref={refScrollView}
                    scrollEventThrottle={100}
                    //onLayout={(e)=>getScrollViewSize(e)}
                    //onContentSizeChange={(w,h) => getContentHeight(w,h)}
                    //onScroll={(e) => handleScroll(e)}                    
                >
                    <View style={{flex:1,margin:20,flexDirection:'row'}}>
                        <View style={{flex:4,justifyContent:'center',}}>
                            <Text style={styles.mainText}>입출금 알림</Text>
                        </View>
                        <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                            <Switch
                                value={checked}
                                trackColor={{ true: "#767577", false:  mConst.baseColor  }}
                                thumbColor={checked ? "#f4f3f4" :  mConst.baseColor }
                                size={CommonUtils.scale(15)}
                                onValueChange={toggleSwitch}
                            />
                        </View>
                    </View>
                    <View style={{height:10,backgroundColor:'#ebebeb'}} />
                    <View style={{flex:1,margin:20,flexDirection:'row'}}>
                        <View style={{flex:4,justifyContent:'center',}}>
                            <Text style={styles.mainText}>광고성정보(Push) 수신동의</Text>
                        </View>
                        <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                            <Switch
                                value={subChecked}
                                trackColor={{ true: "#767577", false:  mConst.baseColor  }}
                                thumbColor={subChecked ? "#f4f3f4" :  mConst.baseColor }
                                size={CommonUtils.scale(15)}
                                onValueChange={toggleSwitch2}
                            />
                        </View>
                    </View>
                    <View style={{flex:1,marginHorizontal:20}}>
                        <Text style={styles.subText}>
                            본 설정은 해당 기기에서만 유효하며, 수신에 동의하시면 공지 및 이벤트 혜택 등의 알림을 받으실 수 있습니다.
                        </Text>
                    </View>
                    <View style={styles.checkBoxOuterWrap}>
                        <CheckBox                        
                            title='공지알림'
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checked={sub1Checked}
                            containerStyle={styles.checkBoxWrap}
                            onPress={() => setSub1Checked(!sub1Checked)}
                        />
                    </View>
                    <View style={styles.checkBoxOuterWrap}>
                        <CheckBox                        
                            title='이벤트/혜택 알림'
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            checked={sub2Checked}
                            containerStyle={styles.checkBoxWrap}
                            onPress={() => setSub2Checked(!sub2Checked)}
                        />
                    </View>

                    <View style={{height:100,backgroundColor:'#fff'}} />
                </ScrollView>               
            </View>
        )
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'#fff'
    },
    mainText : {
        color:'#000',
        fontWeight:'bold',
        fontSize: mConst.mainTitle,
        lineHeight: mConst.mainTitle*1.2,
    },
    subText : {
        color:'#555',
        fontWeight:'500',
        fontSize: mConst.subTitle,
        lineHeight: mConst.subTitle*1.2
    },
    checkBoxOuterWrap : {
        flex:1,
        marginHorizontal:10,
        marginVertical:10,
    },
    checkBoxWrap : {
        backgroundColor:'#fff',
        margin:0,
        padding:0,
        borderWidth:0,
    }
  });

  export default AlarmSetup;
import React,{useState,useEffect,useRef,useCallback,useContext} from 'react';
import {TouchableOpacity,Switch,Easing,StyleSheet,View,Image,Text,Dimensions,ActivityIndicator,ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();
import { useFocusEffect,useIsFocused } from '@react-navigation/native';
import { Header } from 'react-native-elements';
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';

import CommonUtils from '../utils/CommonUtils';
import mConst from '../utils/Constants';
import Pagination from '../utils/Pagination';

const DefaultPaginate = 4;
const BACON_IPSUM = 'Bacon ipsum dolor amet chuck turducken landjaeger tongue spare ribs. Picanha beef prosciutto meatball turkey shoulder shank salami cupim doner jowl pork belly cow. Chicken shankle rump swine tail frankfurter meatloaf ground round flank ham hock tongue shank andouille boudin brisket. ';


const BACON_IPSUM2 = '안녕하세요 (주)드림입니다.\n드림 월렛은 국내 휴대폰 번호로만 이용이 가능한 점 미리 양해 부탁드립니다.\n감사합니다.';
const ThemedListItem = [
    {id:1, code:'All', name:'전체'},
    {id:1, code:'App', name:'앱 이용'},
    {id:1, code:'Wallet', name:'지갑'},
    {id:1, code:'Reward', name:'리워드'},
    {id:1, code:'Point', name:'포인트'},
    {id:1, code:'Etc', name:'기타'},
]
const CONTENTS = [
    {
        title: '드림 월렛을 어떻게 다운 받나요?',
        theme : 'App',
        content: BACON_IPSUM,
      },
      {
        title: '드림 월렛을 해외번호로 이용할 수 있나요?',
        theme : 'App',
        content: BACON_IPSUM2,
      },
      {
        title: '사용하던 휴대폰 기기 또는 번호가 바뀌었습니다. 드림 월렛 사용 유지가 가능한가요?',
        theme : 'App',
        content: BACON_IPSUM,
      },
      {
        title: '제 명의의 휴대폰과 번호가 여러개 있습니다. 모두 드림 월렛을 다운 받을 수 있나요?',
        theme : 'App',
        content: BACON_IPSUM,
      },
      {
        title: '지갑을 삭제할 수 있나요?',
        theme : 'Wallet',
        content: BACON_IPSUM,
      },
      {
        title: '리워드를 삭제할 수 있나요?',
        theme : 'Reward',
        content: BACON_IPSUM,
      },
      {
        title: '포인트를 삭제할 수 있나요?',
        theme : 'Point',
        content: BACON_IPSUM,
      },
];
const FaqScreen = (props) => {
    const isFocused = useIsFocused();
    const [isLoading, setLoading] = useState(true);
    const refScrollView = useRef(null);   
    
    const [activeSections, setActiveSections] = useState([]);
    const [multipleSelect, setMultipleSelect] = useState(false);
    const [nowTheme, setNowTheme] = useState('All');
    const [contentData, setContentData] = useState(CONTENTS);

    useEffect(() => {        
        setTimeout(() => {        
            setLoading(false) 
        }, 1000); 
    }, []); 

    useEffect(() => {        
        if ( !isFocused ) { // blur
            setNowTheme('All');
            setActiveSections([])
            props.navigation.toggleDrawer();
        }        
    }, [isFocused]);

    const setSections = (sections) => {
        setActiveSections(sections.includes(undefined) ? [] : sections)
    };

    const _onPageChange = async(page) => {      
        
    }
    const renderHeader = (section, _, isActive) => {
        return (
            <Animatable.View
                duration={500}
                style={[styles.header, isActive ? styles.active : styles.inactive]}
                transition="backgroundColor"
            >
                <View style={styles.headerIconWrap}>
                    <Icon
                        name="help-outline"
                        size={CommonUtils.scale(18)}
                        color={isActive ? mConst.baseColor : '#ccc'} 
                    />
                </View>
                <View style={styles.headerTextWrap}>
                    <Text style={styles.headerText}>{section.title}</Text>                    
                </View>
                <View style={[styles.headerIconWrap,{alignItems:'flex-end'}]}>
                    <Icon
                        name={isActive ? "expand-less" : "expand-more"}
                        size={CommonUtils.scale(18)}
                        color={'#ccc'} 
                    />
                </View>
                
            </Animatable.View>
            );
      };

    const renderContent = (section, _, isActive) => {
        return (
            <Animatable.View
                duration={500}
                style={[styles.content, isActive ? styles.active : styles.inactive]}
                transition="backgroundColor"
            >
                <Animatable.Text 
                    animation={isActive ? 'bounceIn' : undefined}
                    style={styles.contentText}
                >
                    {section.content}
                </Animatable.Text>
            </Animatable.View>
        );
    }

    const updateTheme = (code) => {
        setNowTheme(code)
    }

    useFocusEffect(
        useCallback(() => {
            if ( nowTheme === 'All') {
                setContentData(CONTENTS)
            }else{
                const reData = CONTENTS.filter((item) => item.theme === nowTheme)
                setContentData(reData)
            }
        }, [nowTheme])
    );

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
                                size={mConst.navIcon}
                                color="#000"
                                onPress={() => props.navigation.goBack()}
                            />
                        </View>
                    )}
                    centerComponent={{ text: '자주 하는 질문', style: { fontSize: mConst.navTitle,color: '#000' } }}
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
                    <View style={styles.multipleToggle}>
                        <Text style={styles.multipleToggle__title}>Multiple Select?</Text>
                        <Switch
                            value={multipleSelect}
                            onValueChange={(a) => setMultipleSelect(a)}
                        />
                    </View>
                    <View style={styles.themeOuterWrap}>
                        <ScrollView 
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        >
                            {ThemedListItem.map((item,index) => {
                                return (
                                    <TouchableOpacity 
                                        key={index}
                                        onPress={()=>updateTheme(item.code)}
                                        style={index === 0 ? styles.themeWrap1 : styles.themeWrap2}
                                    >
                                        <Text style={nowTheme === item.code ? styles.themeText : styles.themeText2}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </View>
                    
                    <View style={styles.dataWrap}>
                        <Accordion
                            activeSections={activeSections}
                            sections={contentData}
                            touchableComponent={TouchableOpacity}
                            expandMultiple={multipleSelect}
                            renderHeader={renderHeader}
                            renderContent={renderContent}
                            duration={500}
                            onChange={setSections}
                            renderAsFlatList={false}
                        />
                    </View>
                    <View style={{flex:1,marginVertical:20}}>
                        <Pagination 
                            screenState={{
                                totalCount : contentData.length,
                                currentPage  : 1,
                                ismore  : true,
                                DefaultPaginate,
                                onPageChange :  (val) => _onPageChange(val)
                            }}
                            screenProps={props} 
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
        fontSize: CommonUtils.scale(15),
        lineHeight: CommonUtils.scale(19),
    },
    subText : {
        color:'#555',
        fontWeight:'500',
        fontSize: CommonUtils.scale(13),
        lineHeight: CommonUtils.scale(17),
    },
    themeOuterWrap : {
        flex:1,marginVertical:10,      
        marginHorizontal:20,  
    },
    themeWrap1 : {        
        paddingHorizontal:CommonUtils.scale(15),
        justifyContent:'center',
        alignItems:'center'
    },
    themeWrap2 : {        
        paddingHorizontal:CommonUtils.scale(15),
        justifyContent:'center',
        alignItems:'center',
        borderLeftWidth:1,
        borderLeftColor:'#ccc'
    },
    themeText : {
        color: mConst.baseColor,
        fontWeight:'bold',
        fontSize: CommonUtils.scale(14),
    },
    themeText2 : {
        color:'#555',        
        fontSize: CommonUtils.scale(14),
    },
    dataWrap : {
        flex:1,
        marginVertical:10,
        marginHorizontal:20,
        borderTopColor:'#000',
        borderTopWidth: 1.5
    },
    multipleToggle: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 30,
        alignItems: 'center',
    },
    multipleToggle__title: {
        fontSize: CommonUtils.scale(15),
        color:'#555',
        marginRight: 8,
    },
    header: {     
        alignItems:'flex-start',   
        backgroundColor: '#F5FCFF',
        paddingVertical: 15,
        paddingHorizontal:20,
        borderBottomColor:'#ccc',
        borderBottomWidth:0.5,
        flexDirection:'row'
    },
    headerIconWrap : {
        flex:0.5,
        justifyContent:'center',
        alignItems:'flex-start'
    },
    headerTextWrap : {
        flex:4,
        justifyContent:'center',
        alignItems:'flex-start'
    },
    headerText: {        
        fontSize: mConst.subTitle,
        color:'#000',
        fontWeight: '500',
    },
    headerDateText: {
        textAlign: 'center',
        color:'#555',
        fontSize: CommonUtils.scale(10),
        lineHeight: CommonUtils.scale(14),
        fontWeight: '500',
    },
    content: {
        padding: 20,
        backgroundColor: '#fff',
    },
    contentText : {
        color:'#555',
        fontSize: CommonUtils.scale(11),
        lineHeight: CommonUtils.scale(15),
        fontWeight: '500',
    },
    active: {
        backgroundColor: 'rgba(235,235,235,1)',
    },
    inactive: {
        backgroundColor: 'rgba(245,252,255,1)',
    },
    
  });

  export default FaqScreen;
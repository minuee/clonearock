import React,{useState,useEffect,useRef,useCallback,useContext} from 'react';
import {TouchableOpacity,Switch,StyleSheet,View,Text,ActivityIndicator,ScrollView,Linking} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();
import { Header } from 'react-native-elements';
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';
import { useIsFocused } from '@react-navigation/native';

import CommonUtils from '../utils/CommonUtils';
import mConst from '../utils/Constants';

import Pagination from '../utils/Pagination';
const DefaultPaginate = 4;

import HTMLConvert from '../utils/HtmlConvert/HTMLConvert';
const DEFAULT_PROPS = {
    onLinkPress: (evt, href) => { Linking.openURL(href); },
    debug: true
};

const NoticeScreen = (props) => {

    const isFocused = useIsFocused();
    const [isLoading, setLoading] = useState(true);
    const [cdata, setContents] = useState(null);
    const refScrollView = useRef(null);       
    const [activeSections, setActiveSections] = useState([]);
    const [multipleSelect, setMultipleSelect] = useState(false);

    const BACON_IPSUM = 'Bacon ipsum dolor amet chuck turducken landjaeger tongue spare ribs. Picanha beef prosciutto meatball turkey shoulder shank salami cupim doner jowl pork belly cow. Chicken shankle rump swine tail frankfurter meatloaf ground round flank ham hock tongue shank andouille boudin brisket. ';
    const mockupData = "<p>안녕하세요, 에이락 월렛 입니다.</p><p>2022. 05. 31 12:00PM부터 (구)에이락 월렛 서비스가 종료됩니다.&nbsp;</p><p>지금까지 (구)에이락 월렛 앱을 이용해 주신 모든 분들께 진심으로 감사의 말씀을 드리며, 서비스 종료에 대한 양해를 부탁드립니다.&nbsp;</p><p>해당일자 이후로 (구)에이락 월렛 앱의 업데이트 및 유지 보수가 중단 됩니다.&nbsp;</p><p>새로운 에이락 월렛 앱은 사용자 개선을 위하여 한층 더 업그레이드 되었으며 스토어에서 만나보실 수 있습니다.&nbsp;</p><p>사용하던 지갑은 에이락 안심서버에 복구단어 저장 혹은 개인적으로 복구단어를 보관하실 수 있으며, 리워드 토큰을 보유하신 고객 또한 위와 같은 방법으로 지갑을 저장하여 새로운 에이락 월렛에서 사용하실 수 있습니다.&nbsp;</p><p>에이락 안심서버에 복구단어가 저장되어 있지 않거나, 복구단어를 분실하셨을 경우에는 지갑 복구가 불가능합니다.&nbsp;</p><p>내가 받은 소중한 리워드를 지금 바로 안전하게 보관해보세요!&nbsp;</p><p>(구) 에이락 월렛을 사랑해주신 이용자 여러분 , 다시 한 번 감사드립니다.</p>";

    const CONTENTS = [
        {
            title: 'First Notice',
            date : '2022-04-11',
            content: mockupData,
          },
          {
            title: 'Second Notice',
            date : '2022-04-10',
            content: mockupData,
          },
          {
            title: 'Third Notice',
            date : '2022-04-09',
            content: mockupData,
          },
          {
            title: 'Fourth Notice',
            date : '2022-04-08',
            content: mockupData,
          },
          {
            title: 'Fifth Notice',
            date : '2022-04-09',
            content: mockupData,
          },
    ];
    useEffect(() => {
        let convertArray = [];        
        CONTENTS.forEach(function(element){         
            const reElement = (
                <HTMLConvert 
                    {...DEFAULT_PROPS}
                    html={element.content}
                />
            )
            convertArray.push({
                content : reElement,
                title : element.title,
                date : element.data
            })
        }); 
        setContents(convertArray)
        setLoading(false);        
        
    }, []); 

    useEffect(() => {        
        if ( !isFocused ) { // blur
            setActiveSections([])
            props.navigation.toggleDrawer();
        }        
    }, [isFocused]);

    const setSections = (sections) => {
        setActiveSections(sections.includes(undefined) ? [] : sections)
    }

    const _onPageChange = async(page) => {      
        console.log('_onPageChange_onPageChange',page) 
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
                        name="volume-up"
                        size={CommonUtils.scale(15)}
                        color={isActive ? mConst.baseColor : '#ccc'} 
                    />
                </View>
                <View style={styles.headerTextWrap}>
                    <Text style={styles.headerText}>{section.title}</Text>
                    <Text style={styles.headerDateText}>{section.date}</Text>
                </View>
                <View style={[styles.headerIconWrap,{alignItems:'flex-end'}]}>
                    <Icon
                        name={isActive ? "expand-less" : "expand-more"}
                        size={CommonUtils.scale(15)}
                        color={'#ccc'} 
                    />
                </View>                
            </Animatable.View>
        );
    }

    const renderContent = (section, _, isActive) => {
        return (
            <Animatable.View
                duration={500}
                style={[styles.content, isActive ? styles.active : styles.inactive]}
                transition="backgroundColor"
            >
                <Animatable.Text animation={isActive ? 'bounceIn' : undefined} style={{color:'#555'}}>
                    {section.content}
                </Animatable.Text>
            </Animatable.View>
        );
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
                    centerComponent={{ text: '공지사항', style: { fontSize:mConst.navTitle,color: '#000' } }}
                    rightComponent={null}
                    containerStyle={{borderBottomWidth: 0}}
                />         
                <ScrollView 
                    ref={refScrollView}
                    scrollEventThrottle={100}
                    showsVerticalScrollIndicator={false}
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
                    <View style={{flex:1,marginVertical:20}}>
                        <Accordion
                            activeSections={activeSections}
                            sections={cdata}
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
                                totalCount : CONTENTS.length,
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
        paddingVertical: 10,
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
        color:'#555',
        fontSize: CommonUtils.scale(10),
        lineHeight: CommonUtils.scale(14),
        fontWeight: '500',
    },
    content: {
        padding: 20,
        backgroundColor: '#fff',
    },
    active: {
        backgroundColor: 'rgba(235,235,235,1)',
    },
    inactive: {
        backgroundColor: 'rgba(245,252,255,1)',
    }
  });

  export default NoticeScreen;
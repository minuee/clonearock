import React, {useContext} from 'react';
import {StyleSheet, Platform,Text, View, TouchableOpacity, ScrollView,Dimensions, StatusBar} from 'react-native';
import scale from '../utils/Scale';
import {Icon, Header, ListItem} from 'react-native-elements';

import mConst from '../utils/Constants';

const CustomDrawer = (props) => {   
    //console.log('CustomDrawer',isIphoneX())
    return (
        <View style={{...styles.drawerView}}>
            <Header                
                backgroundColor="#e5293e"
                statusBarProps={{translucent: true, backgroundColor: 'transparent', barStyle: 'light-content', animated: true}}
                leftComponent={{text: "메뉴", style: {fontSize: mConst.navTitle, color: 'white'}}}
                centerComponent={null}
                rightComponent={{
                    icon: 'close',
                    type: 'ionicon',
                    size: mConst.navIcon,
                    color: 'white',
                    onPress: () => props.navigation.toggleDrawer(),
                }}
                containerStyle={{borderBottomWidth: 0}}
            />
            <View style={styles.menuWrap}>
                <TouchableOpacity 
                    onPress={()=>props.navigation.navigate('WalletScreen')}
                    style={styles.menuDataWrap}
                >
                    <Icon
                        name="wallet-outline"
                        type='ionicon'
                        style={{paddingRight:5}}
                        size={ mConst.navIcon}
                        color="white"
                    />
                    <Text style={styles.menuText}>지갑</Text>
                </TouchableOpacity>
                <View style={styles.menuTermWrap}>
                    <Text style={styles.menuText}>|</Text>
                </View>
                <TouchableOpacity 
                    onPress={()=>props.navigation.navigate('HomeScreen')}
                    style={styles.menuDataWrap}
                >
                    <Icon
                        name="home"
                        type='ionicon'
                        style={{paddingRight:5}}
                        size={mConst.navIcon}
                        color="white"
                    />
                    <Text style={styles.menuText}>홈</Text>
                </TouchableOpacity>
                <View style={styles.menuTermWrap}>
                    <Text style={styles.menuText}>|</Text>
                </View>
                <TouchableOpacity 
                    onPress={()=>props.navigation.navigate('RewardScreen',{screenState:{tabIndex:1}})}
                    style={styles.menuDataWrap}
                >
                    <Icon
                        name="sync-circle-outline"
                        type='ionicon'
                        style={{paddingRight:5}}
                        size={ mConst.navIcon}
                        color="white"
                    />
                    <Text style={styles.menuText}>리워드</Text>
                </TouchableOpacity>

            </View>
            <ScrollView style={{...styles.drawerView__MenuView}} showsVerticalScrollIndicator={false}>
                <ListItem
                    bottomDivider={true}
                    containerStyle={styles.listItemBox}
                    onPress={() => {
                        props.navigation.navigate('IntruduceScreen');
                    }}
                    delayPressIn={0}
                >
                    <ListItem.Chevron name="finger-print" type="ionicon" size={mConst.mainTitle} color="#888888" />
                    <ListItem.Content>
                        <ListItem.Title style={{fontSize: mConst.mainTitle, color: '#888888'}}>서비스안내</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem
                    bottomDivider={true}
                    containerStyle={styles.listItemBox}
                    onPress={() => props.navigation.navigate('NoticeScreen')}
                    delayPressIn={0}
                >
                    <ListItem.Chevron name="ios-football" type="ionicon" size={mConst.mainTitle} color="#888888" />
                    <ListItem.Content>
                        <ListItem.Title style={{fontSize: mConst.mainTitle, color: '#888888'}}>공지사항</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem
                    bottomDivider={true}
                    containerStyle={styles.listItemBox}
                    onPress={() => props.navigation.navigate('FaqScreen')}
                    delayPressIn={0}
                >
                    <ListItem.Chevron name="grid" type="ionicon" size={mConst.mainTitle} color="#888888" />
                    <ListItem.Content>
                        <ListItem.Title style={{fontSize: mConst.mainTitle, color: '#888888'}}>자주 묻는 질문</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem
                    bottomDivider={true}
                    containerStyle={styles.listItemBox}
                    onPress={() => props.navigation.navigate('SlideAnimation')}
                    delayPressIn={0}
                >
                    <ListItem.Chevron name="swap-horizontal" type="ionicon" size={mConst.mainTitle} color="#888888" />
                    <ListItem.Content>
                        <ListItem.Title style={{fontSize: mConst.mainTitle, color: '#888888'}}>이벤트</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem
                    bottomDivider={true}
                    containerStyle={styles.listItemBox}
                    onPress={() => props.navigation.navigate('BookMarkScreen')}
                    delayPressIn={0}
                >
                    <ListItem.Chevron name="bar-chart" type="ionicon" size={mConst.mainTitle} color="#888888" />
                    <ListItem.Content>
                        <ListItem.Title style={{fontSize: mConst.mainTitle, color: '#888888'}}>주소록 관리</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
                <ListItem
                    bottomDivider={true}
                    containerStyle={styles.listItemBox}
                    onPress={()=>props.navigation.navigate('AlarmSetup')}
                    delayPressIn={0}
                >
                    <ListItem.Chevron name="language" type="ionicon" size={mConst.mainTitle} color="#888888" />
                    <ListItem.Content>
                        <ListItem.Title style={{fontSize: mConst.mainTitle, color: '#888888'}}>알림 설정</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({
    drawerView: {
        backgroundColor: '#fff',
        flex: 1,
        
        
    },
    containerDrawer: {
        margin: 0, marginRight: '30%'
    },
    drawerView__CloseView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: scale(15),
        backgroundColor: '#e5293e',
    },
    drawerView__MenuView: {flex: 1, backgroundColor: 'white'},
    closeView__SignOut: {
        fontWeight:'bold',
        fontSize: scale(18),
        color: 'white',
    },
    menuText : {
        fontWeight:'bold',
        fontSize: scale(15),
        color: 'white',
    },
    menuWrap : {        
        backgroundColor: '#e5293e',
        marginVertical:30,
        marginHorizontal:20,
        borderRadius:10,
        paddingVertical:5,
        flexDirection:'row',
        justifyContent:'center'
    },
    menuDataWrap : {
        paddingVertical:15,
        paddingHorizontal:15,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    menuTermWrap : {
        paddingVertical:15,
        paddingHorizontal:5,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    avatarView: {
        padding: scale(15),
        flexDirection: 'row',
        // justifyContent: 'center',
        alignItems: 'flex-end',
    },
    listItemBox : {
        paddingVertical: scale(15),
        paddingHorizontal:scale(20)
    }
});


export default CustomDrawer;
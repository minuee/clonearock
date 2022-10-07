import React from 'react';
import { StyleSheet, Text, View ,ScrollView ,Button } from 'react-native';
import { Header , ListItem, Avatar  } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
Icon.loadFont();

import CommonUtils from '../utils/CommonUtils';
import mConst from '../utils/Constants';

const NotofiList = [
    {
        idx : 1,
        name: '공지공지공지공지공지타이틀',
        avatar_url: 'https://www.mywebtuts.com/user-defualt-images.jpg',
        date : '2022-04-11',
        subtitle: '공지공지공지내용내용내용'
    },
    {
        idx : 2,
        name: '공지공지공지공지공지타이틀',
        avatar_url: 'https://www.mywebtuts.com/user-defualt-images.jpg',
        date : '2022-04-12',
        subtitle: '공지공지공지내용내용내용'
    },
    {
        idx : 3,
        name: '공지공지공지공지공지타이틀',
        avatar_url: 'https://www.mywebtuts.com/user-defualt-images.jpg',
        date : '2022-04-13',
        subtitle: '공지공지공지내용내용내용'
    },
    {
        idx : 4,
        name: '공지공지공지공지공지타이틀',
        avatar_url: 'https://www.mywebtuts.com/user-defualt-images.jpg',
        date : '2022-04-14',
        subtitle: '공지공지공지내용내용내용'
    },
    {
        idx : 5,
        name: '공지공지공지공지공지타이틀',
        avatar_url: 'https://www.mywebtuts.com/user-defualt-images.jpg',
        date : '2022-04-15',
        subtitle: '공지공지공지내용내용내용'
    }
]

const NotificationList = (props) => {

    const moveDetail = (item) => {
        props.navigation.navigate("NotificationDetail",{
            targetIdx : item.idx
        })
    }
    
    return (
        <View style={styles.container}>
            <Header
                backgroundColor="#e5293e"
                statusBarProps={{translucent: true, backgroundColor: 'transparent', barStyle: 'light-content', animated: true}}
                leftComponent={(
                    <View style={{flex:1,paddingLeft:10,justifyContent:'center'}}>
                        <Icon
                            name="arrow-back-ios"                      
                            size={mConst.navIcon}
                            color="white"
                            onPress={() => props.navigation.goBack()}
                        />
                    </View>
                )}
                centerComponent={{text:'알림 리스트',style:{fontSize: mConst.navTitle,color:'#fff'}}}
                rightComponent={null}
                containerStyle={{borderBottomWidth: 0}}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                indicatorStyle={'white'}
                scrollEventThrottle={16}
                keyboardDismissMode={'on-drag'}
                style={{width:'100%',backgroundColor:'#fff'}}
            >
                <View style={styles.mainbox}>
                    {
                        NotofiList.map((item, i) => (
                            <ListItem key={i} bottomDivider onPress={()=> moveDetail(item)}>
                                <Avatar source={{uri: item.avatar_url}} />
                                <ListItem.Content>
                                    <ListItem.Title style={styles.mainText}>{item.name}</ListItem.Title>
                                    <ListItem.Subtitle style={styles.subText}>{item.date}</ListItem.Subtitle>
                                </ListItem.Content>
                            </ListItem>
                        ))
                    }
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    textinfo:{
        margin:10, 
        textAlign: 'center',
        fontSize: 17,    
    },
    mainText : {
        color:'#000',
        fontWeight:'bold',
        fontSize: CommonUtils.scale(13),
        lineHeight: CommonUtils.scale(22),
    },
    subText : {
        color:'#555',      
        fontWeight:'500',  
        fontSize: CommonUtils.scale(10),
    },
});

export default NotificationList;
import React,{ useState, useCallback,useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import CommonUtils from '../utils/CommonUtils';
import UserTokenContext from '../store/UserTokenContext';
const intTimer = 1000*30;//30s

export default function GetCurrenccy(props) {
    const {setUserInfo} = useContext(UserTokenContext);
    const [currentCurreny, setcurrentCurreny] = useState('0');

    async function getCurentCurreny() {
        fetch('https://api.coinone.co.kr/ticker?currency=eth&quotes=KRW', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'GET',
            body: null,
        })
        .then(res => res.json()) // 이런변환을 안하려면 axios를 설치후 사용하면 된다.
        .then(result => {
            if ( !CommonUtils.isEmpty(result)) {
                //console.log('result', result)
                setcurrentCurreny(result.first),
                setUserInfo({
                    currencyData : { eth : result.first }
                })
            }
        })
    }

    useFocusEffect(
        useCallback(() => {
            
            getCurentCurreny();            
            const getCurentCurrenyInterval = setInterval(() => {
                getCurentCurreny();
            }, intTimer);

            return () => {
                clearInterval(getCurentCurrenyInterval);
            };
        }, [])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{currentCurreny}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color:'#555',
        fontSize: 10,
        fontWeight: 'normal',
    },
    redtitle: {
        fontSize: 10,
        color:'#ff0000',
        fontWeight: 'bold',
    },
});

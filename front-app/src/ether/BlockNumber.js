import React,{ useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';

import Web3 from 'web3';
const  web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/4d3cc561e76c4fd0b1c6a200c1a72bca'));

const intTimer = 1000*15;
export default function BlockNumberScreen(props) {

    // BlockNumber component has a 'currentBlockNumber' state
    const [currentBlockNumber, setCurrentBlockNumber] = useState('...loading');

    // 'getBlockNumber' method works
    // 1) get current block number from klaytn node by calling 'caver.klay.getBlockNumber()'
    // 2) set 'currentBlockNumber' state to the value fetched from step 1)
    async function getBlockNumber() {
        web3.eth.getBlockNumber(function(err, rtn) {
            if(err) return console.log(err);
            let latest_block_number = rtn;            
            setCurrentBlockNumber(latest_block_number);
        });
        
    }

    // 'react-navigation' 라이브러리 사용시 'unmount'가 호출되지 않는 이슈가 있음
    // 'useFocusEffect' 라이브러리를 사용해 우회 적용 202205201724 12281806
    useFocusEffect(
        useCallback(() => {
            // Do something when the screen is focused
            getBlockNumber();
            // call 'getBlockNumber' method intervally
            const getBlockNumberInterval2 = setInterval(() => {
                getBlockNumber();
            }, intTimer);

            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
                // clear interval
                //console.log('clearInterval')
                clearInterval(getBlockNumberInterval2);
            };
        }, [])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Block No. <Text style={styles.redtitle}>{currentBlockNumber}</Text></Text>
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
        fontSize: 20,
        fontWeight: 'normal',
    },
    redtitle: {
        fontSize: 20,
        color:'#ff0000',
        fontWeight: 'bold',
    },
});

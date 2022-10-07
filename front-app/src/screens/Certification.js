import React, {useEffect, useState} from 'react';
import {TouchableOpacity, ActivityIndicator,Platform, Dimensions, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import IMP, { IMPConst } from 'iamport-react-native';

import CommonUtils  from '../utils/CommonUtils';
import mConst  from '../utils/Constants';
import MoreLoading from '../utils/MoreLoading';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const Certification = (props) => {    
    const [isSending, setSending] = useState(false);
    const [data, setData] = useState(null);
    /* [필수입력] 본인인증에 필요한 데이터를 입력합니다. */
    const dataTmp = {
        merchant_uid: `mid_${new Date().getTime()}`,
        company: '드림시큐리티',
        carrier: 'SKT',
        name: '노성남',
        phone: '01062880183',
        //m_redirect_url : IMPConst.M_REDIRECT_URL
    };

    useEffect(() => {    
        setData({
            merchant_uid: `mid_${new Date().getTime()}`,
            company: '드림시큐리티',
            carrier: 'SKT',
            name: props.route.params.screenState.userName,
            phone: props.route.params.screenState.userPhone,
        })
    }, [props.route.params]);

    /* 3. 콜백 함수 정의하기 */
    const callbackCerti = (response) => {
        setSending(true);
        /* callbackCerti {"imp_uid": "imp_388153732768", "success": "true"} */        
        const {success,imp_uid} = response;
        //console.log('successsuccesssuccess',typeof success)
        if (success == 'true' ) {
            if ( !CommonUtils.isEmpty(imp_uid)) {
                //console.log('본인인증 성공');
                getToServer(imp_uid)
            }else{
                //console.log('본인인증 실패111111');
                setSending(false);
                CommonUtils.fn_call_toast("본인인증중 오류가 발생하였습니다.");
                props.navigation.goBack();
            }              
        } else {      
            setSending(false);
            //console.log('본인인증 실패2222222');
            CommonUtils.fn_call_toast(`본인인증 실패`);
            props.navigation.goBack();
        }
    }

    const getToServer = async(imp_uid) => {
        //console.log('getToServer',imp_uid);
        try{
            fetch(Platform.OS === 'ios' ? 'http://127.0.0.1:3001/certi-view/' + imp_uid : 'http://10.0.2.2:3001/certi-view/' + imp_uid, {
                headers: {
                    'Content-type': 'application/json'
                },
                method: 'GET',
                body: null,
            })
            .then(res => res.json())
            .then(result => {
                //console.log('getToServer .result',result);
                setSending(false);
                /* 인증 완료된 페이지로 이동한다 */
                props.navigation.navigate('PinCodeScreen');
            });
        }catch(e){
            console.log('eeeeee',e);
            setSending(false);
            CommonUtils.fn_call_toast('네트워크 오류입니다.');
            props.navigation.goBack();
        }
    }

    if ( CommonUtils.isEmpty(props.route.params.screenState)) {

    }else{
        if ( CommonUtils.isEmpty(data)) {
            return (
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <ActivityIndicator />
                </View>
              )
        }else{
            return (
                <SafeAreaView style={styles.container}>
                    <IMP.Certification
                        userCode={mConst.storeCode}  // 가맹점 식별코드
                        //tierCode={'AAA'}      // 티어 코드: agency 기능 사용자에 한함
                        loading={<MoreLoading isLoading={true} />} // 로딩 컴포넌트
                        data={data}
                        callback={callbackCerti}   // 본인인증 종료 후 콜백                    
                    />
                    { 
                    isSending && 
                    <View style={styles.fixedContainer}>
                        <MoreLoading isLoading={isSending} />
                    </View>
                    }
                </SafeAreaView>
            );
        }
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    fixedContainer : {
        flex:1,
        width:SCREEN_WIDTH,
        height : SCREEN_HEIGHT,
        justifyContent:'center',
        alignItems:'center'
    },
});

export default Certification;

/* 아임포트 네이버로 본인인증시 
{
  "code": 0,
  "message": null,
  "response": {
    "birth": 325695600,
    "birthday": "1980-04-28",
    "certified": true,
    "certified_at": 1658363757,
    "foreigner": false,
    "foreigner_v2": null,
    "gender": null,
    "imp_uid": "imp_429704826404",
    "merchant_uid": "mid_1658363703131",
    "name": "노성남",
    "origin": "about:blank",
    "pg_provider": "inicis_unified",
    "pg_tid": "INISA_MIIiasTest202207210935050850019688",
    "phone": "01062880183",
    "unique_in_site": null,
    "unique_key": "KZmz1fTfmvPUvcLqzlmxYKRzV/d+SJiaXYskR/srcTT5p6fKIYQcG+xTpfxrBvDRmWgihlJxhB8VmNAcCP5IRg=="
  }
}
아임포트 금융인증
{
  "code": 0,
  "message": null,
  "response": {
    "birth": 325695600,
    "birthday": "1980-04-28",
    "certified": true,
    "certified_at": 1658378306,
    "foreigner": false,
    "foreigner_v2": null,
    "gender": null,
    "imp_uid": "imp_131244650172",
    "merchant_uid": "mid_1658378244623",
    "name": "노성남",
    "origin": "about:blank",
    "pg_provider": "inicis_unified",
    "pg_tid": "INISA_MIIiasTest202207211337248562223487",
    "phone": "01062880183",
    "unique_in_site": null,
    "unique_key": "KZmz1fTfmvPUvcLqzlmxYKRzV/d+SJiaXYskR/srcTT5p6fKIYQcG+xTpfxrBvDRmWgihlJxhB8VmNAcCP5IRg=="
  }
}
*/
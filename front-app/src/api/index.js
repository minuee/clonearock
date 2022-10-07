import CommonUtil from '../utils/CommonUtils';
export const apiObject = {

    // 페이징정보 조회 
    API_getCommonCode : async(url,token) => {        
        let returnCode = {code:'9999'};        
        await CommonUtil.callAPI( url,{
            method: 'GET',
            headers: new Headers({
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=UTF-8',
               }),
            body: null
        },10000).then(response => {
            if ( !CommonUtil.isEmpty(response) ) {
                returnCode = {code:'0000',data:response}
            }else if ( response.statusCode == '401' && response.error == 'Unauthorized' ) {
                returnCode = {code:'4001'}
            }else{
                returnCode = {code:'9999',msg:response.message}
            }
         })
        .catch(err => {
            console.log('errerrerr', err);
        });
        return returnCode;
    },    

    // 페이징정보 조회 
    API_getPageList : async(props,url,token,sendData = null) => {
        let returnCode = {code:'9999'};
        await CommonUtil.callAPI( url,{
            method: 'GET', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'ApiKey' : token
            }), 
            body: null
        },10000).then(response => {            
            if ( !CommonUtil.isEmpty(response) ) {
                returnCode = {code:'0000',data:response}
            }else if ( response.statusCode == '401' && response.error == 'Unauthorized' ) {
                returnCode = {code:'4001'}
            }else{
                returnCode = {code:'9999',msg:response.message}
            }     
        })
        .catch(err => {
            console.log('err', err);
        });        
        return returnCode;
    },

    // 기본상세조회 
    API_getDetailDefault : async(props,url,token) => {        
        let returnCode = {code:'9999'};
        await CommonUtil.callAPI( url,{
            method: 'GET', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'ApiKey' : token
            }), 
            body: null
        },10000).then(response => {
            if ( !CommonUtil.isEmpty(response) ) {
                returnCode = {code:'0000',data:response}
            }else if ( response.statusCode == '401' && response.error == 'Unauthorized' ) {
                returnCode = {code:'4001'}
            }else{
                returnCode = {code:'9999',msg:response.message}
            }   
        })
        .catch(err => {
            console.log('err', err);
        });        
        return returnCode;
    },
   
    //공통등록
    API_registCommon : async(url,token,sendData) => {     
        let returnCode = {code:'9999'};
        console.log('sendData',sendData)
        await CommonUtil.callAPI( url,{
            method: 'POST', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'ApiKey' : token
            }), 
            body: JSON.stringify(sendData)
        },10000).then(response => {            
            if ( !CommonUtil.isEmpty(response) ) {
                returnCode = {code:'0000',data:response}
            }else if ( response.statusCode == '401' && response.error == 'Unauthorized' ) {
                returnCode = {code:'4001'}
            }else{
                returnCode = {code:'9999',msg:response.message}
            }         
        })
        .catch(err => {
            console.log('err', err);
        });        
        return returnCode;
    },
    //공통수정
    API_updateCommon : async(url,token,sendData) => {     
        let returnCode = {code:'9999'};
        await CommonUtil.callAPI( url,{
            method: 'PUT', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'ApiKey' : token
            }), 
            body: JSON.stringify(sendData)
        },10000).then(response => {
            if ( !CommonUtil.isEmpty(response) ) {
                returnCode = {code:'0000',data:response}
            }else if ( response.statusCode == '401' && response.error == 'Unauthorized' ) {
                returnCode = {code:'4001'}
            }else{
                returnCode = {code:'9999',msg:response.message}
            }   
        })
        .catch(err => {
            console.log('err', err);
        });        
        return returnCode;
    },
    //공통패치
    API_patchCommon : async(url,token,sendData) => {     
        let returnCode = {code:'9999'};
        await CommonUtil.callAPI( url,{
            method: 'PATCH', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'ApiKey' : token
            }), 
            body: JSON.stringify(sendData)
        },10000).then(response => {
            if ( !CommonUtil.isEmpty(response) ) {
                returnCode = {code:'0000',data:response}
            }else if ( response.statusCode == '401' && response.error == 'Unauthorized' ) {
                returnCode = {code:'4001'}
            }else{
                returnCode = {code:'9999',msg:response.message}
            }   
        })
        .catch(err => {
            console.log('err', err);
        });        
        return returnCode;
    },
    //공통삭제
    API_removeCommon : async(url,token,sendData) => {     
        let returnCode = {code:'9999'};
        await CommonUtil.callAPI( url,{
            method: 'DELETE', 
            headers: new Headers({
                Accept: 'application/json',                
                'Content-Type': 'application/json; charset=UTF-8',
                'ApiKey' : token
            }), 
            body: CommonUtil.isEmpty(sendData) ? null : JSON.stringify(sendData)
        },10000).then(response => {
            if ( !CommonUtil.isEmpty(response) ) {
                returnCode = {code:'0000',data:response}
            }else if ( response.statusCode == '401' && response.error == 'Unauthorized' ) {
                returnCode = {code:'4001'}
            }else{
                returnCode = {code:'9999',msg:response.message}
            }   
        })
        .catch(err => {
            console.log('err', err);
        });        
        return returnCode;
    },

   
};


'use strict';
let express = require('express');
const utils = require('../lib/utils');
const iamport = require("../lib/iamport");

let route = express.Router();

let CryptoJS = require("crypto-js");

let controller = {
    'common'    : require('../controller/index'),
};
let models = {
    'common'    : require('../model/index'),
};

/**
 * @swagger
 * paths:
 *  /test:
 *    get:
 *      summary: "접속 테스트"
 *      description: "서버에 접속이 됬는데 "
 *      tags: [Test]
 *      responses:
 *        "200":
 *          description: 접속 테스트
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    ok:
 *                      type: boolean
 *                    users:
 *                      type: object
 *                      example:    
 *                            { "code": 1000, "message": "접속성공" }
 */

route.get('/test', async function(req, res) {    
    const result = true;
    if ( result ) { 
        res.send({
            'code': 200,
            'message': '접속테스트',
            'desc': 'success',
            'data' : null 
        });
    }else{
        res.send({
            'code': 200,
            'message': '접속테스트',
            'desc': 'failed',
            'data' : result
        });
    }
});

/**
 * 트랜잭션 로그 저장
*/
route.post('/trans/add', async function(req, res) {
    //console.log('req.body', typeof req.body);
    //console.log('req.body22', req.body);
    let wresult = await models.common.saveTransactionData(req.body);
    //console.log('result',wresult);
    if ( wresult ) { 
        res.send({
            'code': 200,
            'desc': 'success',
        });
    }else{
        res.send({
            'code': 200,
            'desc': 'failed',
        });
    }
});

/**
 * 트랜잭션 로그 조회 from redis
*/
route.get('/trans/list', async function(req, res) {    
   /*  console.log('req.query.code',req.query.boan);
    const strPhoneNo = req.query.boan;
    const strSecretKey = "dreamsecurity";
    const strEncrypt = CryptoJS.AES.decrypt(strPhoneNo , strSecretKey);
    const decrypted = strEncrypt.toString(CryptoJS.enc.Utf8);
    console.log(" -decrypted:"+ decrypted.toString());    

    //create salt from cryptojs   
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    console.log('salt',salt);
    const key128Bits = CryptoJS.PBKDF2("Secret Passphrase", salt, {
        keySize: 128 / 32
    });
    console.log('key128Bits',key128Bits.toString());
    const key256Bits = CryptoJS.PBKDF2("Secret Passphrase", salt, {
        keySize: 256 / 32
    });
    console.log('key256Bits',key256Bits.toString());
    const key512Bits = CryptoJS.PBKDF2("Secret Passphrase", salt, {
        keySize: 512 / 32
    });
    console.log('key512Bits',key512Bits.toString());
    const key512Bits1000Iterations = CryptoJS.PBKDF2("Secret Passphrase", salt, {
        keySize: 512 / 32,
        iterations: 1000
    });
    console.log('key512Bits1000Iterations',key512Bits1000Iterations.toString()); */

    const result = await models.common.getAllTransactionList(req.query.code);
    //console.log('result',result);
    if ( result ) { 
        res.send({
            'code': 200,
            'message': '리스트 조회성공',
            'desc': 'success',
            'data' : result
        });
    }else{
        res.send({
            'code': 200,
            'message': '리스트 조회실패',
            'desc': 'failed',
            'data' : []
        });
    }
});

/* 본인인증 정보조회 */
// 본인인증 성공에 따라 조회 2022.07.20 추가 by noh.sn
route.get("/certi-view/:imp_uid", async function (req, res) {  
    //const imp_uid = isNull(req.body.imp_uid, null);
    //console.log('req.params',req.params)
    const imp_uid = utils.isNull(req.params.imp_uid, null);
    //console.log('imp_uid',imp_uid)
    if ([imp_uid].includes(null)) {
      res.status(400).send({ success: false, error: "bad parameter" });
      return;
    }
    try {
      // 인증 토큰 발급 받기
      const getToken = await iamport.getAccessToken();
      
      const { access_token } = getToken.data.response; // 인증 토큰
      console.log('access_token',access_token)
      // 개인정보 조회
      const response = await iamport.getAuthCerificate({
        imp_uid,
        access_token
      });
  
      const paymentResult = response.data;
      if ( paymentResult?.response.success ) {
        res.send({
            success: true,
            info : paymentResult
        });
    }else{
        res.send({
            success: false,
            info : null
        });
    }
      
    } catch (error) {
      console.error(error);    
      res.status(500).send({
        success: false,
        error: String(error)
      });
    }
});

/* react native webview body test */
route.post('/rntest', async function(req, res) {    
    console.log('req.body', typeof req.body);
    console.log('req.body22', req.body);
    res.status(200).render("404.html");
    /* res.send({
        'code': 200,
        'message': '접속테스트',
        'desc': 'success',
        'data' : req.body 
    });     */
});

module.exports = route;
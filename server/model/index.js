'use strict';

let _ = require('underscore');
const utils = require('../lib/utils');
const res = require('express/lib/response');

// database 연결
/* mysql not use
const mysql      = require('mysql');
const dbconfig   = require('../lib/database');
const dbconnection = mysql.createConnection(dbconfig.mysql);
dbconnection.connect();
 dbconnection.query('SELECT * from Users', (error, rows, fields) => {
  if (error) throw error;
  //console.log('User info is: ', rows);
}); 
*/

let Common = function() {
    this.prefix = 'dreamsecurity.com';
};

/** save room 
 * 
 * @param {*} req 
 * @param {*} callback 
 * @returns 
 */

Common.prototype.saveRoomData = async function(req, callback)
{
    const { user_id,user_name,room } = req;  //사용자 ID
    //console.log('saveRoomData',  user_id,user_name,room )
    const query = `INSERT INTO rooms(room_id , reg_date) values('`+room+`', DEFAULT) ON DUPLICATE KEY UPDATE mod_date = DEFAULT
    `;
    dbconnection.query(query, (error, result) => {
        if (error) {         
            //console.log('saveRoomData error: ', error);   
            return false
        }else{
            //console.log('saveRoomData is: ', result);
            return result.insertId
        }
      });
}

/** save room 
 * 
 * @param {*} req 
 * @param {*} callback 
 * @returns 
 */

 Common.prototype.saveRoomRedis = async function(req, callback)
 {
    let self = this;
    const { user_id,user_name,room } = req;  //사용자 ID
    let hash = `${self.prefix}:room`;
    const isexist = await redis.hexists(hash, room);
    //console.log('saveRoomRedis isexist', isexist)
    if ( isexist ===  0) {
        //console.log('saveRoomRedis hash 11111: ', hash);
        //redis.hexists(hash, room,  function(err) {        
            redis.hmset(hash, room , room,  function() {
                //console.log('saveRoomRedis hash 2222: ', hash);   
                return room;
            });
        //});
    }else{
        return true;
    }

 }

 /** save room user
 * 
 * @param {*} req 
 * @param {*} callback 
 * @returns 
 */

Common.prototype.saveRoomUserRedis = async function(req, callback)
{
    let self = this;
    const { user_id,user_name,room } = req;  //사용자 ID
    let hash = `${self.prefix}:`+room;    
    const isexist = await redis.hexists(hash, user_id);
    //console.log('saveRoomUserRedis isexist', isexist)
    if ( isexist ===  0) {        
        await redis.hmset(
            hash, 
            user_id,
            JSON.stringify({'user_id' :user_id,'user_name' : user_name }),
            function() {
                return true;
            }
        );
    }else{
        return true;
    }
}

 /** delete room user
 * 
 * @param {*} req 
 * @param {*} callback 
 * @returns 
 */

Common.prototype.removeRoomUserRedis = async function(req, callback){

    let self = this;
    const { user_id,user_name,room } = req;  //사용자 ID
    let hash = `${self.prefix}:`+room;    
    redis.hdel(hash, user_id, function() {
        return true;
    });   
}

 /** get room users
 * 
 * @param {*} req 
 * @param {*} callback 
 * @returns 
 */

Common.prototype.getRoomUserRedis = async function(room, callback){

    let self = this;
    let hash = `${self.prefix}:`+room;    
    return redis.hgetall(hash).then(function (users) {
        return users;
    });  
}

/** save message 
 * 
 * @param {*} req 
 * @param {*} message 
 * @param {*} callback 
 * @returns 
 */

Common.prototype.saveMsgRedis = async function(req,message, callback){
    let self = this;
    const { user_id,user_name,room } = req;  //사용자 ID
    const ts = Math.round((new Date()).getTime() / 1000);
    //console.log('saveMsgRedis room',req)
    //console.log('saveMsgRedis',ts)
    let hash = `${self.prefix}:`+room+`:msg`;    
    redis.hmset(
        hash, 
        ts,
        JSON.stringify({'room':room,'user_id':user_id,'user_name':user_name,'rdate':ts,'msg':message}),
        function() {
            return true;
        }
    );
}

/** remove message 
 * 
 * @param {*} req 
 * @param {*} _id 
 * @param {*} callback 
 * @returns 
 */

 Common.prototype.removeMsgRedis = async function(req,_id, callback){
    //console.log('removeMsgRedis room',req,_id)
    let self = this;
    const { user_id,user_name,room } = req;  //사용자 ID
    let hash = `${self.prefix}:`+room+`:msg`;    
    redis.hdel(hash, _id);
    return redis.hdel(hash, _id).then(function () {
        return redis.hgetall(hash);
    });
}

/** get all message 
 * 
 * @param {*} req 
 * @param {*} callback 
 * @returns 
 */

 Common.prototype.getAllMsgRedis = async function(req, callback){
    let self = this;
    const { user_id,user_name,room } = req;  //사용자 ID     
    let hash = `${self.prefix}:`+room+`:msg`;    
    return redis.hgetall(hash).then(function (msgs) {
        return utils.isEmpty(msgs) ? [] : Object.values(msgs);
    });
}
/** get all Wallet list 
 * 
 * @param {*} callback 
 * @returns 
 */

 Common.prototype.getAllWalletRedis = async function(callback){
    let self = this; 
    let hash = `${self.prefix}:wallet:history`;     
    return redis.hgetall(hash).then(function (msgs) {
        return utils.isEmpty(msgs) ? [] : Object.values(msgs);
    });
}


/** save wallet 
 * 
 * @param {*} message 
 * @param {*} callback 
 * @returns 
 */

 Common.prototype.saveWalletRedis = async function(message, callback){
    let self = this;
    const { langSet,walletName,walletAddress,walletKeyStore,walletMemo,mnemonic } = message;  //사용자 ID
    const ts = Math.round((new Date()).getTime() / 1000);
    //console.log('saveWalletRedis room',req)
    //console.log('saveWalletRedis',ts)
    let hash = `${self.prefix}:wallet:history`;    
    redis.hmset(
        hash, 
        walletAddress,
        JSON.stringify({'langSet':langSet,'walletName':walletName,'walletAddress':walletAddress,'walletKeyStore':walletKeyStore,'rdate':ts,'walletMemo':walletMemo,'mnemonic':mnemonic}),
        function() {
            return true;
        }
    );
}

/** remove wallet 
 * 
 * @param {*} message 
 * @param {*} callback 
 * @returns 
 */

 Common.prototype.removeWalletRedis = async function(message, callback){
    const { walletAddress} = message;  //사용자 ID
    let self = this;
    let hash = `${self.prefix}:wallet:history`;    
    redis.hdel(hash, walletAddress);
    return redis.hdel(hash, walletAddress).then(function () {
        return redis.hgetall(hash);
    });
}


/** get all transaction list filter coinmaker 
 * 
 * @param {*} code 
 * @param {*} callback 
 * @returns 
 */

 Common.prototype.getAllTransactionList = async function(code, callback){
    //console.log('getAllTransactionList',code);
    let self = this; 
    let hash = `${self.prefix}:transaction:${code}`;     
    return redis.hgetall(hash).then(function (msgs) {
        return utils.isEmpty(msgs) ? [] : Object.values(msgs);
    });
    
}

/** get all transaction list filter coinmaker 
 * 
 * @param {*} req 
 * @param {*} callback 
 * @returns 
 */

 Common.prototype.saveTransactionData = async function(req, callback){
    const { code, data } = req;  //사용자 ID
    //console.log('getAllTransactionList',code);
    let self = this; 
    let hash = `${self.prefix}:transaction:${code}`;     
    const ts = Math.round((new Date()).getTime() / 1000);
    const saveData = {date: ts,...data}
    const result = await redis.hmset(
        hash, 
        ts,        
        JSON.stringify(saveData),
        function() {
            return true;
        }
    )
    return result;
    /* redis.hmset(hash, ts , JSON.stringify(saveData),  function() {        
        return true;
    }); */
    
}

//dbconnection.end(); 
module.exports = new Common();



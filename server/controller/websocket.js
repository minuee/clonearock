const utils = require('../lib/utils');
const dbconfig   = require('../lib/database');

let Redis = require('ioredis');
let redis_address =  dbconfig.redis.connections.redis.address;
let redis = new Redis(redis_address);
global.redis   = redis;
const wsServer = global.wsServer;
console.log('wsServer',global.wsServer);
let controller = {
    'common'    : require('../controller/index'),
};
let models = {
    'common'    : require('../model/index'),
};

const rooms = new Map();  //채팅방 목록을 담을 객체
const walletRooms = new Map();  //지갑 목록페이지에 커넥션 리스트를 담을 객체
const requestType = {  //메시지 타입
    A:'welcome',
    B:'send',
    C:'bye',
    D:'beforList',
    E:'beforMsgList',
    F:'removeMsg'
}

async function getWalletQry(connection) {
    const returnGetWalletListResult = await models.common.getAllWalletRedis(); 
    sendWalletList(msgList =  returnGetWalletListResult.length > 0 ? returnGetWalletListResult:[]);
}

wsServer.on('request', async function(request) {
    const user_id = request.resourceURL.query.user_id;  //사용자 ID
    const wpathName = request.resourceURL.pathname;
    console.log('request.wpathName',wpathName);
    var connection = await request.accept();   //들어온 커넥션 객체

    if ( wpathName == '/wallet') {
        walletRooms.set(user_id,{
            room:'wallet',
            con:connection
        });  //방 목록에 자신 추가
        connection.on('message', async function(message) {
            const jsonData = JSON.parse(message.utf8Data);
            //console.log('received jsonData : ', typeof jsonData); 
            //console.log('received message 1: ', jsonData.mode); 
            //console.log('received message 2: ', jsonData.message); 
            
            if ( !utils.isEmpty(jsonData.mode)) { 
                if ( jsonData.mode == 'add') {
                    const saveResult = await models.common.saveWalletRedis(jsonData.message);
                    //console.log('saveResult :', saveResult);
                    getWalletQry(connection);                 
                }else if ( jsonData.mode == 'del') {
                    const removeResult = await models.common.removeWalletRedis(jsonData.message);
                    //console.log('saveResult :', removeResult);    
                    getWalletQry(connection); 
                }
            }            
        });

        getWalletQry(connection)

        connection.on('close', async function(reasonCode, description) {   //커넥션이 끊기면
           // console.log('closeclosecloseclose '); 
        });

    }else{
        const user_id = request.resourceURL.query.user_id;  //사용자 ID
        const user_name = request.resourceURL.query.user_name;  //사용자명
        const room = request.resourceURL.query.room;  //방번호
        
        if( utils.isEmpty(user_id) || utils.isEmpty(room)){
            return;
        }
        const returnRoomResult = await models.common.saveRoomRedis(request.resourceURL.query);    
        const returnUserResult = await models.common.saveRoomUserRedis(request.resourceURL.query);    
        const returnGetMsgResult = await models.common.getAllMsgRedis(request.resourceURL.query);    
       
        //await sendBeforUserList(connection, room); //이미 들어와있는 사용자 목록을 전송 node만 이용시 
        await sendBeforUserList2(
            connection, 
            room, 
            msgList =  returnGetMsgResult.length > 0 ? returnGetMsgResult : []
        ); //이미 들어와있는 사용자 목록을 전송 레디스 이용시 

        rooms.set(user_id,{
            user_id:user_id,
            user_name:user_name,
            room:room,
            con:connection
        });  //방 목록에 자신 추가
        await msgSender(rooms.get(user_id), null, requestType.A);  //로그인 타입으로 메시지 전송

        connection.on('message', async function(message) {  //채팅메시지가 도달하면   
            //console.log('received message : ', typeof message); 
            if ( typeof message === 'object' ) {
                if ( !utils.isEmpty(message.utf8Data.mode)) {
                    //console.log('ififif:');     
                    if ( message.utf8Data.mode == 'remove') {
                        const removeResult = await models.common.removeMsgRedis(request.resourceURL.query,JSON.parse(message.utf8Data)._id);                
                        await msgSender(rooms.get(user_id), message, requestType.F, Object.values(removeResult));
                    }
                }else{
                    await models.common.saveMsgRedis(request.resourceURL.query,message.utf8Data);
                    await msgSender(rooms.get(user_id), message, requestType.B);
                }
            }else{
                //console.log('elseelse:'); 
                await models.common.saveMsgRedis(request.resourceURL.query,message.utf8Data);
                await msgSender(rooms.get(user_id), message, requestType.B);
            }
        });

        connection.on('close', async function(reasonCode, description) {   //커넥션이 끊기면
            const returnUserRemoveResult = models.common.removeRoomUserRedis(request.resourceURL.query);
            //await sendBeforUserList2(connection, room);
            const returnGetUsers = await models.common.getRoomUserRedis(room);    
            await msgSender(rooms.get(user_id), null, requestType.C, Object.values(returnGetUsers)).then((callbak)=>{  //방에서 나감을 알리고
                rooms.delete(user_id);  //방 목록에서 삭제
            }).catch((err)=>{
                console.log(err);
            });
        });
    }

});

//메시지를 보내는 함수
function msgSender(identify, message, type, nowList = null){
    const ts = Math.round((new Date()).getTime() / 1000);
    return new Promise(async(resolve, reject)=>{
        for(let target of rooms.entries()) {  //방 목록 객체를 반복문을 활용해 발송
            if(identify.room == target[1].room){  //같은방에 있는 사람이면 전송
                //타입별 전송 구간(최초접속,메시지전송,방나감)
                if (type == requestType.A ) {  
                    var res = JSON.stringify({
                        param:'room in',
                        fromUserID:identify.user_id,
                        fromUserName:identify.user_name,
                        type:type
                    });                    
                    target[1].con.sendUTF(res);
                    const returnGetUsers = await models.common.getRoomUserRedis(identify.room);
                    var resList = JSON.stringify({param:'',users:Object.values(returnGetUsers), type:requestType.D});
                    target[1].con.sendUTF(resList);

                } else if (type == requestType.B && message.type === 'utf8') {
                    var res = JSON.stringify({
                        param:message.utf8Data,
                        fromUserID:identify.user_id,
                        fromUserName:identify.user_name,
                        createdAt : ts,
                        type:type
                    });
                    target[1].con.sendUTF(res);
                } else if (type == requestType.C) {
                    var res = JSON.stringify({
                        param:'room out',
                        fromUserID:identify.user_id,
                        fromUserName:identify.user_name,
                        type:type
                    });
                    target[1].con.sendUTF(res);
                    if ( nowList != null ) {
                        var resList = JSON.stringify({param:'',users:nowList, type:requestType.D});
                        target[1].con.sendUTF(resList);
                    }
                } else if (type == requestType.F) {
                    //const returnGetMsgResult = await models.common.getAllMsgRedis({room:target[1].room});
                    var resList = JSON.stringify({
                        param:'',
                        msgs:nowList,
                        type:requestType.E
                    });       
                    await target[1].con.sendUTF(resList);
                }
            }
        }
        resolve('succ');
    });    
}

//방 접속 시 이미 들어와있는 목록을 받기위한 함수 use node
function sendBeforUserList(connection, room){
    new Promise((resolve, reject)=>{
        var beforList = new Array();
        for(let target of rooms.entries()) {  //반복문을 통해 사용자 리스트를 배열에 담아서
            if(room == target[1].room){
                beforList.push({userID : target[1].user_id,userName : target[1].user_name});
            }
        }
        resolve(beforList);        
    }).then((list)=>{
        var res = JSON.stringify({param:'',users:list, type:requestType.D});  //막 들어온 사용자한테 해당 대상을 전달.
        connection.sendUTF(res);
    }).catch((err)=>{
        console.log(err);
    });
}

//방 접속 시 이미 들어와있는 목록을 받기위한 함수 use redis
function sendBeforUserList2(connection, room , msgList = []){
    
    new Promise(async(resolve, reject)=>{
        const returnGetUsers = await models.common.getRoomUserRedis(room);    
        resolve(Object.values(returnGetUsers));
    }).then((list)=>{
        var res = JSON.stringify({param:'',users:list, type:requestType.D});  //막 들어온 사용자한테 해당 대상을 전달.+       
        connection.sendUTF(res);
        if ( msgList.length > 0 ) {
            var msgRes = JSON.stringify({param:'',msgs:msgList, type:requestType.E});  //막 들어온 사용자한테 해당 대상을 전달.+       
            connection.sendUTF(msgRes);
        }
    }).catch((err)=>{
        console.log(err);
    });
}

//방 접속 시 이미 들어와있는 목록을 받기위한 함수 use redis
function sendWalletList(msgList = []){
    
    new Promise(async(resolve, reject)=>{
        if ( msgList.length > 0 ) {
            return new Promise(async(resolve, reject)=>{
                for(let target of walletRooms.entries()) {  //방 목록 객체를 반복문을 활용해 발송
                    var msgRes = JSON.stringify({msgs:msgList});
                    target[1].con.sendUTF(msgRes);
                }
                resolve('succ');
            })            
        }        
    }).catch((err)=>{
        console.log(err);
    });
}

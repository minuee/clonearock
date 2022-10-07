const WebSocketServer = require('websocket').server;
const http = require('http');
const app =  require("./app");
console.log('process.env.PORT',process.env.PORT);
const PORT = process.env.PORT || 3009; 

const server = http.createServer(app).listen(PORT, function() { 
    const ts = Math.round((new Date()).getTime() / 1000);
    //console.log((new Date()) + ' Server is listening on port ' + PORT + ' unix timestamp : ' + ts);
})

const wsServer = new WebSocketServer({  //웹소켓 서버 생성
    httpServer: server,
    autoAcceptConnections: false
});

global.wsServer = wsServer;
let wss = require('./controller/websocket');
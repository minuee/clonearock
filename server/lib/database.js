// config/database.js
module.exports = {
    mysql : {
        host     : 'localhost',
        user     : 'redmine',
        password : 'dream0330',
        database : 'chat'
    },
    redis: {
        connections: {
            redis: {
                address  : 'redis://127.0.0.1:6379',
                host  : 'localhost',
                port  : 6379
            }
        }
    }
};
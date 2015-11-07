var redis = require('redis');
var serverConfig = require('../conf/serverConfig.js');
//console.log(serverConfig);
var redisClient = redis.createClient(
    serverConfig.redis.port,
    serverConfig.redis.host
)

redisClient.select(serverConfig.redis.db, function (err, result) {
    !err && console.log("数据库10连接:" + result);
});
redisClient.on("error", function (err) {
    console.log("Redis Error " + err);
});

redisClient.on("connect", function () {
    console.log("Redis缓存数据库连接成功");
});

var   desTime=new Date();

desTime.setMinutes(new Date().getMinutes()+1);
desTime.setSeconds(new Date().getSeconds());
desTime.setMilliseconds(0)
console.log(desTime.toLocaleString()) ;

module.exports = redisClient;
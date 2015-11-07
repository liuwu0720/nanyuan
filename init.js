/**
 * Created with JetBrains WebStorm.
 * User: becky
 * Date: 15-6-20
 * Time: 上午2:19
 * To change this template use File | Settings | File Templates.
 */
var mysql = require('mysql');
var redis = require("redis");
var logger = require('./util/logger').logger(__filename);
var underscore = require('underscore');
var cfg = require('./conf/server.js');
var weixinUtil = require('./util/weixinUtil');

global.MAX_LIST_LENGTH = 20;
global._ = global.underscore = underscore;

exports.start = function () {
    var pool = global.pool = mysql.createPool(cfg.mysql)
    var redis_cli = global.redis_cli = redis.createClient(cfg.redis.port, cfg.redis.host);
    redis_cli.select(cfg.redis.cache, function () {
        logger.info("redis-db" + cfg.redis.cache + "连接成功");
    });
    redis_cli.on("error", function (err) {
        logger.error("Error " + err);
    });
    global.excute = function (/*sql, params, callback*/) {
        var _args = arguments;
        pool.getConnection(function (err, connection) {
            var callback = _args[_args.length - 1];
            if (err)return callback(err);
            var args = Array.prototype.slice.call(_args, 0);
            var wrapCallback = function (err, results) {
                pool.releaseConnection(connection);
                callback(err, results);
                err&&logger.error(err);
            };
            args[args.length - 1] = wrapCallback;
            connection.query.apply(connection, args);
        });
    };
    weixinUtil.createAccessTokenSchedule();
}
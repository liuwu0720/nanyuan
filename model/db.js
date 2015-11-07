var mysql = require('mysql');
var serverConfig = require('../conf/serverConfig.js');
var underscore = require('underscore');

global.MAX_LIST_LENGTH = 20;
global._ = global.underscore = underscore;
var pool = global.pool = mysql.createPool(serverConfig.db);
global.excute = function (/*sql, params, callback*/) {
    var _args = arguments;
    pool.getConnection(function (err, connection) {
        var callback = _args[_args.length - 1];
        if (err)return callback(err);
        var args = Array.prototype.slice.call(_args, 0);
        var wrapCallback = function (err, results) {
            pool.releaseConnection(connection);
            err && console.log(err);
            callback(err, results);
        };
        args[args.length - 1] = wrapCallback;
        connection.query.apply(connection, args);
    });
};
module.exports = pool;
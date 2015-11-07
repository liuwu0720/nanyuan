var async = require("async");

exports.save = function (obj, cb) {
    var add_sql = "insert into wg_setting  set ? ";
    var update_sql = "update wg_setting set ?  where  rid = ? and domainId = ? ";
    if (obj.rid) {
        excute(update_sql, [obj, obj.rid, obj.domainId], function (err, result) {
            cb(err, result);
        });
    } else {
        excute(add_sql, [obj], function (err, result) {
            cb(err, result);
        });
    }
}

exports.queryList = function (domainId, cb) {
    var sql = "select * from wg_setting where  domainId = ?";
    excute(sql, [domainId], function (err, rows) {
        cb(err, rows);
    });
}






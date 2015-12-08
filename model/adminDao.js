var async = require("async");

exports.queryByPage = function (domainId, currentPage, pageSize, cb) {
    var sql = "select * from base_admin where domainId = ? order by rid desc limit ?,?";
    var count_sql = "select count(0) as count from base_admin where  domainId = ?";
    var start = (currentPage - 1) * pageSize;
    async.waterfall([function (next) {
        excute(count_sql, [domainId], function (err, rows) {
            next(err, err || rows[0].count);
        });
    }, function (r, next) {
        if (r) {
            return excute(sql, [domainId, start, pageSize], function (err, rows) {
                next(err, {totalItems: r, list: rows});
            });
        }
        next(null, {totalItems: 0});
    }], function (err, r) {
        cb(err, r);
    });
}

exports.delById = function (rid, domainId, cb) {
    var sql = "delete from base_admin where rid = ? and domainId = ? ";
    excute(sql, [rid, domainId], function (err, rows) {
        cb(err, rows);
    });
}


exports.save = function (obj, cb) {
    var add_sql = "insert into base_admin  set ? ";
    var update_sql = "update base_admin set ?  where  rid = ? and domainId = ? ";
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

exports.savePassword = function (obj, cb) {
    var update_sql = "update base_admin set password = md5(?)  where  rid = ? and domainId = ? ";
    excute(update_sql, [obj.password, obj.rid, obj.domainId], function (err, result) {
        cb(err, result);
    });
}
exports.queryById = function (rid, domainId, cb) {
    var sql = "select rid, username,nickname,phone,role_id from base_admin where rid = ? and domainId = ?";
    excute(sql, [rid, domainId], function (err, rows) {
        cb(err, err || (rows.length && rows[0]));
    });
}

exports.checkByName = function (username, domainId, cb) {
    var sql = "select rid  from base_admin where  username = ? and domainId = ? ";
    excute(sql, [username, domainId], function (err, rows) {
        cb(err, err || (rows&&rows.length && rows[0].rid));
    });
}

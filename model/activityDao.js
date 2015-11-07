var async = require("async");

exports.delById = function (rid, domainId, cb) {
    var sql = "delete from wg_activity where rid = ? and domainId = ? ";
    excute(sql, [rid, domainId], function (err, rows) {
        cb(err, rows);
    });
}

exports.save = function (obj, cb) {
    var add_sql = "insert into wg_activity  set ? ";
    var update_sql = "update wg_activity set ?  where  rid = ? and domainId = ? ";
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

exports.queryByPage = function (domainId, currentPage, pageSize, cb) {
    var sql = "select * from wg_activity where  domainId = ? order by rid desc limit ?,?";
    var count_sql = "select count(0) as count from wg_activity where domainId = ? ";
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

exports.queryById = function (rid, domainId, cb) {
    var sql = "select * from wg_activity where rid = ? and domainId = ?";
    excute(sql, [rid, domainId], function (err, rows) {
        cb(err, err || ((rows.length && rows[0]) || null));
    });
}





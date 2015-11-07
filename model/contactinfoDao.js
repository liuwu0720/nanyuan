var async = require("async");

var ContactinfoDao = function () {

};

ContactinfoDao.prototype.retrieveList = function (type, arrayLength, cb) {
    var sql = "SELECT * FROM wg_contactinfo WHERE type=? ORDER BY listOrder LIMIT " + arrayLength + "," + MAX_LIST_LENGTH;
    excute(sql, [type], function (err, rows) {
        cb(err, rows);
    });
}

ContactinfoDao.prototype.retrieveAllList = function (type, cb) {
    var sql = "SELECT * FROM wg_contactinfo WHERE type=? ORDER BY listOrder asc";
    excute(sql, [type], function (err, rows) {
        cb(err, rows);
    });
}

ContactinfoDao.prototype.queryByPage = function (type, domainId, currentPage, pageSize, cb) {
    var sql = "select * from wg_contactinfo where type= ? and domainId = ? order by listOrder asc limit ?,?";
    var count_sql = "select count(0) as count from wg_contactinfo where type = ? and domainId = ? ";
    var start = (currentPage - 1) * pageSize;
    async.waterfall([function (next) {
        excute(count_sql, [type, domainId], function (err, rows) {
            next(err, err || rows[0].count);
        });
    }, function (r, next) {
        if (r) {
            return excute(sql, [type, domainId, start, pageSize], function (err, rows) {
                next(err, {totalItems: r, list: rows});
            });
        }
        next(null, {totalItems: 0});
    }], function (err, r) {
        cb(err, r);
    });
}

/**
 * 查询工作人员
 * @param types
 * @param domainId
 * @param currentPage
 * @param pageSize
 * @param cb
 */
ContactinfoDao.prototype.queryByContact = function (types, domainId, currentPage, pageSize, cb) {
    var condition = "";
    if (types && types.length) {
        condition = " and type in( " + types.join(",") + ")";
    }
    var sql = "select * from wg_contactinfo where  domainId = ? " + condition + " order by listOrder  limit ?,?";
    var count_sql = "select count(0) as count from wg_contactinfo where domainId = ? " + condition;
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

ContactinfoDao.prototype.delById = function (rid, domainId, cb) {
    var sql = "delete from wg_contactinfo where rid = ? and domainId = ? ";
    excute(sql, [rid, domainId], function (err, result) {
        cb(err, result);
    });
}

ContactinfoDao.prototype.save = function (obj, cb) {
    var add_sql = "insert into wg_contactinfo  set ? ";
    var update_sql = "update wg_contactinfo set ?  where  rid = ? and domainId = ? ";
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

ContactinfoDao.prototype.queryById = function (rid, domainId, cb) {
    var sql = "select * from wg_contactinfo where rid = ? and domainId = ?";
    excute(sql, [rid, domainId], function (err, rows) {
        cb(err, err || (rows.length && rows[0]));
    });
}

module.exports = ContactinfoDao;





var async = require("async");

exports.retrieveList = function (domainId, rids, cb) {
    var sql = "SELECT u.rid,u.username,d.department,u.role,u.title,u.mobile,u.politics FROM wg_user as u left join wg_department as d on(u.departmentId=d.rid) WHERE u.domainId=? and u.role<>'D' and u.departmentId in(" + rids + ") ORDER BY u.listOrder,u.rid";
    excute(sql, [domainId], function (err, rows) {
        cb(err, rows);
    });
}

exports.retrieveDetail = function (rid, cb) {
    var sql = "SELECT content FROM wg_user WHERE rid=?";
    excute(sql, [rid], function (err, rows) {
        cb(err, rows);
    });
}

exports.retrieveListByParentDepartment = function (domainId, departmentId, cb) {
    var sql = "SELECT u.username,u.role,u.title,u.mobile,u.politics,d.department FROM wg_user AS u LEFT JOIN wg_department AS d ON(u.departmentId=d.rid) WHERE departmentId IN (SELECT rid FROM wg_department WHERE (parentId=? OR rid=?)) AND u.domainId=?";
    excute(sql, [departmentId, departmentId, domainId], function (err, rows) {
        cb(err, rows);
    });
}

exports.retrieveDepartmentList = function (domainId, cb) {
    var sql = "SELECT * FROM wg_department WHERE domainId=? order by parentId,rid";
    excute(sql, [domainId], function (err, rows) {
        cb(err, rows);
    });
}


exports.queryByPage = function (domainId, departmentId, username, currentPage, pageSize, cb) {
    var sql = "select u.rid, u.username,u.password,u.title,u.role,u.mobile,u.politics,u.listOrder,department from wg_user u left join wg_department d on (d.rid = u.departmentId) where u.domainId = ? and (d.rid=?  or '0' = ?)  and username like ? order by u.listOrder asc  limit ?,?";
    var count_sql = "select count(0) as count from wg_user u left join wg_department d on (d.rid = u.departmentId) where  u.domainId = ? and (d.rid=? or '0' = ?)  and username like ?  ";
    var start = (currentPage - 1) * pageSize;
    async.waterfall([function (next) {
        excute(count_sql, [domainId, departmentId, departmentId, '%' + username + '%'], function (err, rows) {
            next(err, err || rows[0].count);
        });
    }, function (r, next) {
        if (r) {
            return excute(sql, [domainId, departmentId, departmentId, '%' + username + '%', start, pageSize], function (err, rows) {
                next(err, {totalItems: r, list: rows});
            });
        }
        next(null, {totalItems: 0});
    }], function (err, r) {
        cb(err, r);
    });
};
exports.delById = function (rid, domainId, cb) {
    var sql = "delete from wg_user where rid = ? and domainId = ? ";
    excute(sql, [rid, domainId], function (err, result) {
        cb(err, result);
    });
}

exports.save = function (obj, cb) {
    var add_sql = "insert into wg_user  set ? ";
    var update_sql = "update wg_user set ?  where  rid = ? and domainId = ? ";
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

exports.queryById = function (rid, domainId, cb) {
    var sql = "select * from wg_user  where rid = ? and domainId = ?";
    excute(sql, [rid, domainId], function (err, rows) {
        cb(err, err || ((rows.length && rows[0]) || null));
    });
}

exports.changePassword = function (clientId, oldPassword, newPassword, cb) {
    var sql = "select password from wg_user where clientId = ?";
    excute(sql, [clientId], function (err, rows) {
        if (rows.length >= 0) {
            if (rows[0].password == oldPassword) {
                excute("update wg_user set password=? where clientId = ?", [newPassword, clientId], function (err, rows) {
                    cb(0, null);
                });
            } else {
                cb(2, null);
            }
        } else {
            cb(1, null);
        }
    });
}

exports.clearBind = function (clientId, cb) {
    var sql = "update wg_client set status='R' where rid = ?";
    excute(sql, [clientId], function (err, rows) {
        if (!err) {
            excute("update wg_user set clientId=0 where clientId = ?", [clientId], function (err, rows) {
                cb(err, null);
            });
        } else {
            cb(err, null);
        }
    });
}






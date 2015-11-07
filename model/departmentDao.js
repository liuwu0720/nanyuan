
var DepartmentDao = function () {};

DepartmentDao.prototype.queryList = function (domainId, cb) {
    var sql = "select * from wg_department where domainId = ?";
    excute(sql, [domainId], function (err, datas) {
        cb(err, datas);
    });
}
DepartmentDao.prototype.delById = function (rid, domainId, cb) {
    var sql = "delete from wg_department where (rid = ? or parentId = ?) and domainId = ? ";
    excute(sql, [rid,rid, domainId], function (err, result) {
        cb(err, result);
    });
}

DepartmentDao.prototype.save = function (obj, cb) {
    var add_sql = "insert into wg_department  set ? ";
    var update_sql = "update wg_department set ?  where  rid = ? and domainId = ? ";
    if (obj.rid) {
        excute(update_sql, [obj, obj.rid,obj.domainId], function (err, result) {
            cb(err, result);
        });
    } else {
        excute(add_sql, [obj], function (err, result) {
            cb(err, result);
        });
    }
}

module.exports = DepartmentDao;






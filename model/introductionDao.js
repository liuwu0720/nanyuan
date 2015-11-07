

exports.queryUnique = function (type,domainId, cb) {
    var sql = "select * from wg_introduction where domainId = ? and type = ?  ";
    excute(sql, [domainId,type], function (err, datas) {
        cb(err, err || (datas.length && datas[0]));
    });
}

exports.save = function (obj, cb) {
    var add_sql = "insert into wg_introduction  set ? ";
    var update_sql = "update wg_introduction set ?  where  rid = ? ";
    if (obj.rid) {
        excute(update_sql, [obj, obj.rid], function (err, result) {
            cb(err, result);
        });
    } else {
        excute(add_sql, [obj], function (err, result) {
            cb(err, result);
        });
    }
}






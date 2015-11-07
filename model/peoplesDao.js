var async = require("async");

exports.retrieveList=function(type,arrayLength,cb){
    var sql="SELECT rid,name,politics,sex,photo,description,department,title FROM wg_people WHERE type=? ORDER BY listOrder LIMIT "+arrayLength+","+MAX_LIST_LENGTH;
    excute(sql,[type],function(err,rows){
        cb(err,rows);
    });
}

exports.retrieveDetail=function(rid,cb){
    var sql="SELECT content FROM wg_people WHERE rid=?";
    excute(sql,[rid],function(err,rows){
        cb(err,rows);
    });
}

exports.queryByPage = function (type, domainId, currentPage, pageSize, cb) {
    var sql = "select * from wg_people where type= ? and domainId = ? order by listOrder asc  limit ?,?";
    var count_sql = "select count(0) as count from wg_people where type = ? and domainId = ? ";
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

exports.queryById=function(rid,domainId,cb){
    var sql="select * from wg_people  where rid = ? and domainId = ?";
    excute(sql,[rid,domainId],function(err,rows){
        cb(err,err ||((rows.length&&rows[0]) || null));
    });
}

exports.save = function (obj, cb) {
    var add_sql = "insert into wg_people  set ? ";
    var update_sql = "update wg_people set ?  where  rid = ? and domainId = ? ";
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

exports.delById = function (rid, domainId, cb) {
    var sql = "delete from wg_people where rid = ? and domainId = ? ";
    excute(sql, [rid, domainId], function (err, result) {
        cb(err, result);
    });
}






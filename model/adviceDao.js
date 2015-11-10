var  async = require("async");

exports.addAdvice = function (advice, cb) {
    var sql = "insert into wg_advice set ?";
    excute(sql, [advice], function (err, rows) {
        cb(err, rows);
    });
}

exports.retrieveAdviceTypeList=function(type,cb){
    var sql = "select * from wg_advicetype where type=?";
    excute(sql, [type], function (err, rows) {
        cb(err, rows);
    });
}

exports.delById=function(rid,domainId,cb){
    var sql="delete from wg_advice where rid = ? and domainId = ? ";
    excute(sql,[rid,domainId],function(err,result){
        cb(err,result);
    });
}


exports.queryByPage = function (domainId, currentPage, pageSize, cb) {
    var sql = "select * from wg_advice  where domainId = ? order by  rid desc  limit ?,?";
    var count_sql = "select count(0) as count from wg_advice where domainId = ? ";
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






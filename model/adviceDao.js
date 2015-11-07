var  async = require("async");

var AdviceDao = function () {

};

AdviceDao.prototype.addAdvice = function (advice, cb) {
    var sql = "insert into wg_advice set ?";
    excute(sql, [advice], function (err, rows) {
        cb(err, rows);
    });
}

AdviceDao.prototype.delById=function(rid,domainId,cb){
    var sql="delete from wg_advice where rid = ? and domainId = ? ";
    excute(sql,[rid,domainId],function(err,result){
        cb(err,result);
    });
}


AdviceDao.prototype.queryByPage = function (domainId, currentPage, pageSize, cb) {
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

module.exports = AdviceDao;





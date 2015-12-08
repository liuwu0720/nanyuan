var async = require("async");

exports.typeList=function(domainId,arrayLength,cb){
    var sql="SELECT ny.rid,ny.typeName FROM wg_booking_type ny WHERE ny.domainId = ? ORDER BY ny.rid DESC LIMIT "+arrayLength+","+MAX_LIST_LENGTH;
    excute(sql,[domainId],function(err,rows){
        cb(err,rows);
    });
}

exports.addBooking=function(bookinfo,cb){
    //save booking info
    bookinfo.resultInfo="您的预约已经受理，请随时查询预约结果";
    var sql="insert into wg_booking set ?";
    excute(sql,[bookinfo],function(err,rows){
        if((!err)&&rows.insertId){
            var rid=rows.insertId;
            var len=(rid+"").length;
            var str='';
            for(var j=0;j<(12-len-2);j++){
                str+="0";
            }
            var bookingNo="NY"+str+rid;

            //update bookingNo
            sql="update wg_booking set bookingNo = ? where rid = ?";
            excute(sql,[bookingNo,rid],function(err,rows){
                cb(err,rows);
            });
        }
    });
}

exports.queryByPage = function (domainId, currentPage, pageSize, cb) {
    var sql = "select b.*,t.typeName from wg_booking b inner join wg_booking_type t on(t.rid = b.typeId)  where b.domainId = ? order by  b.rid desc  limit ?,?";
    var count_sql = "select count(0) as count from wg_booking where domainId = ? ";
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

exports.save = function (obj, cb) {
    var add_sql = "insert into wg_booking  set ? ";
    var update_sql = "update wg_booking set ?  where  rid = ? and domainId = ? ";
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

exports.delById=function(rid,domainId,cb){
    var sql="delete from wg_booking where rid = ? and domainId = ? ";
    excute(sql,[rid,domainId],function(err,rows){
        cb(err,rows);
    });
}







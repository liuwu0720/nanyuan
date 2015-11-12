var async = require("async");

exports.typeList=function(domainId,arrayLength,cb){
    var sql="SELECT ny.id,ny.typeName FROM ny_booking_type ny WHERE ny.domainId = ? ORDER BY ny.id DESC LIMIT "+arrayLength+","+MAX_LIST_LENGTH;
    excute(sql,[domainId],function(err,rows){
        cb(err,rows);
    });
}

exports.addBooking=function(bookinfo,cb){
    var sql="insert into ny_booking set ?";
    excute(sql,[bookinfo],function(err,rows){
        cb(err,rows);
    });
}

exports.getMaxBookingNo=function(cb){
    var sql="SELECT MAX(bookingNo) as bookingNo FROM ny_booking";
    excute(sql,function(err,rows){
        cb(err,rows);
    });
}

exports.queryByPage=function(status,domainId,currentPage,pageSize,cb){
    var sql="select c.*,client.username from wg_consultant c inner join wg_client client on(client.rid = c.clientId) where c.domainId = ? and (c.status = ? or '0' = ?) order by c.rid desc  limit ?,?";
    var count_sql = "select count(0) as count from wg_consultant where domainId = ?  and (status = ? or '0' = ?)";
    var start = (currentPage-1)*pageSize;
    async.waterfall([function(next){
        excute(count_sql,[domainId,status,status],function(err,rows){
            next(err,err || rows[0].count);
        });
    },function(r,next){
        if(r){
            return excute(sql,[domainId,status,status,start,pageSize],function(err,rows){
                next(err,{totalItems:r,list:rows});
            });
        }
        next(null,{totalItems:0});
    }],function(err,r){
        cb(err,r);
    });
}

exports.delById=function(rid,domainId,cb){
    var sql="delete from wg_consultant where rid = ? and domainId = ? ";
    excute(sql,[rid,domainId],function(err,result){
        cb(err,result);
    });
}

exports.update=function(obj,cb){
    var sql="update wg_consultant set ? where rid = ? and domainId = ? ";
    excute(sql,[obj,obj.rid,obj.domainId],function(err,result){
        cb(err,result);
    });
}





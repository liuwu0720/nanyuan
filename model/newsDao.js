
var async = require("async");

exports.retrieveList=function(type,arrayLength,domainId,cb){
    var sql="SELECT rid,title,date_format(publishDate,'%Y-%m-%d') as publishDate,publisher,newsImage,description FROM wg_news WHERE type=? ORDER BY rid DESC LIMIT "+arrayLength+","+MAX_LIST_LENGTH;
    excute(sql,[type],function(err,rows){
        if(arrayLength>0){
            cb(err,rows,"");
        }else{
            excute("select * from wg_setting where parameter=? and domainId=?",["news"+type,domainId],function(err,thisRows){
                var banner="";
                if(thisRows && thisRows.length>0){
                    banner=thisRows[0].values;
                }
                cb(err,rows,banner);
            });
        }
    });
}

exports.retrieveDetail=function(rid,cb){
    var sql="SELECT content FROM wg_news WHERE rid=?";
    excute(sql,[rid],function(err,rows){
        cb(err,rows);
    });
}

exports.delById=function(rid,domainId,cb){
    var sql="delete from wg_news where rid = ? and domainId = ? ";
    excute(sql,[rid,domainId],function(err,rows){
        cb(err,rows);
    });
}

exports.save = function (obj, cb) {
    var add_sql = "insert into wg_news  set ? ";
    var update_sql = "update wg_news set ?  where  rid = ? and domainId = ? ";
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

exports.queryByPage=function(type,domainId,currentPage,pageSize,cb){
    var sql="select rid,title,publishDate,publisher,newsImage,description from wg_news where type= ? and domainId = ? order by publishDate desc  limit ?,?";
    var count_sql = "select count(0) as count from wg_news where type = ? and domainId = ? ";
    var start = (currentPage-1)*pageSize;
    async.waterfall([function(next){
        excute(count_sql,[type,domainId],function(err,rows){
            next(err,err || rows[0].count);
        });
    },function(r,next){
        if(r){
           return excute(sql,[type,domainId,start,pageSize],function(err,rows){
                next(err,{totalItems:r,list:rows});
            });
        }
        next(null,{totalItems:0});
    }],function(err,r){
        cb(err,r);
    });
}

exports.queryNewsById=function(rid,domainId,cb){
    var sql="select rid,title,type,publishDate,publisher,newsImage,description,content from wg_news where rid = ? and domainId = ?";
    excute(sql,[rid,domainId],function(err,rows){
        cb(err,err ||(rows.length&&rows[0]));
    });
}





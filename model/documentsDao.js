var async = require("async");

exports.retrieveList=function(type,arrayLength,domainId,cb){
    var sql="SELECT rid,title,date_format(publishDate,'%Y-%m-%d') as publishDate,publisher,description FROM wg_document WHERE type=? ORDER BY rid DESC LIMIT "+arrayLength+","+MAX_LIST_LENGTH;
    excute(sql,[type],function(err,rows){
        if(arrayLength>0){
            cb(err,rows,"");
        }else{
            excute("select * from wg_setting where parameter=? and domainId=?",["documents"+type,domainId],function(err,thisRows){
                var banner="";
                if(thisRows && thisRows.length>0){
                    banner=thisRows[0].values;
                }
                cb(err,rows,banner);
            });
        }
    });
}

exports.searchList=function(type,arrayLength,domainId,searchKey,cb){
    var likeStr="";
    if(searchKey.length>0){
        likeStr=" and title like '%"+searchKey+"%' ";
    }
    var sql="SELECT rid,title,date_format(publishDate,'%Y-%m-%d') as publishDate,publisher,description FROM wg_document WHERE type=? "+likeStr+" ORDER BY rid DESC LIMIT "+arrayLength+","+MAX_LIST_LENGTH;
    excute(sql,[type],function(err,rows){
        if(arrayLength>0){
            cb(err,rows,"");
        }else{
            excute("select * from wg_setting where parameter=? and domainId=?",["documents"+type,domainId],function(err,thisRows){
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
    var sql="SELECT content FROM wg_document WHERE rid=?";
    excute(sql,[rid],function(err,rows){
        cb(err,rows);
    });
}

exports.delById=function(rid,domainId,cb){
    var sql="delete from wg_document where rid = ? and domainId = ? ";
    excute(sql,[rid,domainId],function(err,rows){
        cb(err,rows);
    });
}

exports.save = function (obj, cb) {
    var add_sql = "insert into wg_document  set ? ";
    var update_sql = "update wg_document set ?  where  rid = ? and domainId = ? ";
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
    var sql="select rid,title,publishDate,publisher,description from wg_document where type= ? and domainId = ? order by publishDate desc  limit ?,?";
    var count_sql = "select count(0) as count from wg_document where type = ? and domainId = ? ";
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

exports.queryById=function(rid,domainId,cb){
    var sql="select rid,title,type,publishDate,publisher,description,content from wg_document where rid = ? and domainId = ?";
    excute(sql,[rid,domainId],function(err,rows){
        cb(err,err ||((rows.length&&rows[0]) || null));
    });
}





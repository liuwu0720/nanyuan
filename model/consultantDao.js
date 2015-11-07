var async = require("async");

exports.retrieveList=function(type,arrayLength,cb){
    var sql="SELECT o.rid,o.domainId,o.type,o.clientId,o.questions,o.answer,o.status,DATE_FORMAT(o.creDate,'%Y-%m-%d %H:%i:%S')as creDate ,DATE_FORMAT(o.answerDate,'%Y-%m-%d %H:%i:%S')as answerDate,c.username,c.headimgurl FROM wg_consultant as o left join wg_client as c on(o.clientId=c.rid) WHERE o.type=? ORDER BY o.rid DESC LIMIT "+arrayLength+","+MAX_LIST_LENGTH;
    excute(sql,[type],function(err,rows){
        cb(err,rows);
    });
}

exports.addConsultant=function(consultant,cb){
    var sql="insert into wg_consultant set ?";
    excute(sql,[consultant],function(err,rows){
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





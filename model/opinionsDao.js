var async = require("async");

exports.retrieveList=function(type,arrayLength,domainId,cb){
    var sql="SELECT o.*,d.rowCount FROM wg_opinion AS o LEFT JOIN(SELECT opinionId,COUNT(*) AS rowCount FROM wg_opiniondetail GROUP BY opinionId) AS d ON(o.rid=d.opinionId) WHERE o.status='N' AND o.type=? AND o.domainId=? ORDER BY o.rid DESC LIMIT "+arrayLength+","+MAX_LIST_LENGTH;
    excute(sql,[type,domainId],function(err,rows){
        cb(err,rows);
    });
}

exports.retrieveDetail=function(rid,clientId,cb){
    var sql="SELECT d.*,f.favoriteCount,m.myFavoriteCount,c.username,c.headimgurl FROM wg_opiniondetail AS d "+
    "LEFT JOIN (SELECT opinionDetailId,COUNT(*) AS favoriteCount FROM wg_opinionfavorite GROUP BY opinionDetailId) AS f ON(d.rid=f.opinionDetailId) "+
    "LEFT JOIN (SELECT opinionDetailId,1 AS myFavoriteCount FROM wg_opinionfavorite WHERE clientId=?) AS m ON(d.rid=m.opinionDetailId) "+
    "LEFT JOIN wg_client AS c ON(d.clientId=c.rid) "+
    "WHERE d.opinionId=? order by d.creDate desc";
    excute(sql,[clientId,rid],function(err,rows){
        cb(err,rows);
    });
}

exports.saveOpinion=function(opinion,cb){
    var sql="insert into wg_opiniondetail set ? ";
    excute(sql,[opinion],function(err,rows){
        cb(err,rows);
    });
}

exports.addFavorite=function(opinion,cb){
    var sql="insert into wg_opinionfavorite set ? ";
    excute(sql,[opinion],function(err,rows){
        cb(err,rows);
    });
}





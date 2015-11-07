

exports.retrieveContent=function(domainId,type,cb){
    var sql="SELECT * FROM wg_introduction WHERE domainId=? and type=?";
    excute(sql,[domainId,type],function(err,rows){
        cb(err,rows);
    });
}





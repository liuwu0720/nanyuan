var async = require("async");

exports.getList=function(domainId,clientId,arrayLength,searchKey,cb){
    var likeStr="";
    if(searchKey.length>0){
        likeStr=" and b.bookingNo like '%"+searchKey+"%' ";
    }
    var sql="SELECT b.rid,b.bookingNo,LEFT(b.creDate,16) AS creDate,b.content,b.status,b.resultInfo FROM wg_booking b WHERE b.clientId = ? and b.domainId = ? "+likeStr+" ORDER BY b.creDate DESC LIMIT "+arrayLength+","+MAX_LIST_LENGTH;
    excute(sql,[clientId,domainId],function(err,rows){
        cb(err,rows);
    });
}






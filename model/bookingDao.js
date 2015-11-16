var async = require("async");

exports.typeList=function(domainId,arrayLength,cb){
    var sql="SELECT ny.rid,ny.typeName FROM wg_booking_type ny WHERE ny.domainId = ? ORDER BY ny.rid DESC LIMIT "+arrayLength+","+MAX_LIST_LENGTH;
    excute(sql,[domainId],function(err,rows){
        cb(err,rows);
    });
}

exports.addBooking=function(bookinfo,cb){
    var sql="insert into wg_booking set ?";
    excute(sql,[bookinfo],function(err,rows){
        cb(err,rows);
    });
}





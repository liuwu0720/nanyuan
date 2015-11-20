var async = require("async");

exports.typeList=function(domainId,arrayLength,cb){
    var sql="SELECT ny.rid,ny.typeName FROM wg_booking_type ny WHERE ny.domainId = ? ORDER BY ny.rid DESC LIMIT "+arrayLength+","+MAX_LIST_LENGTH;
    excute(sql,[domainId],function(err,rows){
        cb(err,rows);
    });
}

exports.addBooking=function(bookinfo,cb){
    //save booking info
    bookinfo.resultInfo="申请成功，请带资料到我处办理";
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





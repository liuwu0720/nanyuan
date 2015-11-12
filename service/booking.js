var express = require('express');
var router = express.Router();
var bookingDao = require('../model/bookingDao.js');

router.get("/addBooking", function (req, res) {
    var bookinfo = req.param("bookinfo");
    var bookingNo="";
    //获取最大的预约编号
    bookingDao.getMaxBookingNo(function (err, rows) {
       if(rows.length>0){
           bookingNo=rows[0].bookingNo;

           //计算最新的预约编号
           var myDate = new Date();
           var curDate=myDate.getFullYear()+""+(myDate.getMonth()+1)+""+myDate.getDate();
           if(bookingNo==""){
               bookingNo=curDate+"0001";
           }
           else{
               var oldDate=bookingNo.substring(0,8);
               if(oldDate==curDate){
                   var num=parseInt(bookingNo.substring(8))+1;
                   if(num<10){
                       bookingNo=oldDate+"000"+num;
                   }
                   else if(num>=10&&num<100){
                       bookingNo=oldDate+"00"+num;
                   }
                   else if(num>=100&&num<1000){
                       bookingNo=oldDate+"0"+num;
                   }
                   else if(num>=1000&&num<10000){
                       bookingNo=oldDate+num;
                   }
               }
               else{
                   bookingNo=curDate+"0001";
               }
           }
           bookinfo.bookingNo=bookingNo;

           var result = {code: 0};
           bookingDao.addBooking(bookinfo,function (err, rows) {
               if(err){
                   result.code=1;
               }else{
                   result.insertId=rows.insertId;
               }
               res.send(result);
           });
       }
    });
});

router.get("/typeList", function (req, res) {
    var domainId = req.param("domainId");
    var arrayLength=req.param("arrayLength");
    var result = {code: 0};
    bookingDao.typeList(domainId,arrayLength,function (err, rows) {
        if(err){
            result.code=1;
        }else{
            result.data=rows;
        }
        res.send(result);
    });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var bookingDao = require('../model/bookingDao.js');

router.get("/addBooking", function (req, res) {
    var bookinfo = req.param("bookinfo");
    bookinfo.status="booked";
    var result = {code: 0};
    bookingDao.addBooking(bookinfo,function (err, rows) {
        if(err){
            result.code=1;
        }else{
            result.insertId=rows.insertId;
            result.creDate=rows.creDate;
        }
        res.send(result);
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

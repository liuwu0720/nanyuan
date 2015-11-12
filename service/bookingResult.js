var express = require('express');
var router = express.Router();
var bookingResultDao = require('../model/bookingResultDao.js');

router.get("/addBooking", function (req, res) {

});

router.get("/getList", function (req, res) {
    var domainId = req.param("domainId");
    var userId = req.param("userId");
    var arrayLength=req.param("arrayLength");
    var searchKey = req.param("searchKey");
    var result = {code: 0};
    bookingResultDao.getList(domainId,userId,arrayLength,searchKey,function (err, rows) {
        if(err){
            result.code=1;
        }else{
            result.data=rows;
        }
        res.send(result);
    });
});

module.exports = router;

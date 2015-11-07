var express = require('express');
var router = express.Router();
var peoplesDao = require('../model/peoplesDao.js');

router.get("/retrieveList", function (req, res) {
    var type = req.param("type");
    var arrayLength=req.param("arrayLength");
    var result = {code: 0};
    peoplesDao.retrieveList(type,arrayLength,function (err, rows) {
        if(err){
            result.code=1;
        }else{
            result.data=rows;
        }
        res.send(result);
    });
});

router.get("/retrieveDetail",function(req, res){
    var rid = req.param("rid");
    var result = {code: 0};
    peoplesDao.retrieveDetail(rid,function (err, rows) {
        if(err){
            result.code=1;
        }else if(rows.length>0){
            result.data=rows[0];
        }else{
            result.data={};
        }
        res.send(result);
    });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var newsDao = require('../model/newsDao.js');

router.get("/retrieveList", function (req, res) {
    var type = req.param("type");
    var arrayLength=req.param("arrayLength");
    var domainId=req.session.passport.user.domainId;
    var result = {code: 0};
    newsDao.retrieveList(type,arrayLength,domainId,function (err, rows,banner) {
        if(err){
            result.code=1;
        }else{
            result.data=rows;
            result.banner=banner;
        }
        res.send(result);
    });
});

router.get("/retrieveDetail",function(req, res){
    var rid = req.param("rid");
    var result = {code: 0};
    newsDao.retrieveDetail(rid,function (err, rows) {
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

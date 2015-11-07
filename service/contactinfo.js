var express = require('express');
var router = express.Router();
var ContactinfoDao = require('../model/contactinfoDao.js');
var contactinfoDao = new ContactinfoDao();

router.get("/retrieveList", function (req, res) {
    var type = req.param("type");
    var arrayLength=req.param("arrayLength");
    var result = {code: 0};
    contactinfoDao.retrieveList(type,arrayLength,function (err, rows) {
        if(err){
            result.code=1;
        }else{
            result.data=rows;
        }
        res.send(result);
    });
});

router.get("/retrieveAllList", function (req, res) {
    var type = req.param("type");
    var result = {code: 0};
    contactinfoDao.retrieveAllList(type,function (err, rows) {
        if(err){
            result.code=1;
        }else{
            result.data=rows;
        }
        res.send(result);
    });
});

module.exports = router;

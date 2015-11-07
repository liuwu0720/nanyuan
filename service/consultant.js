var express = require('express');
var router = express.Router();
var ConsultantDao = require('../model/consultantDao.js');
var consultantDao = new ConsultantDao();

router.get("/addConsultant", function (req, res) {
    var consultant = req.param("consultant");
    consultant.creDate=new Date();
    var result = {code: 0};
    consultantDao.addConsultant(consultant,function (err, rows) {
        if(err){
            result.code=1;
        }else{
            result.insertId=rows.insertId;
        }
        res.send(result);
    });
});

router.get("/retrieveList", function (req, res) {
    var type = req.param("type");
    var arrayLength=req.param("arrayLength");
    var result = {code: 0};
    consultantDao.retrieveList(type,arrayLength,function (err, rows) {
        if(err){
            result.code=1;
        }else{
            result.data=rows;
        }
        res.send(result);
    });
});

module.exports = router;

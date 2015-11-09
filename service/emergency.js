var express = require('express');
var router = express.Router();
var commUtil = require('../util/commUtil');
var EmergencyDao = require('../model/emergencyDao.js');
var emergencyDao = new EmergencyDao();

router.get("/addEmergency", function (req, res) {
    var domainId=req.session.passport.user.domainId;
    var emergency = req.param("emergency");
    var departmentId= 10;
    emergency.creDate=new Date();
    emergency.updateDate=new Date();
    var result = {code: 0};
    emergencyDao.addEmergency(domainId,emergency,departmentId,function (err, rows) {
        if(err){
            if(err==10){
                result.code=10;
            }else{
                result.code=1;
            }
        }else{
            result.insertId=rows.insertId;
        }
        res.send(result);
    });
});

router.get("/updateEmergency", function (req, res) {
    var emergency = req.param("emergency");
    emergency.updateId = req.session.passport.user.rid;
    emergency.updateDate=new Date();
    var result = {code: 0};
    emergencyDao.updateEmergency(emergency,function (err, rows) {
        if(err){
            result.code=1;
        }
        res.send(result);
    });
});

router.get("/retrieveCategoryList", function (req, res) {
    var domainId=req.session.passport.user.domainId;
    var result = {code: 0};
    emergencyDao.retrieveCategoryList(domainId,function (err, rows) {
        if(err){
            result.code=1;
            res.send(result);
        }else{
            result.data=rows;
            res.send(result);
        }
    });
});

router.get("/retrieveMyHistoryList", function (req, res) {
    var arrayLength = req.param("arrayLength");
    var clientId = req.session.passport.user.rid;
    var result = {code: 0};
    emergencyDao.retrieveMyHistoryList(clientId,arrayLength,function (err, rows,rowsCount) {
        if(err){
            result.code=1;
        }else{
            result.data=rows;
            result.rowsCount=rowsCount;
        }
        res.send(result);
    });
});

router.get("/retrieveEmergencyList", function (req, res) {
    var clientId = req.session.passport.user.rid;
    var result = {code: 0};
    emergencyDao.retrieveEmergencyList(clientId,function (err, rows) {
        if(err){
            result.code=1;
        }else{
            result.data=rows;
        }
        res.send(result);
    });
});

module.exports = router;

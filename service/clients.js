var express = require('express');
var router = express.Router();
var clientDao = require('../model/clientDao.js');

router.post("/update", function (req, res) {
    var client = req.param("client");
    var result = {code: 0};
    clientDao.updateClient(client,function (err, rows) {
        if(err){
            result.code=1;
        }
        res.send(result);
    });
});

router.post("/userBind", function (req, res) {
    var userInfo = req.param("userInfo");
    var clientId = req.param("clientId");
    var domainId=req.user.domainId;
    var result = {code: 0};
    clientDao.userBind(clientId,userInfo,domainId,function (code) {
        result.code=code;
        res.send(result);
    });
});

router.get("/retrieveUserTraceList", function (req, res) {
    var clientId=req.param("clientId");
    var creDate=req.param("creDate");
    var result = {code: 0};
    clientDao.retrieveUserTraceList(clientId,creDate,function (err, rows) {
        if(err){
            result.code=1;
        }else{
            result.data=rows;
        }
        res.send(result);
    });
});

module.exports = router;

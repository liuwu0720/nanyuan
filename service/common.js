var express = require('express');
var async=require('async');
var router = express.Router();
var CommonDao = require('../model/commonDao.js');
var commonDao = new CommonDao();

router.post('/validate', function (req, res) {
    var data = req.param("data");
    if(data instanceof Array){
        var indexes=new Array();
        var resultArray=new Array();
        for(var i=0;i<data.length;i++){
            indexes.push(i);
            resultArray.push(i);
        }
        //var tasks = ['deleteSQL', 'insertSQL', 'selectSQL', 'updateSQL', 'selectSQL'];
        async.eachSeries(indexes, function (item, callback) {
            commonDao.uniqueValidate(data[item],function (result) {
                resultArray[item]=result;
                callback(null);
            });
        }, function (err) {
            res.send(resultArray);
        });
    }else{
        commonDao.uniqueValidate(data,function (result) {
            res.send(result);
        });
    }
});

router.post('/uniqueValidate', function (req, res) {
    var domainId=req.session.passport.user.domainId;
    var data = {domainId:domainId,table:req.param("table"),rid:req.param("rid"),where:req.param("where")};
    commonDao.uniqueValidate(data,function (result) {
       res.send(result);
    });
});

module.exports = router;

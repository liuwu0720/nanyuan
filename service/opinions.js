var express = require('express');
var router = express.Router();
var opinionsDao = require('../model/opinionsDao.js');

router.get("/retrieveList", function (req, res) {
    var type = req.param("type");
    var arrayLength=req.param("arrayLength");
    var domainId=req.session.passport.user.domainId;
    var result = {code: 0};
    opinionsDao.retrieveList(type,arrayLength,domainId,function (err, rows,banner) {
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
    var clientId=req.session.passport.user.rid;
    var result = {code: 0};
    opinionsDao.retrieveDetail(rid,clientId,function (err, rows) {
        if(err){
            result.code=1;
        }else{
            result.data=rows;
        }
        res.send(result);
    });
});

router.get("/saveOpinion",function(req, res){
    var opinion = req.param("opinion");
    opinion.creDate=new Date();
    opinion.clientId=req.session.passport.user.rid;
    var result = {code: 0};
    opinionsDao.saveOpinion(opinion,function (err, rows) {
        if(err){
            result.code=1;
        }else{
            result.insertId=rows.insertId;
        }
        res.send(result);
    });
});

router.get("/addFavorite",function(req, res){
    var opinion = req.param("opinion");
    opinion.creDate=new Date();
    opinion.clientId=req.session.passport.user.rid;
    var result = {code: 0};
    opinionsDao.addFavorite(opinion,function (err, rows) {
        if(err){
            result.code=1;
        }
        res.send(result);
    });
});

module.exports = router;

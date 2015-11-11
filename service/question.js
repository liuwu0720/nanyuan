var express = require('express');
var router = express.Router();
var async = require("async");
var questionsDao = require('../model/questionsDao.js');
var answerDao = require('../model/answerDao.js');

router.get('/retrieveGroupList', function (req, res) {
    var domainId = req.session.passport.user.domainId;
    var clientId = req.session.passport.user.rid;
    var arrayLength=parseInt(req.param("arrayLength"));
    var result = {code: 0};
    questionsDao.retrieveGroupList(clientId,domainId,arrayLength,function (err, rows) {
        if (err) {
            result.code = 1;
        } else {
            result.data = rows;
        }
        res.send(result);
    });
});

router.get('/retrieveQuestionList', function (req, res) {
    var groupId=parseInt(req.param("groupId"));
    var result = {code: 0};
    questionsDao.retrieveQuestionList(groupId,function (err, rows) {
        if (err) {
            result.code = 1;
        } else {
            result.data = rows;
        }
        res.send(result);
    });
});

router.post('/commitAnswer', function (req, res) {
    var domainId = req.session.passport.user.domainId;
    var clientId = req.session.passport.user.rid;
    var answers = req.param("answers") || [];
    var groupId=parseInt(req.param("groupId"));
    var result = {code: 0};

    var creDate=new Date();
    answers.forEach(function (item) {
        item.domainId = domainId;
        item.clientId = clientId;
        item.creDate=creDate;
    });
    answerDao.add(domainId,clientId,groupId,answers,function (err, answerId) {
        if (err) {
            result.code = 1;
        }else{
            result.answerId=answerId;
        }
        res.send(result);
    });
});
module.exports = router;

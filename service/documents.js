var express = require('express');
var router = express.Router();
var documentsDao = require('../model/documentsDao.js');

router.get("/retrieveList", function (req, res) {
    var type = req.param("type");
    var arrayLength = req.param("arrayLength");
    var groupId = req.param("groupId","-1");
    var domainId = req.user.domainId;
    var result = {code: 0};
    documentsDao.retrieveList(type, arrayLength, domainId,groupId, function (err, rows, banner) {
        if (err) {
            result.code = 1;
        } else {
            result.data = rows;
            result.banner = banner;
        }
        res.send(result);
    });
});

router.get("/retrieveGroupList", function (req, res) {
    var type = req.param("type");
    var domainId = req.user.domainId;
    documentsDao.retrieveGroupList(type, domainId, function (err, groups) {
        if (err) return res.status(500).send(err.message);
        res.send({code: 0, data: groups});
    });
});

router.get("/searchList", function (req, res) {
    var type = req.param("type");
    var searchKey = req.param("searchKey");
    var arrayLength = req.param("arrayLength");
    var domainId = req.session.passport.user.domainId;
    var result = {code: 0};
    documentsDao.searchList(type, arrayLength, domainId, searchKey, function (err, rows, banner) {
        if (err) {
            result.code = 1;
        } else {
            result.data = rows;
            result.banner = banner;
        }
        res.send(result);
    });
});

router.get("/retrieveDetail", function (req, res) {
    var rid = req.param("rid");
    var result = {code: 0};
    documentsDao.retrieveDetail(rid, function (err, rows) {
        if (err) {
            result.code = 1;
        } else if (rows.length > 0) {
            result.data = rows[0];
        } else {
            result.data = {};
        }
        res.send(result);
    });
});

module.exports = router;

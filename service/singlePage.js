var express = require('express');
var router = express.Router();
var singlePageDao = require('../model/singlePageDao.js');

router.get("/retrieveContent", function (req, res) {
    var domainId=req.session.passport.user.domainId;
    var type = req.param("type");
    var result = {code: 0};
    singlePageDao.retrieveContent(domainId,type,function (err, rows) {
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

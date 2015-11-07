var express = require('express');
var router = express.Router();
var AdviceDao = require('../model/adviceDao.js');
var adviceDao = new AdviceDao();

router.get("/addAdvice", function (req, res) {
    var advice = req.param("advice");
    var result = {code: 0};
    adviceDao.addAdvice(advice,function (err, rows) {
        if(err){
            result.code=1;
        }else{
            result.insertId=rows.insertId;
        }
        res.send(result);
    });
});

module.exports = router;

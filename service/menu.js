var express = require('express');
var router = express.Router();
var weixinUtil = require('../util/weixinUtil.js');
var MenuDao = require('../model/menuDao.js');
var menuDao = new MenuDao();

router.get("/createMenu", function (req, res) {
    var domainId=req.session.passport.user.domainId;
    var result = {code: 0};
    menuDao.getMenuData(domainId,function (menuData) {
        weixinUtil.createMenu(menuData,function(data){
            console.log(menuData);
            console.log(data);
            res.send(result);
        });
    });
});

module.exports = router;

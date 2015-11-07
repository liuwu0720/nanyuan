var express = require('express');
var router = express.Router();
var wechat = require('wechat');
var cfg = require('../conf/server.js');
var weixinUtil = require('../util/weixinUtil.js');

router.use('/', wechat(cfg.token, function (req, res, next) {
    // 微信输入信息都在req.weixin上
    var message = req.weixin;
    var openid=message.FromUserName;
    if(message.MsgType=="text"){
        var content=message.Content;
        res.reply("您好，请按菜单操作");
    }else if(message.MsgType=="image"){
        res.reply("您好，请按菜单操作");
    }else if(message.MsgType=="video"){
        res.reply("您好，请按菜单操作");
    }else if(message.MsgType=="shortvideo"){
        res.reply("您好，请按菜单操作");
    }else if(message.MsgType=="location"){
        res.reply("您好，请按菜单操作");
    }else if(message.MsgType=="link"){
        res.reply("您好，请按菜单操作");
    }else if(message.MsgType=="event"){
        res.reply("您好，请按菜单操作");
    }else if(message.MsgType=="device_text"){
        res.reply("您好，请按菜单操作");
    }else if(message.MsgType=="bind"){
        res.reply("您好，欢迎进入福田综管");
    }
}));

module.exports = router;

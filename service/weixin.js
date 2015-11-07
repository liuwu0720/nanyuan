var express = require('express');
var router = express.Router();
var clientDao = require('../model/clientDao.js');
var weixinUtil = require('../util/weixinUtil.js');
var cfg = require('../conf/server.js');
var os = require('os');

var LOCAL_OS = os.type();
var IS_WIN = LOCAL_OS.indexOf("Win") > -1;

router.get('/access', function (req, res) {
    var url = req.param("url");
    var type = req.param("type");
    var folder=req.param("folder");
    var page=req.param("page");
    var domainId = req.param("domain");
    var state = "base";
    if (!folder) {
        folder=cfg.appname;
    }
    if (!page) {
        page="index";
    }
    if(!url){
        url="http://"+cfg.host+"/app/"+folder+"/"+page+".html?domain="+domainId;
    }
    if (type) {
        if (type == "userinfo") {
            type = "snsapi_userinfo";
            state = "userinfo";
        } else {
            type = "snsapi_base";
        }
    } else {
        type = "snsapi_base";
    }
    var userAgent = req.headers['user-agent'];
    if ((userAgent.indexOf('MicroMessenger') > -1) && (!IS_WIN)) {
        var authUrl = weixinUtil.getAuthUrl(url, type, state);
        res.redirect(authUrl);
    } else {
        res.redirect(url);
    }
});

router.get('/login', function (req, res) {
    var code = req.param("code");
    var domainId = req.param("domainId");
    var url = req.param("url");
    var type = req.param("type");
    var result={code:0};
    weixinUtil.retrieveUserOpenId(code,function (err, data) {
        if (err) {
            result.code = 3;
            res.send(result);
        } else if (data.errcode) {
            result.code = 7;
            res.send(result);
        } else {
            var openid = data.openid;
            result.openid = openid;
            console.log(url);
            weixinUtil.createWeixinConfig(url,function(config){
                result.weixinConfig=config;
                console.log(config);
                clientDao.retrieveClientInfo(openid,domainId,function (err, client,domain) {
                    if(client){
                        result.client = client;
                        result.domain=domain;
                        if (err) {
                            result.code = 4;
                            res.send(result);
                        }else{
                            req.logIn(client, function (err) {
                                if (err) {
                                    result.code = 6;
                                }
                                res.send(result);
                            });
                        }

                    }else{
                        result.code = 99;
                        res.send(result);
                    }
                });
            });
        }
    });
});

function convertUrl(url){
    var sa=url.split("?");
    var pureUrl=sa[0];
    var isFirstParameter=true;
    var parameterStr=sa[1];
    var parameters=parameterStr.split("&");
    for(var i=0;i<parameters.length;i++){
        var couple=parameters[i].split("=");
        var name=couple[0];
        var value=couple[1];
        if(name!="code" && name!="wechat_card_js" && name!="state"){
            if(isFirstParameter){
                isFirstParameter=false;
                pureUrl=pureUrl+"?"+name+"="+value;
            }else{
                pureUrl=pureUrl+"&"+name+"="+value;
            }
        }
    }
    return pureUrl;
}

router.get('/register', function (req, res) {
    var code = req.param("code");
    var domainId = req.param("domainId");
    console.log("-------"+domainId);
    var result = {code: 0};
    weixinUtil.retrieveUserInfo(code,function (data) {
        console.log(JSON.stringify(data));
        if (data.code != 0) {
            result.code = data.code;
            res.send(result);
        } else {
            clientDao.registerClient(data.data,domainId,function (err, client) {
                result.client=client;
                res.send(result);
            });
        }
    });
});

module.exports = router;

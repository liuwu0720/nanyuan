var https = require('https');
var crypto = require('crypto');
var needle = require('needle');
var fs = require('fs');
var async = require('async');
var cfg=require('../conf/server.js');
var commUtil=require('./commUtil.js');
var xml2js = require('xml2js');
var later=require('later');
var jsSHA = require('jssha');

var LOAD_PERIOD=3600;
var scheduledAccessTokenProcess=null;

var APP_ID=cfg.appid;
var APP_SECRET=cfg.appsecret;

var WEIXIN_PAY_NOTIFY_URL="http://"+cfg.host+"/weixin/ordersConfirm";

var weixinTokenUrl="https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+APP_ID+"&secret="+APP_SECRET;
var weixinHttpsServer="api.weixin.qq.com";
var weixinHttpsPort="443";

var weixinCreateMenuPath="/cgi-bin/menu/create?access_token=";
var weixinSendMessagePath="/cgi-bin/message/template/send?access_token=";

var weixinCardGetTicketPath="/cgi-bin/ticket/getticket?type=wx_card&access_token=";
var weixinJsapiGetTicketPath="/cgi-bin/ticket/getticket?type=jsapi&access_token=";

var weixinMediaUrl="http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=";
var weixinAuthUrl="https://open.weixin.qq.com/connect/oauth2/authorize?appid=";
var weixinAccessUrl="https://api.weixin.qq.com/sns/oauth2/access_token?appid=";
var weixinQrcodeUrl="https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=";
var weixinUserinfoUrl="https://api.weixin.qq.com/sns/userinfo?access_token=";

var weixinOrderUrl="https://api.mch.weixin.qq.com/pay/unifiedorder";
var weixinOrderPath="/pay/unifiedorder";
var weixinOrderServer="api.mch.weixin.qq.com";
var weixinOrderPort="443";

var commonHttpsRequest=function(url,cb){
    https.get(url, function(res) {
        var code = res.statusCode;
        var content='';
        if (code == 200) {
            res.on('data', function(data) {
                try {
                    content=content+data;
                    var result=JSON.parse(content);
                    cb(null,result);
                } catch (err) {
                    cb(err);
                }
            });
        } else {
            cb({ code: code });
        }
    }).on('error', function(e) { cb(e); });
}

exports.httpsRequest=function(url,cb){
    commonHttpsRequest(url,cb);
}

var commonHttpsPost=function(url,server,port,xml,cb){
    var length = Buffer.byteLength(xml);
    var opt = {
        method: "POST",
        host: server,
        port: port,
        path: url,
        headers: {
            "Content-Type": 'text/xml; charset=utf-8',
            "Content-Length": (length+'')
        }
    };
    var req = https.request(opt, function (serverFeedback) {
        if (serverFeedback.statusCode == 200) {
            var content = "";
            serverFeedback.on('data', function (data) { content += data; })
                .on('end', function () { cb(content); });
        }
        else {
            cb(null);
        }
    });
    req.write(xml);
    req.end();
}

var commonHttpsPostJson=function(url,server,port,obj,cb){
    var value=JSON.stringify(obj);
    var length = Buffer.byteLength(value);
    var opt = {
        method: "POST",
        dataType: 'json',
        host: server,
        port: port,
        path: url,
        headers: {
            "Content-Type": 'application/json;charset=utf-8',
            "Content-Length": (length+'')
        }
    };
    var req = https.request(opt, function (serverFeedback) {
        if (serverFeedback.statusCode == 200) {
            var content = "";
            serverFeedback.on('data', function (data) { content += data; })
                .on('end', function () {
                    cb(JSON.parse(content));
                });
        }
        else {
            cb(null);
        }
    });
    req.write(value);
    req.end();
}

exports.objectToXml=function(obj){
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(obj);
    return xml;
}

exports.xmlToObject=function(xml,cb){
    var parseString = xml2js.parseString;
    parseString(xml, function (err, result) {
        cb(result);
    });
}

exports.convertCreatedOrder=function(createdOrder,mch_key){
    createdOrder.nonceStr=getNonceStr(32);
    var paySign="appId="+createdOrder.appId+
        "&nonceStr="+createdOrder.nonceStr+
        "&package="+createdOrder.package+
        "&signType="+createdOrder.signType+
        "&timeStamp="+createdOrder.timeStamp+
        "&key="+mch_key;
    paySign=crypto.createHash('md5').update(paySign).digest("hex");
    paySign=paySign.toUpperCase();
    createdOrder.paySign=paySign;
    return createdOrder;
}

var getNonceStr=function(len){
    var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    var maxPos = $chars.length;
    var result = '';
    for (i = 0; i <len; i++) {
        result += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
}
var createSign=function(order,mch_key){
    var sign="appid="+order.appid+
        "&body="+order.body+
        "&mch_id="+order.mch_id+
        "&nonce_str="+order.nonce_str+
        "&notify_url="+order.notify_url+
        (order.openid==''?'':("&openid="+order.openid))+
        "&out_trade_no="+order.out_trade_no+
        "&product_id="+order.product_id+
        "&spbill_create_ip="+order.spbill_create_ip+
        "&total_fee="+order.total_fee+
        "&trade_type="+order.trade_type+
        '&key='+mch_key;
    sign=crypto.createHash('md5').update(sign,"utf8").digest("hex");
    sign=sign.toUpperCase();
    order.sign=sign;
}

var createOrderXml=function(order){
    var xml='<xml>'+
        '<appid><![CDATA['+order.appid+']]></appid>'+
        '<body><![CDATA['+order.body+']]></body>'+
        '<mch_id>'+order.mch_id+'</mch_id>'+
        '<nonce_str><![CDATA['+order.nonce_str+']]></nonce_str>'+
        '<notify_url><![CDATA['+order.notify_url+']]></notify_url>'+
        '<openid><![CDATA['+order.openid+']]></openid>'+
        '<out_trade_no><![CDATA['+order.out_trade_no+']]></out_trade_no>'+
        '<product_id><![CDATA['+order.product_id+']]></product_id>'+
        '<spbill_create_ip><![CDATA['+order.spbill_create_ip+']]></spbill_create_ip>'+
        '<total_fee>'+order.total_fee+'</total_fee>'+
        '<trade_type><![CDATA['+order.trade_type+']]></trade_type>'+
        '<sign><![CDATA['+order.sign+']]></sign>'+
        '</xml>';
    return xml;
}

exports.createPaymentOrder=function(app_id,mch_id,mch_key,openid,trade_type,body ,out_trade_no,total_fee,product_id,cb){
    var _this=this;
    var order={appid:app_id,
        mch_id:mch_id,
        nonce_str:getNonceStr(32),
        sign:'',
        body:body,
        out_trade_no:out_trade_no,
        total_fee:1,//parseInt(total_fee*100),
        spbill_create_ip:cfg.ipAddress,
        notify_url:WEIXIN_PAY_NOTIFY_URL,
        trade_type:trade_type,
        openid:openid,
        product_id:product_id
    };
    createSign(order,mch_key);
    var xml=createOrderXml(order);
    commonHttpsPost(weixinOrderPath,weixinOrderServer,weixinOrderPort,xml,function(result){
        _this.xmlToObject(result,function(obj){
            cb(obj);
        });
    });
}

exports.createWeixinPaymentOrder=function(app_id,mch_id,mch_key,openid,body ,out_trade_no,total_fee,product_id,cb){
    this.createPaymentOrder(app_id,mch_id,mch_key,openid,'JSAPI',body ,out_trade_no,total_fee,product_id,cb);
}

exports.createNativePaymentOrder=function(app_id,mch_id,mch_key,body ,out_trade_no,total_fee,product_id,cb){
    this.createPaymentOrder(app_id,mch_id,mch_key,'','NATIVE',body ,out_trade_no,total_fee,product_id,cb);
}

exports.createSystemPaymentOrder=function(body ,out_trade_no,total_fee,cb){
    this.createNativePaymentOrder(cfg.defaultApp.appId,cfg.defaultApp.mch_id,cfg.defaultApp.mch_key,body,out_trade_no,total_fee,out_trade_no,cb);
}

exports.createTestPaymentOrder=function(app_id,mch_id,mch_key,body ,out_trade_no,total_fee,cb){
    this.createNativePaymentOrder(app_id,mch_id,mch_key,body,out_trade_no,total_fee,out_trade_no,cb);
}
var createNonceStr = function () {
    return Math.random().toString(36).substr(2, 15);
};

var createTimestamp = function () {
    return parseInt(new Date().getTime() / 1000) + '';
};

var raw = function (args) {
    var keys = Object.keys(args);
    keys = keys.sort()
    var newArgs = {};
    keys.forEach(function (key) {
        newArgs[key.toLowerCase()] = args[key];
    });

    var string = '';
    for (var k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
};

var createSign = function (jsapi_ticket, url,nonceStr,timestamp) {
    var ret = {
        jsapi_ticket: jsapi_ticket,
        nonceStr: nonceStr,
        timestamp: timestamp,
        url: url
    };
    var string = raw(ret);
    jsSHA = require('jssha');
    var shaObj = new jsSHA(string, 'TEXT');
    ret.signature = shaObj.getHash('SHA-1', 'HEX');
    return ret.signature;
};

exports.createWeixinConfig=function(url,cb){
    var nonceStr=createNonceStr();
    var timestamp=createTimestamp();
    var index=url.indexOf('#');
    if(index>0){
        url=url.substring(0,index);
    }
    this.getJsapiTicket(function(ticket){
        var sign=createSign(ticket,url,nonceStr,timestamp);
        var config={
            debug: false,
            //jsapi_ticket: ticket,
            appId:cfg.appid,
            timestamp:timestamp,
            nonceStr:nonceStr,
            signature:sign,
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'startRecord',
                'stopRecord',
                'onVoiceRecordEnd',
                'playVoice',
                'pauseVoice',
                'stopVoice',
                'onVoicePlayEnd',
                'uploadVoice',
                'downloadVoice',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'translateVoice',
                'getNetworkType',
                'openLocation',
                'getLocation',
                'hideOptionMenu',
                'showOptionMenu',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'closeWindow',
                'scanQRCode',
                'chooseWXPay',
                'openProductSpecificView',
                'addCard',
                'chooseCard',
                'openCard'
            ]
        }
        cb(config);
    });
}
/*
exports.createWeixinConfig=function(url,cb){
    var noncestr=getNonceStr(16);
    var timestamp=new Date().getTime();
    var index=url.indexOf('#');
    if(index>0){
        url=url.substring(0,index);
    }
    this.getJsapiTicket(function(ticket){
        var sign="jsapi_ticket="+ticket+
            "&noncestr="+noncestr+
            "&timestamp="+timestamp+
            "&url="+url;
        sign=crypto.createHash('sha1').update(sign,"utf8").digest("hex");
        var config={
            debug: false,
            appId:cfg.appid,
            timestamp:timestamp,
            nonceStr:noncestr,
            signature:sign,
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'startRecord',
                'stopRecord',
                'onVoiceRecordEnd',
                'playVoice',
                'pauseVoice',
                'stopVoice',
                'onVoicePlayEnd',
                'uploadVoice',
                'downloadVoice',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'translateVoice',
                'getNetworkType',
                'openLocation',
                'getLocation',
                'hideOptionMenu',
                'showOptionMenu',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'closeWindow',
                'scanQRCode',
                'chooseWXPay',
                'openProductSpecificView',
                'addCard',
                'chooseCard',
                'openCard'
            ]
        }
        cb(config);
    });
}
*/
exports.getUserInfo=function(openId,accessToken,cb){
    var url=weixinUserinfoUrl+accessToken+"&openid="+openId+"&lang=zh_CN";
    commonHttpsRequest(url,function(err,data){
        cb(err,data);
    });
}

exports.retrieveUserOpenId=function(code,cb){
    if(code=='WEGOV'){
        cb(null,{openid:'WEGOV00001'});
    }else{
        var url = weixinAccessUrl + APP_ID +"&secret="+APP_SECRET+ "&code=" + code + "&grant_type=authorization_code";
        commonHttpsRequest(url, function (err, data) {
            cb(err, data);
        });
    }
}

exports.retrieveUserInfo=function(code,cb){
    var _this=this;
    this.retrieveUserOpenId(code,function(err,data){
        var result={code:0};
        if(err){
            result.code=1;
            cb(result);
        }else if(data.errcode){
            result.code=4;
            cb(result);
        }else{
            if(data.access_token) {
                _this.getUserInfo(data.openid, data.access_token, function (error, userinfo) {
                    if (error) {
                        result.code = 2;
                    }else if(userinfo.errcode){
                        result.code=3;
                    }else{
                        result.data=userinfo;
                    }
                    cb(result);
                });
            }else{
                result.code=5;
                cb(result);
            }
        }
    });
}

exports.getAuthUrl=function(url,scope,state){
    var index=url.indexOf('wechat_card_js=1');
    if(index<0){
        index=url.indexOf('?');
        if(index>=0){
            url=url+'&wechat_card_js=1';
        }else{
            url=url+'?wechat_card_js=1';
        }
    }
    url=encodeURIComponent(url);
    var authUrl=weixinAuthUrl+APP_ID+"&redirect_uri="+url+"&response_type=code&scope="+scope+"&state="+state+"#wechat_redirect";
    return authUrl;
}

exports.refreshCardTicket=function(token,cb){
    var url="https://"+weixinHttpsServer+weixinCardGetTicketPath+ token;
    this.httpsRequest(url,function(err,data){
        var ticket=null;
        if(data.errcode==0){
            ticket=data.ticket;
        }else{
            console.log(data);
        }
        cb(ticket);
    });
}

exports.refreshJsapiTicket=function(token,cb){
    var url="https://"+weixinHttpsServer+weixinJsapiGetTicketPath+ token;
    this.httpsRequest(url,function(err,data){
        var ticket=null;
        if(data.errcode==0){
            ticket=data.ticket;
        }else{
            console.log(data);
        }
        cb(ticket);
    });
}

exports.getAccessToken = function (cb){
    redis_cli.get("access_token",function(err,value){
        cb(value);
    });
};

exports.setAccessToken = function (token,cb){
    redis_cli.set("access_token",token,cb);
}

exports.getCardTicket = function (cb){
    redis_cli.get("card_ticket",function(err,value){
        cb(value);
    });
};

exports.setCardTicket = function (ticket,cb){
    redis_cli.set("card_ticket",ticket,cb);
}

exports.getJsapiTicket = function (cb){
    redis_cli.get("jsapi_ticket",function(err,value){
        cb(value);
    });
};

exports.setJsapiTicket = function (ticket,cb){
    redis_cli.set("jsapi_ticket",ticket,cb);
}

exports.clearAccessTokenProcess=function(){
    if(scheduledAccessTokenProcess){
        clearInterval(scheduledAccessTokenProcess);
        scheduledAccessTokenProcess=null;
    }
}

exports.refreshTicket=function(token){
    var _this=this;
    /*
    _this.refreshCardTicket(token,function(ticket){
        if(ticket){
            _this.setCardTicket(ticket);
        }else{
            console.log("cannot get new card ticket");
        }
    });*/
    _this.refreshJsapiTicket(token,function(ticket){
        if(ticket){
            console.log('get jsapi ticket-->'+ticket);
            _this.setJsapiTicket(ticket);
        }else{
            console.log("cannot get new jsapi ticket");
        }
    });
}

exports.refreshAccessToken=function(cb){
    this.httpsRequest(weixinTokenUrl,function(err,data){
        var token=null;
        if(data.errcode){
            console.log('cannot get access token');
            console.log(data);
        }else{
            token=data.access_token;
        }
        console.log('get access token-->'+token);
        cb(token);
    });
}

exports.loadAccessToken=function(){
    var _this=this;
    _this.refreshAccessToken(function(token){
        _this.setAccessToken(token,function(){
            _this.refreshTicket(token);
        });
    });
}

exports.createAccessTokenSchedule=function(){
    var _this=this;
    _this.clearAccessTokenProcess();
    _this.loadAccessToken();
    scheduledAccessTokenProcess=setInterval(function(){
        console.log("--------start to load access token"+new Date());
        _this.loadAccessToken();
    },LOAD_PERIOD*1000);
}

/*
exports.clearAccessTokenProcess=function(){
    if(scheduledAccessTokenProcess){
        scheduledAccessTokenProcess.clear();
    }
}

exports.createAccessTokenSchedule=function(){
    var _this=this;
    var scheduleTime=new Date();
    var mi=scheduleTime.getMinutes();
    var se=scheduleTime.getSeconds();
    var thisSchedule=later.parse.recur().on(mi).minute().on(se).second();
    this.clearAccessTokenProcess();
    _this.loadAccessToken();
    scheduledAccessTokenProcess=later.setInterval(function() {
        console.log("--------start to load access token");
        _this.loadAccessToken();
    }, thisSchedule);
} */

exports.createMenu=function(menu,cb){
    var _this=this;
    _this.getAccessToken(function(token){
        commonHttpsPostJson(weixinCreateMenuPath + token, weixinHttpsServer, weixinHttpsPort, menu, cb);
    });
}

exports.sendMessage=function(openid,templateId,url,data,cb){
    var _this=this;
    var message={touser:openid,template_id:templateId,url:url,topcolor:"#FF0000",data:data};
    console.log(JSON.stringify(message));
    _this.getAccessToken(function(token){
        console.log("token"+token);
        commonHttpsPostJson(weixinSendMessagePath + token, weixinHttpsServer, weixinHttpsPort, message, function(result){
            console.log(result);
            if(result.errcode==0){
                cb(true);
            }else{
                cb(false);
            }
        });
    });
}

exports.createFolder=function(path,cb){
    fs.exists(path, function (exists) {
        if (exists) {
            cb();
        }
        else {
            fs.mkdir(path, function () {
                cb();
            });
        }
    });
}

exports.convertImageUrl=function(url){
    if(url.indexOf("http://")<0){
        url="http://"+cfg.host+url;
    }
    return url;
}

exports.retrieveImagesFromWeixin=function(serverIds,compressImageFile,cb){
    var _this=this;
    this.getAccessToken(function(token){
        var url=weixinMediaUrl+token+"&media_id=";
        var subfoler=commUtil.fromDateToStr(new Date(), 'yyyyMMdd')+"/";
        var folder="public/repository/";
        _this.createFolder(folder+subfoler,function(){
            var urls=new Array();
            async.eachSeries(serverIds, function (serverId,callback) {
                var fileName=serverId+".jpg";
                needle.get(url+serverId,{output:folder+fileName}, function(err, resp, body) {
                    if(err){
                        callback(err,body);
                    }else{
                        compressImageFile(folder+fileName,folder+subfoler+fileName,function(result){
                            if(result){
                                urls.push("/repository/"+subfoler+fileName);
                                callback(null,null);
                            }else{
                                callback("ERROR",null);
                            }
                        });
                    }
                });
            }, function (err) {
                if(err){
                    cb(null);
                }else{
                    cb(urls);
                }
            });
        });
    });
}

exports.retrieveShortvideoFromWeixin=function(mediaId,cb){
    var _this=this;
    this.getAccessToken(function(token){
        var url=weixinMediaUrl+token+"&media_id=";
        var subfolder=commUtil.fromDateToStr(new Date(), 'yyyyMMdd')+"/"
        var folder="public/repository/"+subfolder;
        _this.createFolder(folder,function(){
            var fileName=mediaId+".mp4";
            needle.get(url+mediaId,{output:folder+fileName}, function(err, resp, body) {
                if(err){
                    cb(err,body);
                }else{
                    var fileurl="/repository/"+subfolder+fileName;
                    cb(null,fileurl);
                }
            });
        });
    });
}

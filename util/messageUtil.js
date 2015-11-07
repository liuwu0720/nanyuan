var weixinUtil=require('./weixinUtil.js');
var commUtil=require('./commUtil.js');
var cfg=require('../conf/server.js');
var ClientDao=require('../model/clientDao.js');
var clientDao=new ClientDao();

var MESSAGE_URL="http://"+cfg.host+"/weixin/access";

exports.sendEmergencyTemplateMessage=function(domainId,from,to,toOpenid,number,type){
    if(toOpenid&&toOpenid.length>0){
        var templateId=cfg.emergencyMessageTemplate;
        var messageUrl="http://"+cfg.host+"/app/weixin/access?folder=wegov&page=2.2xinxikuaibao&domain="+domainId;
        var title="";
        if(type==1){
            title= to + "您好，"+from+"向您汇报"+number+"个重大事件";
        }else{
            title= to + "您好，"+from+"向您汇报"+number+"【今日无重大事项发生】";
        }
        var data = {
            "first": {

                "value": title,
                "color": "#173177"
            },
            "keyword1": {
                "value": commUtil.fromDateToStr(new Date(),"yyyy-MM-dd hh:mm"),
                "color": "#173177"
            },
            "keyword2": {
                "value": "福田综管重大信息上报",
                "color": "#173177"
            },
            "remark": {
                "value": "点击查看详情",
                "color": "#3eaf0e"
            }
        };
        weixinUtil.sendMessage(toOpenid,templateId,messageUrl,data,function(){});
    }
}

exports.sendEmergencyReturnTemplateMessage=function(domainId,from,to,toOpenid,reason){
    if(toOpenid&&toOpenid.length>0) {
        var templateId = cfg.emergencyMessageTemplate;
        var messageUrl = "http://" + cfg.host + "/app/weixin/access?folder=wegov&page=2.1xinxikuaicai&domain=" + domainId;
        var title = to + "您好，" + from + "将您上报的事件退回，请按照要求修改后再上报";
        var data = {
            "first": {
                "value": title,
                "color": "#173177"
            },
            "keyword1": {
                "value": commUtil.fromDateToStr(new Date(), "yyyy-MM-dd hh:mm"),
                "color": "#173177"
            },
            "keyword2": {
                "value": "福田综管重大信息退回",
                "color": "#173177"
            },
            "remark": {
                "value": reason + "【点击进入修改】",
                "color": "#3eaf0e"
            }
        };
        weixinUtil.sendMessage(toOpenid, templateId, messageUrl, data, function () {
        });
    }
}

exports.sendEmergencyReturnBackTemplateMessage=function(domainId,from,to,toOpenid){
    if(toOpenid&&toOpenid.length>0) {
        var templateId = cfg.emergencyMessageTemplate;
        var messageUrl="http://"+cfg.host+"/app/weixin/access?folder=wegov&page=2.2xinxikuaibao&domain="+domainId;
        var title = to + "您好，" + from + "已经将退回的事件修改完成，并且再次上报";
        var data = {
            "first": {
                "value": title,
                "color": "#173177"
            },
            "keyword1": {
                "value": commUtil.fromDateToStr(new Date(), "yyyy-MM-dd hh:mm"),
                "color": "#173177"
            },
            "keyword2": {
                "value": "福田综管重大信息上报",
                "color": "#173177"
            },
            "remark": {
                "value": "点击查看详情",
                "color": "#3eaf0e"
            }
        };
        weixinUtil.sendMessage(toOpenid, templateId, messageUrl, data, function () {
        });
    }
}
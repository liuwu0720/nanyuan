var weixinUtil=require('./weixinUtil.js');
var commUtil=require('./commUtil.js');
var cfg=require('../conf/server.js');
var clientDao=require('../model/clientDao.js');

var MESSAGE_URL="http://"+cfg.host+"/weixin/access";

exports.sendEmergencyTemplateMessage=function(domainId,from,to,toOpenid,number,type){
    if(toOpenid&&toOpenid.length>0){
        var templateId=cfg.emergencyMessageTemplate;
        var messageUrl="http://"+cfg.host+"/app/weixin/access?folder=wegov&page=2.2xinxikuaibao&domain="+domainId;
        var title="";
        title= to + "您好，"+from+"向您汇报"+number+"个随手拍事件";
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
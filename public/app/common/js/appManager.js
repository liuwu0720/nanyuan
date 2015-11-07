function AppManager(){
    this.client=null;
    this.domain=null;
    this.openid=null;
    this.weixinConfig=null;
    this.attachedUrl=null;

    this.login=function(cb,type){
        var _this=this;
        var url=window.location.href;
        var code = getQueryString("code");
        var domainId = getQueryString("domain");
        if(code){
            if(code.length>0){
                ajaxGet('/weixin/login',
                    {code:code,url:url,type:type,domainId:domainId},
                    function(data) {
                        if(data.openid){
                            _this.openid=data.openid;
                        }else{
                            url=convertUrl(url);
                            var redirectUrl='http://'+window.location.host+"/app/weixin/access?url="+url;
                            window.location.href=redirectUrl;
                        }
                        if(data.code==0){
                            _this.client=data.client;
                            _this.domain=data.domain;
                            _this.weixinConfig=data.weixinConfig;
                            if(_this.weixinConfig){
                                try{
                                    _this.initWeixinConfig(_this.weixinConfig);
                                }catch(err){
                                }
                            }
                            cb(_this.client,_this.domain);
                        }else if(data.code==99){
                            cb("new_client",null);
                        }else{
                            cb(null,null);
                        }
                    }
                );
            }else{
                cb(null,null,null);
            }
        }
    }

    this.initWeixinConfig=function(config){
        wx.config(config);
        wx.ready(function(){
            wx.showOptionMenu();
            wx.hideMenuItems({
                menuList: [
                    "menuItem:refresh",
                    "menuItem:share:qq",
                    "menuItem:share:weiboApp",
                    "menuItem:share:facebook",
                    "menuItem:openWithQQBrowser",
                    "menuItem:openWithSafari"
                ]
            });
            shareManager.initShare();
        });
        wx.error(function(res){
            alert('微信初始化出错，可能导致系统某些功能无法正常运行');
        });
    }

    this.register=function(cb){
        var _this=this;
        var code = getQueryString("code");
        var domainId = getQueryString("domain");
        if(code){
            if(code.length>0){
                ajaxGet('/weixin/register',
                    {code:code,domainId:domainId},
                    function(data) {
                        if(data.openid){
                            _this.openid=data.openid;
                        }
                        if(data.code==0){
                            _this.client=data.client;
                            _this.attachedUrl=data.attachedUrl;
                            cb(_this.client);
                        }else{
                            cb(null);
                        }
                    }
                );
            }else{
                cb(null);
            }
        }
    }

    this.init=function(cb){
        var _this=this;
        var code = getQueryString("code");
        var state= getQueryString("state");
        if(code){
            if(code.length>0){
                if(state=="base"){
                    $.ajax({
                        type: "GET",
                        url:'/weixin/getUserOpenId',
                        data:{code:code},
                        dataType:'json',
                        success: function(data) {
                            if(data.code==0){
                                _this.currentUserOpenId=data.data.openid;
                                cb(_this.currentUserOpenId);
                            }
                        }
                    });
                }else{
                    $.ajax({
                        type: "GET",
                        url:'/weixin/getUserInfo',
                        data:{code:code},
                        dataType:'json',
                        success: function(data) {
                            if(data.code==0){
                                _this.currentUserOpenId=data.data.openid;
                                _this.currentUserInformation=data.data;
                                cb(_this.currentUserOpenId);
                            }
                        }
                    });
                }
            }else{
                cb("");
            }
        }else{
            cb("");
        }
    }

    /**
     * 将普通链接转换为可以通过微信认证redirect的链接，从而得到用户OPEN ID
     * @param url
     * @returns {string}
     */
    this.convertUrlWithWeixinAuth=function(url){
        return this.convertUrlWithWeixinAuthCommand(url,false);
    }

    this.convertUrlWithWeixinAuthUserInfo=function(url){
        return this.convertUrlWithWeixinAuthCommand(url,true);
    }

    this.convertUrlWithWeixinAuthCommand=function(url,withUserInfo){
        var host=window.location.host;
        if(url.indexOf("http")<0){
            url='http://'+host+url;
        }
        if(withUserInfo){
            url="http://"+host+"/app/weixin/access?type=userinfo&url="+encodeURIComponent(url);
        }else{
            url="http://"+host+"/app/weixin/access?url="+encodeURIComponent(url);
        }
        return url;
    }


    this.convertImageUrl=function(url){
        if(url.indexOf('http')>=0||url.indexOf('HTTP')>=0){
            return url;
        }else{
            return ('http://'+window.location.host+url);
        }
    }
}
var appManager=new AppManager();


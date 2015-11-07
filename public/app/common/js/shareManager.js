var ShareManager=function(){
    var shareInfoHandler=null;
    this.uploadedFilesList=[];
    this.serverCachedFileHandler=null;
    this.onWeixinReadyHandler=null;
};

ShareManager.prototype.setServerCachedFileHandler=function(thisHandler){
    this.serverCachedFileHandler=thisHandler;
}

ShareManager.prototype.setShareInfoHandler=function(thisHandler){
    this.shareInfoHandler=thisHandler;
}

ShareManager.prototype.getWxShareImgUrl=function() {
    var img_url = null;
    if(this.shareInfoHandler){
        img_url=this.shareInfoHandler.getWxShareImgUrl();
    }
    return img_url;
}

ShareManager.prototype.getWxShareLink=function() {
    var link = null;
    if(this.shareInfoHandler){
        link=this.shareInfoHandler.getWxShareLink();
    }
    return link;
}

ShareManager.prototype.getWxShareDesc=function() {
    var desc = null;
    if(this.shareInfoHandler){
        desc=this.shareInfoHandler.getWxShareDesc();
    }
    return desc;
}

ShareManager.prototype.getWxShareTitle=function() {
    var title=null;
    if(this.shareInfoHandler){
        title=this.shareInfoHandler.getWxShareTitle();
    }
    return title;
}

ShareManager.prototype.shareDataToServer=function(type){
    if(this.shareInfoHandler){
        this.shareInfoHandler.shareDataToServer(type);
    }
}

ShareManager.prototype.shareSwitchCheck=function(newScreen,oldScreen){
    if(this.shareInfoHandler){
        if(this.shareInfoHandler.shareSwitchCheck(newScreen,oldScreen)){
            this.initShare();
        }
    }
}

ShareManager.prototype.initShare=function(){
    var _this=this;
    var title=this.getWxShareTitle();
    var link=this.getWxShareLink();
    var imgUrl=this.getWxShareImgUrl();
    var desc=this.getWxShareDesc();
    if(this.onWeixinReadyHandler){
        this.onWeixinReadyHandler();
    }
    wx.onMenuShareTimeline({
        title: title,
        link: link,
        imgUrl:imgUrl,
        success: function () {
            _this.shareDataToServer('T');
        },
        cancel: function () {
        }
    });
    wx.onMenuShareAppMessage({
        title: title,
        link: link,
        imgUrl:imgUrl,
        desc:desc,
        success: function () {
            _this.shareDataToServer('F');
        },
        cancel: function () {
        }
    });
}

ShareManager.prototype.imagePreview=function(current,urls){
    wx.previewImage({
        current:current,
        urls: urls
    });
}

ShareManager.prototype.chooseImage=function(cb){
    wx.chooseImage({
        success: function (res) {
            var localIds = res.localIds;
            cb(localIds);
        },
        cancel: function () {
            cb(null);
        }
    });
}

ShareManager.prototype.uploadImage=function(localId,cb){
    wx.uploadImage({
        localId:localId,
        isShowProgressTips:1,
        success: function (res) {
            var serverId = res.serverId;
            cb(serverId);
        },
        cancel: function () {
            cb(null);
        },
        fail: function (res) {
            cb(null);
        }
    });
}

ShareManager.prototype.uploadImageWithUrl=function(localId,relatedData,cb){
    this.uploadImage(localId,function(serverId){
        if(serverId){
            ajaxPost('/upload/getImageFromWeixin',{serverIds:[serverId],localIds:[localId],data:relatedData},function(result){
                if(result.code==0){
                    cb(result.urls[0]);
                }else{
                    cb(null);
                }
            });
        }else{
            cb(null);
        }
    });
}

ShareManager.prototype.chooseAndUploadImage=function(maxFiles,relatedData,startCB,stepCb,completeCb){
    var _this=this;
    _this.chooseImage(function(localIds){
        if(localIds==null){
            completeCb(1);
        }else{
            if(localIds.length>maxFiles){
                completeCb(2);
            }else{
                setTimeout(function(){
                    startCB(localIds);
                    async.eachSeries(localIds, function (localId,callback) {
                        var cachedUrl=_this.uploadedFilesList[localId];
                        if(cachedUrl){
                            stepCb(cachedUrl);
                            callback();
                        }else{
                            _this.uploadImageWithUrl(localId,relatedData,function(url){
                                if(url){
                                    _this.uploadedFilesList[localId]=url;
                                    stepCb(url);
                                    callback();
                                }else{
                                    if(_this.serverCachedFileHandler){
                                        _this.serverCachedFileHandler(localId,relatedData,function(serverCachedUrl){
                                            if(serverCachedUrl){
                                                _this.uploadedFilesList[localId]=serverCachedUrl;
                                                stepCb(serverCachedUrl);
                                                callback();
                                            }else{
                                                callback({errorCode:3});
                                            }
                                        });
                                    }else{
                                        callback({errorCode:3});
                                    }
                                }
                            });
                        }
                    }, function (err) {
                        if(err){
                            completeCb(err.errorCode);
                        }else{
                            completeCb(0);
                        }
                    });
                },100);
            }
        }
    });
}

ShareManager.prototype.closeWindow=function(){
    wx.closeWindow();
}
ShareManager.prototype.scanQRCode=function(cb){
    wx.scanQRCode({
        needResult: 1,
        scanType: ["qrCode","barCode"],
        success: function (res) {
            var result = res.resultStr;
            cb(result);
        }
    });
}

ShareManager.prototype.openLocation=function(latitude,longitude,name,address,infoUrl){
    latitude=parseFloat(latitude);
    longitude=parseFloat(longitude);
    latitude=Math.round(latitude*1000000)/1000000;
    longitude=Math.round(longitude*1000000)/1000000;
    wx.openLocation({
        latitude: latitude,
        longitude: longitude,
        name: name,
        address:address,
        scale: 20,
        infoUrl:infoUrl
    });
}

ShareManager.prototype.getLocation=function(cb){
    wx.getLocation({
        type: 'gcj02',
        success: function (res) {
            var latitude = res.latitude;
            var longitude = res.longitude;
            cb(latitude,longitude);
        },
        cancel: function () {
            cb(null,null);
        },
        fail: function (res) {
            cb(null,null);
        }
    });
}

ShareManager.prototype.getGpsLocation=function(cb){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            cb(position.coords.latitude,position.coords.longitude);
        },function(err){
            cb(null,null);
        });
    }else{
        cb(null,null);
    }
}
/*
ShareManager.prototype.getGpsLocation=function(cb){
    wx.getLocation({
        type: 'wgs84',
        success: function (res) {
            var latitude = res.latitude;
            var longitude = res.longitude;
            cb(latitude,longitude);
        },
        cancel: function () {
            cb(null,null);
        },
        fail: function (res) {
            cb(null,null);
        }
    });
}
*/
ShareManager.prototype.weixinPayment=function(paymentOrder,cb){
    wx.chooseWXPay({
        timestamp:paymentOrder.timeStamp,
        nonceStr:paymentOrder.nonceStr,
        package:paymentOrder.package,
        signType:paymentOrder.signType,
        paySign:paymentOrder.paySign,
        success: function (res) {
            cb(true);
        },
        fail: function (res) {
            cb(false);
        },
        cancel: function (res) {
            cb(false);
        }
    });
}

var shareManager=new ShareManager();

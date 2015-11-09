avalon.filters.distanceFormat = function (value) {
    if(value){
        var result=parseFloat(value);
        if(result<1){
            result=parseInt(result*1000)+"米";
        }else if(result<10){
            result=parseFloat(result).toFixed(1)+"公里";
        }else if(result>=10){
            result=parseInt(result)+"公里";
        }
    }else{
        var result="";
    }
    return result;
};

avalon.filters.dateFormat = function (value) {
    var nowDate=new Date();
    var yestDate=new Date((nowDate/1000-86400)*1000);
    var nowStr=fromDateToStr(nowDate,'yyyy-MM-dd');
    var yestStr=fromDateToStr(yestDate,'yyyy-MM-dd');
    var result=null;
    if(value==nowStr){
        result="今天";
    }else if(value==yestStr){
        result="昨天";
    }else{
        result=fromDateToStr(fromStrToDate(value),'MM月dd日');
    }
    return result;
};

avalon.filters.delayFormat = function (delayHour) {
    var result="";
    if(delayHour==0){
        result="立即上报";
    }else{
        var hour=parseInt(delayHour);
        if(hour>0){
            result=hour+"小时";
        }
        var minute=parseInt((delayHour-hour)*60);
        result=result+minute+"分钟";
    }
    return result;
};

avalon.filters.currencyFilter = function (value) {
    var newValue = parseFloat(value);
    newValue=newValue.toFixed(2);
    return newValue;
}

var clientInfoModel=createModel('clientInfo',function(modelName){
    return avalon.define(modelName, function (vm) {
        vm.domainInfo={domainId:0,domainName:'',logo:'',status:'',tel:''};
        vm.clientDetail={
            rid:0,
            headimgurl:null,
            username:null,
            nickname:null,
            mobile:null,
            sex:null,
            status:null,
            dusername:null,
            politics:null,
            departmentId:0,
            department:null,
            role:null,
            starLevel:0,
            managerLevel:0
        };
        vm.currentAddress="";
        vm.screen="Main";
        vm.$scrollRefreshHandler=null;
        vm.$initializeHandler=null;
        vm.$initializeStatus='N';

        vm.currentTabPage=0;
        vm.$initPageParameters={news:{type:1},documents:{type:1}};
        vm.setCurrentTabPage=function(page){
            vm.currentTabPage=page;
        }

        vm.openScreen=function(screen){
            window.location.href='#frame'+screen;
        }

        vm.onScreenChange=function(screen){
        }

        vm.setScrollRefreshHandler=function(handler){
            vm.$scrollRefreshHandler=handler;
        }

        vm.onScrollRefreshScreen=function(){
            if(vm.$scrollRefreshHandler){
                vm.$scrollRefreshHandler();
            }
        }

        vm.gotoAccessRightScreen=function(folder,page,nextFolder,nextPage){
            vm.initTabEvent();
            var url=null;
            var needRegister=false;
            if(vm.clientDetail.status =="T"){
                needRegister=true;
                url=appManager.convertUrlWithWeixinAuthUserInfo("/nanyuan/app/"+folder+"/"+page+".html?wechat_card_js=1&folder="+nextFolder+"&page="+nextPage+"&domain="+vm.domainInfo.domainId);
            }
            if(needRegister){
                window.location.href=url;
            }else{
                return needRegister;
            }
        }

        vm.gotoRegisterScreen=function(folder,page,nextFolder,nextPage){
            vm.initTabEvent();
            var url=null;
            var needRegister=false;
            if(vm.clientDetail.status =="R"){
                needRegister=true;
                url=appManager.convertUrlWithWeixinAuth("/nanyuan/app/"+folder+"/"+page+".html?type=S&wechat_card_js=1&folder="+nextFolder+"&page="+nextPage+"&domain="+vm.domainInfo.domainId);
            }else if(vm.clientDetail.status =="T"){
                needRegister=true;
                url=appManager.convertUrlWithWeixinAuthUserInfo("/nanyuan/app/"+folder+"/"+page+".html?wechat_card_js=1&folder="+nextFolder+"&page="+nextPage+"&domain="+vm.domainInfo.domainId);
            }
            if(needRegister){
                window.location.href=url;
            }else{
                //shareManager.onWeixinReadyHandler=function(){
                    vm.traceLocationInfo();
                //}
                return needRegister;
            }
        }

        vm.initTabEvent=function(){
            var tab=null;
            try{
                tab = new fz.Scroll('.ui-tab', {
                    role: 'tab'
                });
            }catch(e){
                tab=null;
            }
        }

        vm.traceLocationInfo=function(){
            shareManager.getGpsLocation(function(latitude,longitude){
                if(latitude && longitude){
                    ajaxGetBackend('/lbs/traceLocationInfo',{position:{latitude:latitude,longitude:longitude}},function(result){
                        vm.currentAddress=result.address;
                        if(emergencyCreateModel){
                            if(emergencyCreateModel.currentEmergency.address.length==0){
                                emergencyCreateModel.currentEmergency.address=result.address;
                            }
                        }
                    });
                }
            });
        }

        vm.checkIsNewInfo=function(dateStr){
            dateStr=dateStr+" 00:00:00";
            var thisDate=fromStrToDate(dateStr);
            var thisDay=(new Date().getTime()-thisDate.getTime())/1000/60/60/24;
            if(thisDay<=3){
                return true;
            }else{
                return false;
            }
        }

        vm.init=function(){
        }

        vm.initData=function() {
            vm.clientDetail.rid = parseInt(appManager.client.rid);
            vm.clientDetail.headimgurl = appManager.client.headimgurl;
            vm.clientDetail.status = appManager.client.status;
            vm.clientDetail.username = appManager.client.username;
            vm.clientDetail.nickname = appManager.client.nickname;
            vm.clientDetail.sex = appManager.client.sex;
            vm.clientDetail.mobile = appManager.client.mobile;
            vm.clientDetail.dusername = appManager.client.dusername;
            vm.clientDetail.politics = appManager.client.politics;
            vm.clientDetail.departmentId = appManager.client.departmentId;
            vm.clientDetail.department = appManager.client.department;
            vm.clientDetail.starLevel = appManager.client.starLevel;
            vm.clientDetail.managerLevel = appManager.client.managerLevel;
            vm.clientDetail.role = appManager.client.role;

            vm.domainInfo.domainId=appManager.domain.rid;
            vm.domainInfo.domainName=appManager.domain.domainName;
            vm.domainInfo.logo=appManager.domain.logo;
            vm.domainInfo.status=appManager.domain.status;
            vm.domainInfo.tel=appManager.domain.tel;
            vm.domainInfo.address=appManager.domain.address;
            vm.domainInfo.lat=appManager.domain.lat;
            vm.domainInfo.lng=appManager.domain.lng;
            /*
            vm.domainInfo.domainId = appManager.currentDomainInfo.rid;
            vm.domainInfo.domainName = appManager.currentDomainInfo.domainName;
            vm.domainInfo.logo = appManager.currentDomainInfo.logo;
            vm.domainInfo.type = appManager.currentDomainInfo.type;
            vm.domainInfo.mobile = appManager.currentDomainInfo.mobile;*/
            if(vm.$initializeHandler){
                vm.$initializeHandler(function(){
                    vm.$initializeStatus='Y';
                });
            }else{
                vm.$initializeStatus='Y';
            }
        }
    });
});


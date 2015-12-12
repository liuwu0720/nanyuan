var accessRightModel = avalon.define("accessRight", function (vm) {
    vm.clientDetail={
        rid:0,
        headimgurl:null,
        username:null,
        nickname:null,
        mobile:null,
        sex:null,
        status:null
    };

    vm.init=function(){
        appManager.register(function(client){
            if(client) {
                vm.clientDetail.rid = parseInt(appManager.client.rid);
                vm.clientDetail.headimgurl = appManager.client.headimgurl;
                vm.clientDetail.status = appManager.client.status;
                vm.clientDetail.username = appManager.client.username;
                vm.clientDetail.nickname = appManager.client.nickname;
                vm.clientDetail.sex = appManager.client.sex;
                vm.clientDetail.mobile = appManager.client.mobile;
            }
        });
    }

    vm.completeRegister=function(){
        var folder=getQueryString("folder");
        var page=getQueryString("page");
        var domainId=getQueryString("domain");
        var url=appManager.convertUrlWithWeixinAuth("/"+folder+"/"+page+".html?domain="+domainId);
        window.location.href=url;
    }

});
accessRightModel.init();
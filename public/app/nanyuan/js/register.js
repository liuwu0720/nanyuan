var GLOBAL_APP_NAME="nanyuan";
var registerModel = avalon.define("register", function (vm) {
    vm.clientDetail={
        rid:0,
        headimgurl:null,
        username:null,
        nickname:null,
        mobile:null,
        sex:null,
        status:null
    };
    vm.userInfo={
        username:"",
        password:""
    };

    vm.init=function(){
        var type=getQueryString("type");
        if(type=="S"){
            appManager.login(function(client){
                vm.clientDetail.rid = parseInt(appManager.client.rid);
                vm.clientDetail.headimgurl = appManager.client.headimgurl;
                vm.clientDetail.status = appManager.client.status;
                vm.clientDetail.username = appManager.client.username;
                vm.clientDetail.nickname = appManager.client.nickname;
                vm.clientDetail.sex = appManager.client.sex;
                vm.clientDetail.mobile = appManager.client.mobile;
            });
        }else{
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
    }

    vm.completeRegister=function(){
        var folder=getQueryString("folder");
        var page=getQueryString("page");
        var domainId=getQueryString("domain");
        var url=appManager.convertUrlWithWeixinAuth("/"+folder+"/"+page+".html?domain="+domainId);
        window.location.href=url;
    }

    vm.userBind=function(){
        if(vm.userInfo.username.length==0){
            showConfirmDialog("","请输入用户账号");
            return;
        }
        if(vm.userInfo.password.length==0){
            showConfirmDialog("","请输入用户密码");
            return;
        }
        ajaxPost('/clients/userBind',{userInfo:vm.userInfo.$model,clientId:vm.clientDetail.rid},function(result){
            if(result.code==0) {
                showConfirmDialog("","绑定用户成功",function(){
                    vm.completeRegister();
                });
            }else if(result.code==1){
                showConfirmDialog("","该用户账号不存在");
            }else if(result.code==2){
                showConfirmDialog("","您输入的密码错误");
            } else if(result.code==3){
                showConfirmDialog("",vm.userInfo.username+"已被绑定,请先解除绑定后再重新绑定");
            }
        });
    }
});
registerModel.init();
var userCenterModel=createModel('userCenter',function(modelName){
    return avalon.define(modelName, function (vm) {
        vm.oldPassword="";
        vm.newPassword1="";
        vm.newPassword2="";

        vm.clearBind=function(){
            showSelectDialog("","您确定要解除用户绑定吗？",function(index){
                ajaxGet('/users/clearBind',{},function(result){
                    if(result.code==0) {
                        showConfirmDialog("","解除用户绑定成功");
                        var url="http://"+window.location.host+"/app/weixin/access?domain="+clientInfoModel.domainInfo.domainId+"&folder=wegov&page=3.4pingtaizhiyin";
                        window.location.href=url;
                    }else{
                        showConfirmDialog("","解除用户绑定失败");
                    }
                });
            });
        }

        vm.changePassword=function(){
            if(vm.newPassword1.length==0){
                showConfirmDialog("","密码不能为空");
                return;
            }
            if(vm.newPassword1!=vm.newPassword2){
                showConfirmDialog("","两次输入的密码必需一致");
                return;
            }
            ajaxGet('/users/changePassword',{oldPassword:vm.oldPassword,newPassword:vm.newPassword1},function(result){
                if(result.code==0) {
                    vm.oldPassword="";
                    vm.newPassword1="";
                    vm.newPassword2="";
                    showConfirmDialog("","密码修改成功");
                }else if(result.code==2){
                    showConfirmDialog("","旧密码不正确");
                }else{
                    showConfirmDialog("","密码修改失败");
                }
            });
        }

        vm.onFocus=function(){
        }

        vm.initApp=function(){
            if(!clientInfoModel.gotoRegisterScreen("wegov","register","wegov","3.4pingtaizhiyin")){
            }
        }

        vm.init=function(){
            if(clientInfoModel.$initializeStatus=='Y'){
                vm.initApp();
            }else{
                clientInfoModel.$initializeHandler=function(cb){
                    vm.initApp();
                    if(cb){cb();}
                }
            }
        }
    });
});

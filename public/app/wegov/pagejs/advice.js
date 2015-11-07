var adviceModel=createModel('advice',function(modelName){
    return avalon.define(modelName, function (vm) {
        vm.currentAdvice={contact:'',mobile:'',description:'',email:''};

        vm.addAdvice=function(){
            if(vm.currentAdvice.contact.length<=0){
                showConfirmDialog("","请输入联系人姓名");
                return;
            }
            if(vm.currentAdvice.mobile.length<=0){
                showConfirmDialog("","请输入联系人手机号码");
                return;
            }
            if(vm.currentAdvice.description.length<=0){
                showConfirmDialog("","请输入您的建议");
                return;
            }
            var domainId=getQueryString("domain");
            if(domainId){
                domainId=1;
            }
            var advice={domainId:domainId,contact:vm.currentAdvice.contact,mobile:vm.currentAdvice.mobile,description:vm.currentAdvice.description,email:vm.currentAdvice.email};
            ajaxGet('/advice/addAdvice',{advice:advice},function(result){
                if(result.code==0) {
                    showSuccessTip("您的意见和建议已经保存，我们将认真研究");
                    vm.init();
                }else{
                    showWarnTip("保存信息错误，请联系管理员");
                }
            });
        }

        vm.onFocus=function(){
        }

        vm.init=function(){
            vm.currentAdvice.contact='';
            vm.currentAdvice.mobile='';
            vm.currentAdvice.description='';
            vm.currentAdvice.email='';
        }
    });
});

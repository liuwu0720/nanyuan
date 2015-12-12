var adviceModel=createModel('advice',function(modelName){
    return avalon.define(modelName, function (vm) {
        vm.type=clientInfoModel.$initPageParameters.advice.type;
        vm.adviceTypeList=[];
        vm.currentAdvice={contact:'',mobile:'',description:'',email:'',adviceType:0};

        vm.addAdvice=function(){
            if(vm.currentAdvice.adviceType<=0){
                showConfirmDialog("","请输入类型");
                return;
            }
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
            var advice={domainId:domainId,adviceType:vm.currentAdvice.adviceType,contact:vm.currentAdvice.contact,mobile:vm.currentAdvice.mobile,description:vm.currentAdvice.description,email:vm.currentAdvice.email};
            ajaxGet('/advice/addAdvice',{advice:advice},function(result){
                if(result.code==0) {
                    showSuccessTip("您的投诉和建议已经保存，我们将认真研究");
                    vm.clearData();
                }else{
                    showWarnTip("保存信息错误，请联系管理员");
                }
            });
        }

        vm.onFocus=function(){
        }

        vm.initAdviceTypeList=function(){
            ajaxGet('/advice/retrieveAdviceTypeList',{type:vm.type},function(result){
                if(result.code==0) {
                    for(var i=0;i<result.data.length;i++){
                        vm.adviceTypeList.push(result.data[i]);
                    }
                }
            });
        }
        vm.clearData=function(){
            vm.currentAdvice.contact='';
            vm.currentAdvice.mobile='';
            vm.currentAdvice.description='';
            vm.currentAdvice.email='';
            vm.currentAdvice.adviceType=0;
        }

        vm.initApp=function(){
            vm.clearData();
            vm.initAdviceTypeList();
        }

        vm.init=function(){
            if(clientInfoModel.$initializeStatus=='Y'){
                vm.initApp();
            }else{
                clientInfoModel.addInitializeHandler(function(cb){
                    vm.initApp();
                    if(cb){cb();}
                });
            }
        }
    });
});

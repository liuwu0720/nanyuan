var singleContactinfoModel=createModel('singleContactinfo',function(modelName){
    return avalon.define(modelName, function (vm) {
        vm.currentItem={domainName:'',address:'',tel:'',lng:'',lat:''};

        vm.initData=function(cb){
            ajaxGet('/contactinfo/retrieveDomainInfo',{domainId:getQueryString("domain")},function(result){
                if(result.code==0) {
                    vm.currentItem=result.data;
                }
                if(cb){cb();}
            });
        }

        vm.openMap=function(){
            shareManager.openLocation(vm.currentItem.lat,vm.currentItem.lng,vm.currentItem.domainName,vm.currentItem.address,null);
        }

        vm.onFocus=function(){
        }

        vm.initApp=function(){
            vm.initData();
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

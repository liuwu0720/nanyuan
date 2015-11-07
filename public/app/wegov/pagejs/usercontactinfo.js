var usercontactinfoModel=createModel('usercontactinfo',function(modelName){
    return avalon.define(modelName, function (vm) {
        vm.list=[];
        vm.currentItem={username:'',politics:null,department:"",mobile:''};

        vm.initList=function(cb){
            vm.refreshList(cb);
        }

        vm.refreshList=function(cb){
            ajaxGet('/users/retrieveListByParentDepartment',{departmentId:clientInfoModel.clientDetail.departmentId},function(result){
                if(result.code==0) {
                    if (result.data.length > 0) {
                        for (var i = 0; i < result.data.length; i++) {
                            vm.list.push(result.data[i]);
                        }
                    }
                }
                if(cb){cb();}
            });
        }

        vm.onFocus=function(){
        }

        vm.initApp=function(){
            if(!clientInfoModel.gotoRegisterScreen("wegov","register","wegov","2.4hulianhutong")){
                vm.initList();
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

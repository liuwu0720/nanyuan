var usercontactinfo2Model=createModel('usercontactinfo2',function(modelName){
    return avalon.define(modelName, function (vm) {
        vm.list=[];
        vm.subList=[];
        vm.currentItem={};
        vm.currentSubItem={};
        vm.userList=[];
        vm.$lastUserList=[];

        vm.initList=function(){
            ajaxGet('/emergency/retrieveLevelList',{level:2},function(result){
                if(result.code==0) {
                    if (result.data) {
                        vm.list=result.data;
                    }
                }
            });
        }

        vm.chooseOtherDepartment=function(){
            vm.subList.clear();
            vm.userList.clear();
            vm.currentItem={};
        }

        vm.retrieveDepartmentInformation=function(el){
            vm.subList.clear();
            vm.userList.clear();
            vm.currentItem=el;
            ajaxGet('/emergency/retrieveDepartmentInformation',{departmentId:el.rid},function(result){
                if(result.code==0) {
                    if (result.data) {
                        vm.subList=result.data;
                        vm.userList=result.users;
                    }
                }
            });
        }

        vm.retrieveSubDepartmentInformation=function(el){
            vm.currentSubItem=el;
            vm.userList.clear();
            ajaxGet('/emergency/retrieveDepartmentInformation',{departmentId:el.rid},function(result){
                if(result.code==0) {
                    if (result.data) {
                        vm.userList=result.users;
                    }
                }
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

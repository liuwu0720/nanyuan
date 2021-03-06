var bookingModel=createModel('booking',function(modelName){
    return avalon.define(modelName, function (vm) {
       // vm.clientId=clientInfoModel.clientDetail.rid;
       // vm.domainId=clientInfoModel.domainInfo.domainId;
        vm.clientId=60;
        vm.domainId=1;
        vm.typeId=0;
        vm.content="";
        vm.contacts="";
        vm.telephone="";
        vm.typeList=[];
        vm.typeErr=0;
        vm.contentErr=0;
        vm.contactsErr=0;
        vm.telephoneErr=0;
        vm.saveSuccess=0;

        vm.initTypeList=function(){
            ajaxGet('/booking/typeList',{domainId:vm.domainId,arrayLength:0},function(result){
                if(result.code==0) {
                    if (result.data.length > 0) {
                        for (var i = 0; i < result.data.length; i++) {
                            vm.typeList.push(result.data[i]);
                        }
                    }
                }
            });
        }

        vm.saveBooking=function(){
            if(vm.typeId==0){
                vm.typeErr=1;
                showConfirmDialog("","请输入预约事物类别");
                return;
            }
            if(vm.content==''){
                vm.contentErr=1;
                showConfirmDialog("","请输入情况说明");
                return;
            }
            if(vm.contacts==''){
                vm.contactsErr=1;
                showConfirmDialog("","请输入联系人名称");
                return;
            }
            if(vm.telephone==''){
                vm.telephoneErr=1;
                showConfirmDialog("","请输入手机号码");
                return;
            }
            var bookinfo = {typeId:vm.typeId,content:vm.content,contacts:vm.contacts,telephone:vm.telephone,clientId:vm.clientId,domainId:vm.domainId};
            ajaxGet('/booking/addBooking',{bookinfo:bookinfo},function(result){
                if(result.code==0) {
                    vm.saveSuccess=1;
                    vm.typeId=0;
                    vm.content="";
                    vm.contacts="";
                    vm.telephone="";
                }
            });
        }

        vm.initApp=function(){
            if(!clientInfoModel.gotoAccessRightScreen("nanyuan","register","nanyuan","3.2yuyuebanshi")){
                vm.initTypeList();
            }
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

        vm.doBack=function(){
            vm.saveSuccess=0;
        }

        vm.typeErrHide=function(){
            vm.typeErr=0;
        }
        vm.contentErrHide=function(){
            vm.contentErr=0;
        }
        vm.contactsErrHide=function(){
            vm.contactsErr=0;
        }
        vm.telephoneErrHide=function(){
            vm.telephoneErr=0;
        }
    });
});


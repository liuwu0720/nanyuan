var bookingResultModel=createModel('bookingResult',function(modelName){
    return avalon.define(modelName, function (vm) {
        //vm.clientId=clientInfoModel.clientDetail.rid;
       // vm.domainId=clientInfoModel.domainInfo.domainId;
        vm.clientId=60;
        vm.domainId=1;
        vm.bookingList=[];
        vm.searchKey="";

        vm.openSearchPan=function(){
            $('.ui-searchbar-wrap').addClass('focus');
            $('.ui-searchbar-input input').focus();
        }

        vm.startSearch=function(){
            vm.searchList(function(){
                $('.ui-searchbar-wrap').removeClass('focus');
            });
        }

        vm.searchList=function(){
            vm.bookingList.clear();
            vm.getBooking();
        }

        vm.getBooking=function(){
            ajaxGet('/bookingResult/getList',{domainId:vm.domainId,clientId:vm.clientId,arrayLength:0,searchKey:vm.searchKey},function(result){
                if(result.code==0) {
                    if (result.data.length > 0) {
                        for (var i = 0; i < result.data.length; i++) {
                            vm.bookingList.push(result.data[i]);
                        }
                    }
                }
            });
        }

        vm.clearSearchKey=function(){
            vm.searchKey="";
        }

        vm.initApp=function(){
            if(!clientInfoModel.gotoAccessRightScreen("nanyuan","register","nanyuan","3.3jieguochaxun")){
                vm.getBooking();
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
    });
});


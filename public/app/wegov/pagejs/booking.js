var consultantModel=createModel('booking',function(modelName){
    return avalon.define(modelName, function (vm) {
        vm.domainId=1;
        vm.typeId=0;
        vm.content="";
        vm.contacts="";
        vm.telephone="";
        vm.typeList=[];

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
            /*var domainId=clientInfoModel.domainInfo.domainId;
            if(domainId){
                domainId=1;
            }*/
            var bookinfo = {typeId:vm.typeId,content:vm.content,contacts:vm.contacts,telephone:vm.telephone,status:"booked",createBy:clientInfoModel.clientDetail.rid,domainId:domainId};
            ajaxGet('/booking/addBooking',{bookinfo:bookinfo},function(result){
                if(result.code==0) {
                    alert("预约成功");
                    window.location.reload()//刷新当前页面
                }
            });
        }

        vm.init=function(){
            vm.initTypeList();
        }
    });
});


var consultantModel=createModel('bookingResult',function(modelName){
    return avalon.define(modelName, function (vm) {
        vm.domainId=1;
        vm.userId=0;
        vm.bookingList=[];

        vm.getBooking=function(){
            ajaxGet('/bookingResult/getList',{domainId:vm.domainId,userId:vm.userId,arrayLength:0},function(result){
                if(result.code==0) {
                    if (result.data.length > 0) {
                        for (var i = 0; i < result.data.length; i++) {
                            vm.bookingList.push(result.data[i]);
                        }
                    }
                }
            });
        }

        vm.saveBooking=function(){
            var domainId=clientInfoModel.domainInfo.domainId;
            if(domainId){
                domainId=1;
            }
            var bookinfo = {typeId:vm.typeId,content:vm.content,contacts:vm.contacts,telephone:vm.telephone,status:"booked",createBy:clientInfoModel.clientDetail.rid,domainId:domainId};
            ajaxGet('/booking/addBooking',{bookinfo:bookinfo},function(result){
                if(result.code==0) {
                    alert("预约成功");
                    window.location.reload()//刷新当前页面
                }
            });
        }

        vm.init=function(){
            vm.getBooking();
        }
    });
});


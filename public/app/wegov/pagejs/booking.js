var consultantModel=createModel('booking',function(modelName){
    return avalon.define(modelName, function (vm) {
        vm.content="";
        vm.contacts="";
        vm.telephone="";
        vm.typeList={};

        vm.initTypeList=function(){
            alert("加载预约类型");
            /*ajaxGet('/consultant/retrieveList',{type:vm.type,arrayLength:vm.list.length},function(result){
                if(result.code==0) {
                    if (result.data.length > 0) {
                        if(!vm.$allList[vm.type]){
                            vm.$allList[vm.type]=[];
                        }
                        for (var i = 0; i < result.data.length; i++) {
                            vm.list.push(result.data[i]);
                            vm.$allList[vm.type].push(result.data[i]);
                        }
                    }
                }
                if(cb){cb();}
            });*/
        }

        vm.saveBooking=function(){
            /*var domainId=clientInfoModel.domainInfo.domainId;
            if(domainId){
                domainId=1;
            }
            var consultant={domainId:domainId,type:vm.type,clientId:clientInfoModel.clientDetail.rid,questions:vm.questions,status:"A"};
            ajaxGet('/consultant/addConsultant',{consultant:consultant},function(result){
                if(result.code==0) {
                    consultant.username=clientInfoModel.clientDetail.username;
                    consultant.headimgurl=clientInfoModel.clientDetail.headimgurl;
                    consultant.creDate=fromDateToStr(new Date(),'yyyy-MM-dd hh:mm:ss');
                    consultant.rid=result.insertId;
                    vm.list.splice(0,0,consultant);
                    vm.screenStatus='L';
                }
            });*/
            alert("保存预约信息");
        }

        vm.init=function(){
            vm.initTypeList();
        }
    });
});


var contactinfoModel=createModel('contactinfo',function(modelName){
    return avalon.define(modelName, function (vm) {
        vm.list=[];
        vm.type=clientInfoModel.$initPageParameters.contactinfo.type;
        vm.currentItem={department:'',contactMan:'',title:'',address:'',tel:'',lng:'',lat:''};
        vm.$allList=[];

        vm.switchType=function(type){
            if(type==vm.type){
                return;
            }else{
                var newList=vm.$allList[type];
                vm.type=type;
                if(newList){
                    vm.list=newList;
                }else{
                    vm.list=[];
                    vm.initList();
                }
            }
        }

        vm.initList=function(cb){
            if(vm.list.length<=0){
                vm.refreshList(cb);
                clientInfoModel.setScrollRefreshHandler(vm.onScrollRefreshScreen);
            }else{
                if(cb){cb();}
            }
        }

        vm.onScrollRefreshScreen=function(){
            if($("#frameContentDetail").css("display")=="none"){
                vm.refreshList(function(){
                });
            }
        }

        vm.refreshList=function(cb){
            ajaxGet('/contactinfo/retrieveList',{type:vm.type,arrayLength:vm.list.length},function(result){
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
            });
        }

        vm.openMap=function(el){
            shareManager.openLocation(el.lat,el.lng,el.department,el.address,null);
        }

        vm.onFocus=function(){
        }

        vm.init=function(){
            vm.initList();
        }
    });
});

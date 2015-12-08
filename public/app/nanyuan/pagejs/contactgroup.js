var contactgroupModel=createModel('contactgroup',function(modelName){
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
            vm.refreshList(cb);
        }

        vm.refreshList=function(cb){
            ajaxGet('/contactinfo/retrieveAllList',{type:vm.type},function(result){
                if(result.code==0) {
                    if (result.data.length > 0) {
                        if(!vm.$allList[vm.type]){
                            vm.$allList[vm.type]=[];
                        }
                        var newList=vm.changeGroupList(result.data);
                        for (var i = 0; i < newList.length; i++) {
                            vm.list.push(newList[i]);
                            vm.$allList[vm.type].push(newList[i]);
                        }
                    }
                }
                if(cb){cb();}
            });
        }

        vm.changeGroupList=function(list){
            var newList=[];
            var findGroupList=function(groupName){
                var groups=null;
                for(var i=0;i<newList.length;i++){
                    if(newList[i].groupName==groupName){
                        groups=newList[i];
                        break;
                    }
                }
                if(groups){
                    return groups
                }else{
                    groups={groupName:groupName,groups:[]};
                    newList.push(groups);
                    return groups;
                }
            }
            for(var i=0;i<list.length;i++){
                var groups=findGroupList(list[i].groupName);
                groups.groups.push(list[i]);
            }
            return newList;
        }

        vm.openMap=function(el){
            shareManager.openLocation(el.lat,el.lng,el.department,el.address,null);
        }

        vm.onFocus=function(){
        }

        vm.initApp=function(){
            vm.initList();
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

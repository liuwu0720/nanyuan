var usersModel=createModel('users',function(modelName){
    return avalon.define(modelName, function (vm) {
        vm.departmentList=[];
        vm.list=[];
        vm.currentItem={username:'',photo:'',politics:null,sex:'',department:"",description:"",content:""};

        vm.openUsersItem=function(el){
            vm.currentItem=el;
            ajaxGet('/peoples/retrieveDetail',{rid:el.rid},function(result){
                if(result.code==0) {
                    vm.currentItem.content=result.data.content;
                    var content=null;
                    content='<div class="ui-whitespace" style="background-color:white;padding-top: 20px">'+
                    '<h1 style="font-size: 1.5em">'+vm.currentItem.username+'&nbsp;&nbsp;'+vm.currentItem.politics+'</h1>'+
                    '<h1 style="padding-top: 10px">'+vm.currentItem.department+'</h1>'+
                    '<div style="padding-top: 10px">'+
                    vm.currentItem.content+
                    '</div>'+
                    '</div>';
                    $("#frameContentDetail").html(content);
                    dynamicImageHandler("frameContentDetail");
                    clientInfoModel.openScreen("ContentDetail");
                }
            });
        }

        vm.initDepartmentList=function(cb){
            ajaxGet('/users/retrieveDepartmentList',{},function(result){
                if(result.code==0) {
                    if (result.data.length > 0) {
                        for (var i = 0; i < result.data.length; i++) {
                            vm.departmentList.push(result.data[i]);
                        }
                    }
                }
                if(cb){cb();}
            });
        }
        /*
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
        */

        vm.getSubdepartmentList=function(cl){
            var result=cl.rid;
            for(var i=0;i<cl.children.length;i++){
                result=result+','+vm.getSubdepartmentList(cl.children[i]);
            }
            return result;
        }

        vm.getDepartmentUsers=function(cl){
            var rids=vm.getSubdepartmentList(cl);
            vm.list.clear();
            ajaxGet('/users/retrieveList',{rids:rids},function(result){
                if(result.code==0) {
                    if (result.data.length > 0) {
                        for (var i = 0; i < result.data.length; i++) {
                            vm.list.push(result.data[i]);
                        }
                    }
                }
                clientInfoModel.openScreen("UserList");
            });
        }

        vm.onFocus=function(){
        }

        vm.init=function(){
            //vm.initList();
            vm.initDepartmentList();
        }
    });
});

var peoplesModel=createModel('peoples',function(modelName){
    return avalon.define(modelName, function (vm) {
        vm.list=[];
        vm.type=1;
        vm.currentItem={name:'',photo:'',politics:null,sex:'',department:"",description:"",content:"",title:""};
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

        vm.openPeoplesItem=function(el){
            vm.currentItem=el;
            ajaxGet('/peoples/retrieveDetail',{rid:el.rid},function(result){
                if(result.code==0) {
                    vm.currentItem.content=result.data.content;
                    var politicsValue="";
                    if(vm.currentItem.politics=="党员"){
                        politicsValue='<i class="iconfont-1" style="color:red;font-size: 1.2em">&#xe600;</i>';
                    }
                    var content=null;
                    content='<div class="ui-whitespace" style="background-color:white;padding-top: 20px">'+
                    '<h1 style="font-size: 1.5em">'+vm.currentItem.name+'&nbsp;&nbsp;'+politicsValue+'</h1>'+
                    '<h1 style="padding-top: 10px">'+vm.currentItem.department+'</h1>'+
                    '<h1 style="padding-top: 10px">'+vm.currentItem.title+'</h1>'+
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
            ajaxGet('/peoples/retrieveList',{type:vm.type,arrayLength:vm.list.length},function(result){
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

        vm.onFocus=function(){
        }

        vm.init=function(){
            vm.initList();
        }
    });
});

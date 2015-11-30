var documents3Model=createModel('documents3',function(modelName){
    return avalon.define(modelName, function (vm) {
        vm.list=[];
        vm.type=clientInfoModel.$initPageParameters.documents.type;;
        vm.banner="";
        vm.currentItem={title:'',description:'',publishDate:null,publisher:'',content:''};
        vm.$allList=[];
        vm.$allBanners=[];

        vm.switchType=function(type){
            if(type==vm.type){
                return;
            }else{
                var newList=vm.$allList[type];
                vm.type=type;
                if(newList){
                    vm.list=newList;
                    vm.banner=vm.$allBanners[type];
                }else{
                    vm.list=[];
                    vm.banner="";
                    vm.initList();
                }
            }
        }

        vm.openDocumentsItem=function(el){
            vm.currentItem=el;
            ajaxGet('/documents/retrieveDetail',{rid:el.rid},function(result){
                if(result.code==0) {
                    vm.currentItem.content=result.data.content;
                    var content=null;
                    content='<div class="ui-whitespace" style="background-color:white;padding-top: 20px">'+
                    vm.currentItem.content+
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
            ajaxGet('/documents/retrieveList',{type:vm.type,arrayLength:vm.list.length},function(result){
                if(result.code==0) {
                    if (result.data.length > 0) {
                        if(!vm.$allList[vm.type]){
                            vm.$allList[vm.type]=[];
                        }
                        if(vm.list.length==0){
                            vm.banner=result.banner;
                            vm.$allBanners[vm.type]=result.banner;
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
var documentsModel=createModel('documents',function(modelName){
    return avalon.define(modelName, function (vm) {
        vm.list=[];
        vm.type=clientInfoModel.$initPageParameters.documents.type;
        vm.banner="";
        vm.searchKey="";
        vm.currentItem={title:'',description:'',publishDate:null,publisher:'',content:''};
        vm.$allList=[];
        vm.$allBanners=[];

        vm.openSearchPan=function(){
            $('.ui-searchbar-wrap').addClass('focus');
            $('.ui-searchbar-input input').focus();
        }

        vm.startSearch=function(){
            vm.searchList(function(){
                $('.ui-searchbar-wrap').removeClass('focus');
            });
        }

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
                    '<h1 style="font-size: 1.5em">'+vm.currentItem.title+'</h1>'+
                    '<h6 style="padding-top: 10px">'+vm.currentItem.publishDate+'&nbsp;&nbsp;'+"<span style='color:#6FB1C7'>"+(vm.currentItem.publisher || '福田综管')+'</h6>'+
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

        vm.searchList=function(cb){
            vm.list.clear();
            vm.refreshList(cb);
        }

        vm.refreshList=function(cb){
            ajaxGet('/documents/searchList',{type:vm.type,arrayLength:vm.list.length,searchKey:vm.searchKey},function(result){
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
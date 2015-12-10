var newsModel=createModel('news',function(modelName){
    return avalon.define(modelName, function (vm) {
        vm.list=[];
        vm.type=clientInfoModel.$initPageParameters.news.type;
        vm.banner="";
        vm.currentItem={title:'',newsImage:'',publishDate:null,publisher:'',content:""};
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

        vm.openNewsItem=function(el){
            vm.currentItem=el;
            ajaxGet('/news/retrieveDetail',{rid:el.rid},function(result){
                if(result.code==0) {
                    vm.currentItem.content=result.data.content;
                    var content=null;
                    content='<div class="ui-whitespace" style="background-color:white;padding-top: 20px">'+
                    '<h1 style="font-size: 1.5em">'+vm.currentItem.title+'</h1>'+
                    '<h6 style="padding-top: 10px">'+vm.currentItem.publishDate+'&nbsp;&nbsp;'+"<span style='color:#6FB1C7'>"+(vm.currentItem.publisher || '南园街道')+"</span></h6>"+
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
            ajaxGet('/news/retrieveList',{type:vm.type,arrayLength:vm.list.length},function(result){
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
                    //vm.checkRefreshStatus(result.data.length, "Msg");
                }
                if(cb){cb();}
            });
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
                clientInfoModel.addInitializeHandler(function(cb){
                    vm.initApp();
                    if(cb){cb();}
                });
            }
        }
    });
});

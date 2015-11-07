var documents4Model=createModel('documents4',function(modelName){
    return avalon.define(modelName, function (vm) {
        vm.list=[];
        vm.type=4;
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

        vm.openDocumentsList=function(){
            clientInfoModel.openScreen("DocumentsList");
            var content='<ul class="ui-list ui-list-text ui-list-link" ms-controller="documents4">'+
                '<li class="ui-border-t" ms-repeat="list" ms-click="openHistoryDocumentsItem(el)">'+
                    '<h4>{{el.title}}</h4>'+
                    '<div class="ui-txt-info">{{el.publishDate | date("yyyy-MM-dd") | dateFormat}}</div>'+
                '</li>'+
            '</ul>';
            $("#frameDocumentsList").html(content);
            avalon.scan(document.body,vm);
        }

        vm.openHistoryDocumentsItem=function(el){
            ajaxGet('/documents/retrieveDetail',{rid:el.rid},function(result){
                if(result.code==0) {
                    var content=result.data.content;
                    $("#frameDocumentsHistoryContent").html(content);
                    clientInfoModel.openScreen("DocumentsHistoryContent");
                }
            });
        }

        vm.openDocumentsItem=function(){
            vm.currentItem=vm.list[0];
            ajaxGet('/documents/retrieveDetail',{rid:vm.currentItem.rid},function(result){
                if(result.code==0) {
                    vm.currentItem.content=result.data.content;
                    var content=null;
//                    content='<div class="ui-whitespace" style="background-color:white;padding-top: 20px">'+
//                    '<h1 style="font-size: 1.5em">'+vm.currentItem.title+'</h1>'+
//                    '<h6 style="padding-top: 10px">'+vm.currentItem.publishDate+'&nbsp;&nbsp;'+"<span style='color:#6FB1C7'>"+(vm.currentItem.publisher || '福田综管')+'</h6>'+
//                    '<div style="padding-top: 10px">'+
//                    vm.currentItem.content+
//                    '</div>'+
//                    '</div>';
                    $("#documentsContentDetail").html(vm.currentItem.content);
                }
            });
        }

        vm.initList=function(cb){
            if(vm.list.length<=0){
                vm.refreshList(function(){
                    if(vm.list.length>0){
                        vm.openDocumentsItem();
                    }
                });
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

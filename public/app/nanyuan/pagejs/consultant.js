var consultantModel=createModel('consultant',function(modelName){
    return avalon.define(modelName, function (vm) {
        vm.list=[];
        vm.type=1;
        vm.questions="";
        vm.currentItem={};
        vm.$allList=[];
        vm.screenStatus='L';

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
            ajaxGet('/consultant/retrieveList',{type:vm.type,arrayLength:vm.list.length},function(result){
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

        vm.addConsultant=function(){
            vm.screenStatus='E';
        }

        vm.cancelConsultant=function(){
            vm.screenStatus='L';
        }

        vm.reviewConsultant=function(el){
            vm.currentItem=el;
            var thisCreDate=fromStrToDate(el.creDate);
            var thisAnswerDate=null;
            if(vm.currentItem.status=='C'){
                thisAnswerDate=fromStrToDate(el.answerDate);
            }
            //vm.screenStatus='D';
            var content='<br>'+
                '<h3 class="ui-txt-white ui-whitespace" style="background:#00a5e0">问题</h3>'+
                '<ul class="ui-list">'+
                '   <li class="ui-border-t">'+
                '       <div class="ui-avatar">'+
                '           <span style="background-image:url('+el.headimgurl+')"></span>'+
                '       </div>'+
                '       <div class="ui-list-info">'+
                '           <p style="font-size:0.8em">'+el.username+'</p>'+
                '           <p style="font-size:0.8em">'+fromDateToStr(thisCreDate,'MM月dd日 hh:mm')+'</p>'+
                '           <p>'+el.questions+'</p>'+
                '       </div>'+
                '   </li>'+
                '</ul>';
            if(vm.currentItem.status=='C'){
                content=content+'<br>'+
                '<br>'+
                '<h3 class="ui-txt-white ui-whitespace" style="background:#00a5e0">回复</h3>'+
                '<ul class="ui-list">'+
                    '<li class="ui-border-t">'+
                        '<div class="ui-avatar">'+
                            '<span style="background-image:url('+clientInfoModel.domainInfo.logo+')"></span>'+
                        '</div>'+
                        '<div class="ui-list-info">'+
                            '<p style="font-size:0.8em">'+clientInfoModel.domainInfo.domainName+'</p>'+
                            '<p style="font-size:0.8em">'+fromDateToStr(thisAnswerDate,'MM月dd日 hh:mm')+'</p>'+
                            '<p>'+el.answer+'</p>'+
                        '</div>'+
                    '</li>'+
                '</ul>';
            }
            $("#frameContentDetail").html(content);
            clientInfoModel.openScreen("ContentDetail");
        }

        vm.saveConsultant=function(){
            var domainId=clientInfoModel.domainInfo.domainId;
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
            });
        }

        vm.onFocus=function(){
        }

        vm.initApp=function(){
            if(!clientInfoModel.gotoAccessRightScreen("nanyuan","accessRight","nanyuan","1.4zixunfuwu")){
                vm.initList();
            }
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

var emergencyCreateModel=createModel('emergencyCreate',function(modelName){
    return avalon.define(modelName, function (vm) {
        vm.categoryList=[];
        vm.myHistoryList=[];
        vm.$myHistoryListCount=0;
        vm.currentEmergency={rid:0,category:'',description:'',address:'',lat:"",lng:"",type:true,images:[],contactMan:"",mobile:""};

        vm.reportHistory=[];
        vm.currentItem={rid:0,domainId:0,clientId:0,category:"",description:"",address:"",lat:"",lng:"",images:[],video:[],mainImage:"",status:"",activities:[],username:"",politics:"",mobile:"",department:"",emergencyReportId:0,delayHour:0,reportDate:null,reportStatus:""};
        vm.currentCommentList=[];
        vm.currentInstructionsList=[];

        vm.addEmergencyAddClose=function(){
            vm.addEmergency(function(){
                shareManager.closeWindow();
            });
        }

        vm.chooseActivity=function(al){
            if(al.choosed){
                al.choosed=0;
            }else{
                al.choosed=1;
            }
        }

        vm.initLocation=function(){
            shareManager.getLocation(function(latitude,longitude) {
                if (latitude == null || longitude == null) {
                    showConfirmDialog("", "无法取得当前位置");
                    //return;
                }
                vm.currentEmergency.lat = latitude;
                vm.currentEmergency.lng = longitude;
            });
        }

        vm.addEmergency=function(cb){
            if(vm.currentEmergency.address.length<=0){
                showConfirmDialog("","请输入事件的发生地点");
                return;
            }
            if(vm.currentEmergency.description.length<=0){
                showConfirmDialog("","请输入您对事件的描述");
                return;
            }
//            if(vm.currentEmergency.images.length<=0){
//                showConfirmDialog("","请至少上传一张图片");
//                return;
//            }
            //vm.currentEmergency.mainImage=vm.currentEmergency.images[0]
            if(vm.currentEmergency.rid==0){
                var domainId=clientInfoModel.domainInfo.domainId;
                if(!domainId){
                    domainId=1;
                }
                //shareManager.getLocation(function(latitude,longitude){
//                    if(latitude==null||longitude==null){
//                        showConfirmDialog("","无法取得当前位置");
//                    }
//                    vm.currentEmergency.lat=latitude;
//                    vm.currentEmergency.lng=longitude;
                    var emergency={domainId:domainId,clientId:clientInfoModel.clientDetail.rid,category:vm.currentEmergency.category,description:vm.currentEmergency.description,status:'T',type:(vm.currentEmergency.type?1:0),address:vm.currentEmergency.address,lat:vm.currentEmergency.lat,lng:vm.currentEmergency.lng,mainImage:vm.currentEmergency.mainImage,images:JSON.stringify(vm.currentEmergency.images),contactMan:vm.currentEmergency.contactMan,mobile:vm.currentEmergency.mobile};
                    ajaxGet('/emergency/addEmergency',{emergency:emergency,departmentId:clientInfoModel.clientDetail.departmentId},function(result){
                        if(result.code==0) {
                            vm.currentEmergency.category='';
                            vm.currentEmergency.description='';
                            vm.currentEmergency.address='';
                            vm.currentEmergency.lat='';
                            vm.currentEmergency.lng='';
                            vm.currentEmergency.images.clear();
                        }else if(result.code==10){
                            showConfirmDialog("","您今天已经上报过无重特大信息，不能重复上报");
                        }else{
                            showConfirmDialog("","保存信息错误，请联系管理员");
                        }
                    });
                //});
            }else{
                vm.currentEmergency.mainImage=vm.currentEmergency.images[0];
                var emergency={rid:vm.currentEmergency.rid,description:vm.currentEmergency.description,address:vm.currentEmergency.address,mainImage:vm.currentEmergency.mainImage,images:JSON.stringify(vm.currentEmergency.images)};
                ajaxGet('/emergency/updateEmergency',{emergency:emergency},function(result){
                    if(result.code==0) {
                        vm.currentEmergency.rid=0;
                        vm.currentEmergency.category='';
                        vm.currentEmergency.description='';
                        vm.currentEmergency.address='';
                        vm.currentEmergency.lat='';
                        vm.currentEmergency.lng='';
                        vm.currentEmergency.images.clear();
                    }else{
                        showConfirmDialog("","保存信息错误，请联系管理员");
                    }
                });
            }
        }

        vm.changeCategory=function(el){
            vm.currentEmergency.category=el.category;
        }

        vm.uploadImage=function(){
            var maxNum=9;
            var filesNumber=0;
            var filesIndex=0;
            shareManager.chooseAndUploadImage(maxNum,{clientId:clientInfoModel.clientDetail.rid},
                function(localIds){
                    filesNumber=localIds.length;
                },
                function(url){
                    filesIndex++;
                    showSuccessTip("共"+filesNumber+"张图片，第"+filesIndex+"张上传成功");
                    vm.currentEmergency.images.push(url);
                },function(code){
                    if(code==2){
                        showWarnTip('每次上传图片最多不超过'+maxNum+'张');
                    }else if(code==3){
                        showWarnTip('不能上传相同的照片');
                    }
                });
        }

        vm.createMenu=function(){
            ajaxGet('/menu/createMenu',{},function(result){
                if(result.code==0) {
                    showConfirmDialog("","创建菜单成功");
                }else{
                    showConfirmDialog("","创建菜单错误，请联系管理员");
                }
            });
        }

        vm.initCategoryList=function(){
            ajaxGet('/emergency/retrieveCategoryList',{},function(result){
                if(result.code==0) {
                    if (result.data.length > 0) {
                        for (var i = 0; i < result.data.length; i++) {
                            if(i==0){
                                vm.currentEmergency.category=result.data[i].category;
                            }
                            vm.categoryList.push(result.data[i]);
                        }
                    }
                }
            });
        }

        vm.openCurrentMap=function(){
            shareManager.openLocation(vm.currentItem.lat,vm.currentItem.lng,"事件发生地点",vm.currentItem.address,null);
        }

        vm.displayPhoto=function(el){
            var list=[];
            for(var i=0;i<vm.currentItem.images.length;i++){
                list.push(appManager.convertImageUrl(vm.currentItem.images[i]));
            }
            shareManager.imagePreview(appManager.convertImageUrl(el),list);
        }

        vm.refreshMyHistoryList=function(cb){
            ajaxGet('/emergency/retrieveMyHistoryList',{arrayLength:vm.$myHistoryListCount},function(result){
                if(result.code==0) {
                    if (result.data.length > 0) {
                        vm.$myHistoryListCount=result.rowsCount;
                        for (var i = 0; i < result.data.length; i++) {
                            if(result.data[i].video && result.data[i].video.length>0){
                                var temp=[];
                                temp.push(result.data[i].video);
                                result.data[i].video=temp;
                            }else{
                                result.data[i].video=[];
                            }
                            if(result.data[i].images && result.data[i].images.length>0){
                                result.data[i].images=JSON.parse(result.data[i].images);
                            }else{
                                result.data[i].images=[];
                            }
                            vm.myHistoryList.push(result.data[i]);
                        }
                    }
                }
                if(cb){cb();}
            });
        }

        vm.openMyHistoryList=function(){
            vm.myHistoryList.clear();
            if(vm.myHistoryList.length<=0){
                vm.refreshMyHistoryList(function(){
                    clientInfoModel.openScreen("MyEmergencyList");
                });
                clientInfoModel.setScrollRefreshHandler(vm.onScrollRefreshScreen);
            }
        }

        vm.onScrollRefreshScreen=function(){
            if($("#frameMyEmergencyList").css("display")=="block"){
                vm.refreshMyHistoryList(function(){
                });
            }
        }

        vm.editEmergencyDetail=function(el) {
            event.stopPropagation();
            vm.currentEmergency.rid=el.rid;
            vm.currentEmergency.category=el.category;
            vm.currentEmergency.description=el.description;
            vm.currentEmergency.address=el.address;
            vm.currentEmergency.type=el.type;
            vm.currentEmergency.images=el.images;
            vm.currentEmergency.contactMan=el.contactMan;
            vm.currentEmergency.mobile=el.mobile;
            window.history.go(-1);
        }

        vm.openEmergencyDetail=function(el){
            vm.currentItem=el;
            clientInfoModel.openScreen("EmergencyDetail");
        }

        vm.onFocus=function(){
        }

        vm.initApp=function(){
            if(!clientInfoModel.gotoAccessRightScreen("wegov","register","wegov","2.1xinxikuaicai")){
                vm.initCategoryList();
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

var singlePageModel=createModel('singlePage',function(modelName){
    return avalon.define(modelName, function (vm) {
        vm.type=2;

        vm.switchType=function(type,id){
            vm.type=type;
            vm.initContent(id,function(){

            });
        }

        vm.initContent=function(id,cb){
            if(!id){
                id="frameContentDetail";
            }
            ajaxGet('/singlePage/retrieveContent',{type:vm.type},function(result){
                if(result.code==0) {
                    var content=result.data.introduction;
                    $("#"+id).html(content);
                    dynamicImageHandler(id);
                }
                if(cb){cb();}
            });
        }

        vm.onFocus=function(){
        }

        vm.init=function(){
        }

        vm.initType=function(type){
            vm.type=type;
            vm.initContent(null);
        }
    });
});

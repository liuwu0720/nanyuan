var questionModel=createModel('question',function(modelName){
    return avalon.define(modelName, function (vm) {
        vm.list=[];

        vm.currentQuestionGroup={};
        vm.currentQuestion={};
        vm.questionIndex=0;
        vm.completedProgress="0%";
        vm.$answers=new Array();

        vm.initList=function(cb){
            if(vm.list.length<=0){
                vm.refreshList(cb);
                clientInfoModel.setScrollRefreshHandler(vm.onScrollRefreshScreen);
            }else{
                if(cb){cb();}
            }
        }

        vm.onScrollRefreshScreen=function(){
            if($("#frameMain").css("display")=="block"){
                vm.refreshList(function(){
                });
            }
        }

        vm.refreshList=function(cb){
            ajaxGet('/question/retrieveGroupList',{arrayLength:vm.list.length},function(result){
                if(result.code==0) {
                    if (result.data.length > 0) {
                        for (var i = 0; i < result.data.length; i++) {
                            var item = result.data[i];
                            if (item.questionsCount > 0) {
                                item.questions = [];
                                vm.list.push(item);
                            }
                        }
                    }
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

        vm.selectAnswer=function(choice){
            if(vm.currentQuestionGroup.answerId){
                showConfirmDialog('问卷调查','本道问卷调查您已经答完了');
                return;
            }
            vm.currentQuestion.choice=choice;
            var answer={questionId:vm.currentQuestion.rid,choice:choice};
            vm.$answers.push(answer);
            vm.questionIndex=vm.$answers.length;
            vm.completedProgress=Math.round(vm.questionIndex*100/vm.currentQuestionGroup.questions.length)+'%';
            if(vm.currentQuestionGroup.questions.length<=vm.$answers.length){
                vm.commitAnswer();
            }else{
                vm.currentQuestion=vm.currentQuestionGroup.questions[vm.$answers.length];
            }
        }

        vm.commitAnswer=function(){
            ajaxPost('/question/commitAnswer',{groupId:vm.currentQuestionGroup.rid,answers:vm.$answers,score:vm.currentQuestionGroup.score},function(result){
                if(result.code==0){
                    for(var i=0;i<vm.list.length;i++){
                        if(vm.list[i].rid==vm.currentQuestionGroup.rid){
                            vm.list[i].answerId=result.answerId;
                            break;
                        }
                    }
                    vm.currentQuestionGroup.answerId=result.answerId;
                    showConfirmDialog('问卷调查','恭喜您答完题目');
                    window.history.go(-1);
                }
            });
        }

        vm.retrieveQuestionList=function(el){
            if(el.answerId){
                showConfirmDialog('问卷调查','这套问卷已经做过了 ');
                return;
            }
            if(el.questions.length==0){
                ajaxGet('/question/retrieveQuestionList',{groupId:el.rid},function(result){
                    if(result.code==0){
                        for(var i=0;i<result.data.length;i++){
                            el.questions.push(result.data[i]);
                        }
                        if(el.questions.length>0){
                            vm.currentQuestionGroup=el;
                            vm.currentQuestion=vm.currentQuestionGroup.questions[0];
                            vm.$answers=new Array();
                            vm.questionIndex=0;
                            vm.completedProgress="0%";
                            clientInfoModel.openScreen("QuestionDetail");
                        }else{
                            showConfirmDialog('问卷调查','这套问卷没有题目 ');
                        }
                    }
                });
            }else{
                vm.currentQuestionGroup=el;
                vm.currentQuestion=vm.currentQuestionGroup.questions[0];
                vm.$answers=new Array();
                vm.questionIndex=0;
                vm.completedProgress="0%";
                clientInfoModel.openScreen("QuestionDetail");
            }
        }
    });
});

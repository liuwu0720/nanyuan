var questionModel = avalon.define("question", function (vm) {
    vm.questionGroupListLastId=-1;
    vm.questionGroupList=[];
    vm.currentQuestionGroup={};
    vm.currentQuestion={};
    vm.questionIndex=0;
    vm.completedProgress="0%";
    vm.$answers=new Array();

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
                for(var i=0;i<vm.questionGroupList.length;i++){
                    if(vm.questionGroupList[i].rid==vm.currentQuestionGroup.rid){
                        vm.questionGroupList[i].answerId=result.answerId;
                        break;
                    }
                }
                vm.currentQuestionGroup.answerId=result.answerId;
                clientInfoModel.clientDetail.score=clientInfoModel.clientDetail.score+vm.currentQuestionGroup.score;
                clientInfoModel.clientDetail.todayScore=clientInfoModel.clientDetail.todayScore+vm.currentQuestionGroup.score;
                if(clientInfoModel.scoreEarnHistoryLastId>0){
                    var item={creDate:new Date(),reason:'QU',changedScore:vm.currentQuestionGroup.score,consumFee:0};
                    clientInfoModel.scoreEarnHistory.splice(0,0,item);
                }
                showConfirmDialog('问卷调查','恭喜您答完题目，并获得'+vm.currentQuestionGroup.score+'的积分奖励');
                appMenuModel.goback();
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
                        appMenuModel.openQcontScreen();
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
            appMenuModel.openQcontScreen();
        }
    }

    vm.refreshQuestionGroupList=function(cb){
        ajaxGet('/question/retrieveGroupList',{lastRid:vm.questionGroupListLastId},function(result){
            if(result.code==0) {
                if (result.data.length > 0) {
                    vm.questionGroupListLastId = result.lastRid;
                    for (var i = 0; i < result.data.length; i++) {
                        var item = result.data[i];
                        if (item.questionsCount > 0) {
                            item.questions = [];
                            vm.questionGroupList.push(item);
                        }
                    }
                }
                clientInfoModel.checkRefreshStatus(result.data.length, "Qust");
            }
            if(cb){cb();}
        });
    }

    vm.initQuestionGroupList=function(cb){
        if(vm.questionGroupListLastId==-1){
            vm.questionGroupListLastId=0;
            vm.refreshQuestionGroupList(cb);
            return true;
        }else{
            if(cb){cb();}
            return false;
        }
    }
});

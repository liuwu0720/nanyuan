/**************************
 * 资讯编辑
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/
var tpl = require("../html/survey_edit.html");
var Position = require("position");
var groupId, type = 2;

var SurveyEdit = avalon.define("SurveyEdit", function (vm) {
    vm.obj = {
        rid: undefined,
        title: "",
        labelA: "",
        labelB: "",
        labelC: "",
        labelD: "",
        labelE: "",
        labelF: "",
        groupId: undefined
    };
    vm.save = function () {
        vm.obj.title = $.trim(vm.obj.title);
        vm.obj.labelA = $.trim(vm.obj.labelA);
        vm.obj.labelB = $.trim(vm.obj.labelB);
        var error = "";
        if (vm.obj.title.length > 25) {
            error = "问题长度不超过25字";
        } else if (!vm.obj.labelA.length || !vm.obj.labelB.length) {
            error = "至少存在A、B选项";
        }
        $(".question-item").each(function () {
            var val = $(this).val();
            if (val && val.length > 10) {
                return error = "选项长度不超过10";
            }
        });
        if (error) {
            $(".error > span").html(error);
            return $(".error").fadeIn().delay(5000).fadeOut();
        }

        var obj = {};
        for (var key in vm.obj.$model) {
            obj[key] = vm.obj.$model[key];
        }
        vm.obj.title = "";
        vm.obj.labelA = "";
        vm.obj.labelB = "";
        vm.obj.labelC = "";
        vm.obj.labelD = "";
        vm.obj.labelE = "";
        vm.obj.labelF = "";
        API.saveQuestion(obj, function (result) {
            if (vm.obj.rid) {
               return window.history.back();
            }
            Dialog.ConfirmBox.alert("添加成功");
        });
    }
    vm.back = function () {
        window.history.back();
    }
});

function questionById(rid, cb) {
    API.questionById(rid, cb);
}

module.exports = {
    tpl: tpl,
    model: SurveyEdit,
    render: function (param) {
        SurveyEdit.obj = {
            rid: undefined,
            title: "",
            labelA: "",
            labelB: "",
            labelC: "",
            labelD: "",
            labelE: "",
            labelF: "",
            groupId: undefined
        };
        SurveyEdit.obj.groupId = param.groupId;
        param && param.rid && questionById(param.rid, function (result) {
            if (result.data) {
                SurveyEdit.obj = result.data;
            }
        });
    }
}



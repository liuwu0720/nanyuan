/**************************
 * 资讯编辑
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/
var tpl = require("../../../html/weekly_edit.html");
var Position = require("position");
var editor;
var type = 4;

var WeeklyEdit = avalon.define("WeeklyEdit", function (vm) {
    vm.obj = {type: type,content: "", title: ""};                                                     // 编辑对象
    vm.save = function () {
        vm.obj.content = editor.getContent();
        if(vm.obj.title = $.trim(vm.obj.title)){
            API.saveDoc(vm.obj.$model, function (result) {
                window.history.back();
            });
        }else{
            $(".error").fadeIn().delay(5000).fadeOut();
        }
    }
    vm.back = function () {
        window.history.back();
    }
});

function queryDocById(rid, cb) {
    API.docById(rid, cb);
}

module.exports = {
    tpl: tpl,
    model: WeeklyEdit,
    render: function (param) {
        UE.delEditor('weekly-editor');
        editor = UE.getEditor('weekly-editor', {
            initialFrameHeight: 300,
            initialFrameWidth: 600,
            autoHeightEnabled: true,
            wordCount: false,
            elementPathEnabled: false
        });
        editor.ready(function () {
            WeeklyEdit.obj = {type: type, content: "", title: ""};
            param && param.rid && queryDocById(param.rid, function (result) {
                if (result.data) {
                    WeeklyEdit.obj = result.data;
                    editor.setContent(WeeklyEdit.obj.content || "");
                }
            });
        });
    }
}



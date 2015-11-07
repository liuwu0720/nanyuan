/**************************
 * 资讯编辑
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/
var tpl = require("../../../html/standard_edit.html");
var Position = require("position");
var editor;
var type = 3;

var StandardEdit = avalon.define("StandardEdit", function (vm) {
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
    model: StandardEdit,
    render: function (param) {
        UE.delEditor('standard-editor');
        editor = UE.getEditor('standard-editor', {
            initialFrameHeight: 300,
            initialFrameWidth: 600,
            autoHeightEnabled: true,
            wordCount: false,
            elementPathEnabled: false
        });
        editor.ready(function () {
            StandardEdit.obj = {type: type, content: "", title: ""};
            param && param.rid && queryDocById(param.rid, function (result) {
                if (result.data) {
                    StandardEdit.obj = result.data;
                    editor.setContent(StandardEdit.obj.content || "");
                }
            });
        });
    }
}



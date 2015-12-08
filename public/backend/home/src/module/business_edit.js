/**************************
 * 资讯编辑
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/
var tpl = require("../html/policy_edit.html");
var Position = require("position");
var editor;

var PolicyEdit = avalon.define("PolicyEdit", function (vm) {
    vm.obj = {type: 2,content: "", title: ""};                                                     // 编辑对象
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
    model: PolicyEdit,
    render: function (param) {
        UE.delEditor('info-editor');
        editor = UE.getEditor('info-editor', {
            initialFrameHeight: 300,
            initialFrameWidth: 600,
            autoHeightEnabled: true,
            wordCount: false,
            elementPathEnabled: false
        });
        editor.ready(function () {
            PolicyEdit.obj = {type: 2, content: "", title: ""};
            param && param.rid && queryDocById(param.rid, function (result) {
                if (result.data) {
                    PolicyEdit.obj = result.data;
                    editor.setContent(PolicyEdit.obj.content || "");
                }
            });
        });
    }
}



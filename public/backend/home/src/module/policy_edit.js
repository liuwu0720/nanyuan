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
    vm.obj = {type: 1, content: "", title: "", group_id: ""};                                                     // 编辑对象
    vm.groupList = [];                                                                                            // 分组
    vm.group_id = "";
    vm.save = function () {
        vm.obj.content = editor.getContent();
        if (!(vm.obj.title = $.trim(vm.obj.title))) {
            $(".error-title").fadeIn().delay(5000).fadeOut();
        }
        else if (!vm.obj.group_id) {
            $(".error-group").fadeIn().delay(5000).fadeOut();
        } else {
            API.saveDoc(vm.obj.$model, function (result) {
                window.history.back();
            });
        }
    }
    vm.back = function () {
        window.history.back();
    }
});

function queryDocById(rid, cb) {
    API.docById(rid, cb);
}
function groupList(doc_type) {
    API.groupByDocType(doc_type, function (result) {
        PolicyEdit.groupList = result.data;
    });
}
module.exports = {
    tpl: tpl,
    model: PolicyEdit,
    render: function (param) {
        PolicyEdit.obj = {type: 1, content: "", title: "", group_id: ""};
        UE.delEditor('policy-editor');
        editor = UE.getEditor('policy-editor', {
            initialFrameHeight: 300,
            initialFrameWidth: 600,
            autoHeightEnabled: true,
            wordCount: false,
            elementPathEnabled: false
        });
        editor.ready(function () {
            param && param.rid && queryDocById(param.rid, function (result) {
                if (result.data) {
                    PolicyEdit.obj = result.data;
                    editor.setContent(PolicyEdit.obj.content || "");
                }
            });
        });
        groupList(PolicyEdit.obj.type);
    }
}



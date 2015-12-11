/**************************
 * 资讯编辑
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/
var tpl = require("../html/flow_edit.html");
var Position = require("position");
var editor;
var type = 2;

var FlowEdit = avalon.define("FlowEdit", function (vm) {
    vm.obj = {type: type,content: "", title: "",group_id:""};                                                     // 编辑对象
    vm.groupList = [];
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

function groupList(doc_type) {
    API.groupByDocType(doc_type,function(result){
        FlowEdit.groupList = result.data;
    });
}

function queryDocById(rid, cb) {
    API.docById(rid, cb);
}

module.exports = {
    tpl: tpl,
    model: FlowEdit,
    render: function (param) {
        FlowEdit.obj = {type: type, content: "", title: "",group_id:""};
        UE.delEditor('flow-editor');
        editor = UE.getEditor('flow-editor', {
            initialFrameHeight: 300,
            initialFrameWidth: 600,
            autoHeightEnabled: true,
            wordCount: false,
            elementPathEnabled: false
        });
        editor.ready(function () {
            param && param.rid && queryDocById(param.rid, function (result) {
                if (result.data) {
                    FlowEdit.obj = result.data;
                    editor.setContent(FlowEdit.obj.content || "");
                }
            });
        });
        groupList(type);
    }
}



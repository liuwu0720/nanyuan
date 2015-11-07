/**************************
 * 平台指引
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/
var editor;
var introduction;
var tpl = require("../../../html/guide.html");
var Position = require("position");
var pos = [( $(window).width() - 300) / 2 + 80, 50];
var type = 2;

var Guide = avalon.define("Guide", function (vm) {      // 空vm   兼容页面访问时候ms-controller显示
    vm.obj = {};
    vm.switchType = function () {
        if (vm.obj.type == 2) {
            vm.obj.type = 4;
        } else {
            vm.obj.type = 2;
        }
        queryIntro(vm.obj.type, function (result) {
            if (result.data) {
                vm.obj = result.data;
                editor.setContent(vm.obj.introduction || "");
            } else {
                vm.obj = {rid: undefined, type: Guide.type, introduction: ""};
            }
        });
    }
    vm.saveIntro = function () {
        var content = editor.getContent();
        var obj = {};
        if (obj.introduction = $.trim(content)) {
            obj.type = vm.obj.type
            obj.rid = vm.obj.rid;
            API.saveIntro(obj, function (result) {
                result.rid && (vm.obj.rid = result.rid);
                dialog.set("content", '<div style="padding:10px 5px; text-align: center;"><p style="text-align: left;font-weight: bold;margin-bottom: 5px;">提示</p><hr> ' +
                    '<div style="padding:20px">内容已更新</div>' +
                    '</div>');
                dialog.show();
            });
        }
    }
});

var dialog = new Dialog({
    width: 300,
    align: {
        selfXY: [0, 0],                     // element 的定位点，默认为左上角
        baseElement: Position.VIEWPORT,     // 基准定位元素，默认为当前可视区域
        baseXY: pos                         // 基准定位元素的定位点，默认为左上角
    }
});
function queryIntro(type, cb) {
    API.queryIntro(type, function (result) {
        cb(result);
    });
}


module.exports = {
    tpl: tpl,
    model: Guide,
    render: function () {
        UE.delEditor('intr-editor');
        editor = UE.getEditor('intr-editor', {
            initialFrameHeight: 300,
            initialFrameWidth: 600,
            autoHeightEnabled: true,
            wordCount: false,
            elementPathEnabled: false
        });
        editor.ready(function () {
            queryIntro(type, function (result) {
                if (result.data) {
                    Guide.obj = result.data;
                    editor.setContent(Guide.obj.introduction || "")
                } else {
                    Guide.obj = {rid: undefined, type: type, introduction: ""};     // 默认显示使用手册
                }
            });
        });
    }
}



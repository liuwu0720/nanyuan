/**************************
 * 员工风采
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/
var editor;
var introduction;
var tpl = require("../html/introduction.tpl");
var Position = require("position");
var pos = [( $(window).width() - 300) / 2 + 80, 50];
var type = 1;

var  Introduction = avalon.define("Introduction",function(vm){      // 空vm   兼容页面访问时候ms-controller显示

});
var dialog = new Dialog({
    width: 300,
    align: {
        selfXY: [0, 0],                     // element 的定位点，默认为左上角
        baseElement: Position.VIEWPORT,     // 基准定位元素，默认为当前可视区域
        baseXY: pos                         // 基准定位元素的定位点，默认为左上角
    }
});
function queryIntro(type,cb) {
    API.queryIntro(type,function (result) {
        cb(result);
    });
}

function _saveHandler() {
    $("#save-intr-btn").on("click", function () {
        var content = editor.getContent();
        if (introduction.introduction = $.trim(content)) {
            API.saveIntro(introduction, function (result) {
                result.rid&&(introduction.rid = result.rid);
                dialog.set("content", '<div style="padding:10px 5px; text-align: center;"><p style="text-align: left;font-weight: bold;margin-bottom: 5px;">提示</p><hr> ' +
                    '<div style="padding:20px">简介已更新</div>' +
                    '</div>');
                dialog.show();
            });
        }
    });
}

module.exports = {
    tpl: tpl,
    model:Introduction,
    render: function () {
        introduction = {rid: undefined,type:type, introduction: ""};
        UE.delEditor('intr-editor');
        editor = UE.getEditor('intr-editor', {
            initialFrameHeight: 400,
            initialFrameWidth: 600,
            autoHeightEnabled: true,
            wordCount: false,
            elementPathEnabled: false
        });
        editor.ready(function () {
            queryIntro(type,function (result) {
                if (result.data) {
                    introduction = result.data;
                    introduction.introduction ? editor.setContent(introduction.introduction) : editor.execCommand('drafts');
                }
            });
        });
        _saveHandler();
    }
}



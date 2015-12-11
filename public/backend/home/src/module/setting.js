/**************************
 *办事机构b
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/

var tpl = require("../html/setting.tpl");
var Uploader = require("arale-upload");
var Position = require("position");
require("../../spm_modules/jcrop/jquery.Jcrop.js")(jQuery);
var WIDTH_LIMIT = 400;
var HEIGHT_LIMIT = 272;
var MIN_LENGTH = 272;
var editor, dialog, jcrop_api, uploader, isReleased, validator, cropData = {}, type = 1;

var Setting = avalon.define("Setting", function (vm) {
    vm.news1 = {rid: undefined, values: ""};                // 南园动态
    vm.news2 = {rid: undefined, values: ""};                // 民生实事
    vm.documents1 = {rid: undefined, values: ""};           // 政策法规
    vm.documents2 = {rid: undefined, values: ""};           //办事流程

    vm.tab_index = 2;

    vm.switchTab = function (tab_index) {
        vm.tab_index = tab_index;
    }
});

function saveSetting(obj, cb) {
    API.saveSetting(obj, function (result) {
        if (typeof cb === 'function') {
            cb(result);
        }
        Dialog.ConfirmBox.alert("设置已生效");
    });
}

function initDialog() {
    if (dialog) {
        dialog.destroy();
    }
    var pos = [( $(window).width() - WIDTH_LIMIT) / 2, ($(window).height() - HEIGHT_LIMIT) / 2 - 100];
    dialog = new Dialog({
        width: 500,
        height: 400,
        align: {
            selfXY: [0, 0],                     // element 的定位点，默认为左上角
            baseElement: Position.VIEWPORT,     // 基准定位元素，默认为当前可视区域
            baseXY: pos                         // 基准定位元素的定位点，默认为左上角
        }
    });
}

function uploadHandler() {
    new Uploader({
        trigger: '#news1-upload',
        accept: 'image/*',
        name: "Filedata",
        action: '/backend/upload/image'
    }).success(function (data) {
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            initPannel(1, data);
        }
    );
    new Uploader({
        trigger: '#news2-upload',
        accept: 'image/*',
        name: "Filedata",
        action: '/backend/upload/image'
    }).success(function (data) {
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            initPannel(2, data);
        }
    );
    new Uploader({
        trigger: '#documents2-upload',
        accept: 'image/*',
        name: "Filedata",
        action: '/backend/upload/image'
    }).success(function (data) {
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            initPannel(3, data);
        }
    );
    new Uploader({
        trigger: '#documents1-upload',
        accept: 'image/*',
        name: "Filedata",
        action: '/backend/upload/image'
    }).success(function (data) {
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            initPannel(4, data);
        }
    )
}
function initPannel(type, data) {
    dialog.before('show', function () {
        var pannel = '<div class="ui-pannel-crop"><img src="' + data.fileUrl + '" id="target" class="origin-img"></div> <div class="ui-pannel-footer"><a class="ui-button ui-button-mblue btn-confirm">确定</a><a class="ui-button ui-button-mwhite btn-cancel"  data-role="close">取消</a> </div>';
        this.set('content', pannel);
    }).show();
    isReleased = true;
    $(".ui-pannel-crop > img").load(function () {
        var origin_width = $(this).width();
        var origin_height = $(this).height();
        /*************************************************
         * 图片超过允许的最大宽高 则按缩小比例最大的缩小
         * 如果图片未超过宽高 则按原图裁剪
         * 如果图片过小 则放大大某一值后再裁剪
         * ***********************************************/
        var scaleW, scaleH, scale = 1;
        if (origin_width >= WIDTH_LIMIT || origin_height >= HEIGHT_LIMIT) {
            scaleW = origin_width / WIDTH_LIMIT;
            scaleH = origin_height / HEIGHT_LIMIT;
            scale = scaleH > scaleW ? scaleH : scaleW;            // 取比例最大的缩小
        } else if (origin_width < MIN_LENGTH || origin_height < MIN_LENGTH) {
            scaleW = origin_width / MIN_LENGTH;
            scaleH = origin_height / MIN_LENGTH;
            scale = scaleH < scaleW ? scaleH : scaleW;            // 取比例最小的放大
        }
        var width = origin_width / scale;
        var height = origin_height / scale;
        $(this).width(width);
        $(this).height(height);

        setTimeout(function () {                                 // 兼容IE
            cropHanlder(width, height, scale);
        }, 200);
    });
    $(".btn-confirm").click(function () {
        if(isReleased) return;
        API.cutPic(data.fileUrl, cropData, function (data) {
            if (data.code == 0) {
                if (type == 1) {
                    Setting.news1.values = data.url;
                    saveSetting({
                        rid: Setting.news1.rid,
                        parameter: "news1",
                        values: Setting.news1.values
                    }, function (result) {
                        if (result.rid) {
                            Setting.news1.rid = result.rid;
                        }
                    });
                }else if (type == 2) {
                    Setting.news2.values = data.url;
                    saveSetting({
                        rid: Setting.news2.rid,
                        parameter: "news2",
                        values: Setting.news2.values
                    }, function (result) {
                        if (result.rid) {
                            Setting.news2.rid = result.rid;
                        }
                    });
                } else if (type == 3) {
                    Setting.documents1.values = data.url;
                    saveSetting({
                        rid: Setting.documents1.rid,
                        parameter: "documents1",
                        values: Setting.documents1.values
                    }, function (result) {
                        if (result.rid) {
                            Setting.documents1.rid = result.rid;
                        }
                    });
                } else if (type == 4) {
                    Setting.documents2.values = data.url;
                    saveSetting({
                        rid: Setting.documents2.rid,
                        parameter: "documents2",
                        values: Setting.documents2.values
                    }, function (result) {
                        if (result.rid) {
                            Setting.documents2.rid = result.rid;
                        }
                    })
                }
                dialog.hide();
            }
        });
    });
}
function cropHanlder(width, height, scale) {
    if (jcrop_api) {
        jcrop_api.destroy();
    }
    $('#target').Jcrop({
        aspectRatio: 640/200,
        allowResize: true,
        onSelect: onSelect,
        onRelease: onRelease,
        addClass: "holder",
        boxWidth: WIDTH_LIMIT,
        boxHeight: HEIGHT_LIMIT
    }, function () {
        jcrop_api = this;
        if (width >= 160 && height >= 50) {
            isReleased = false;
            cropData.x = 0;
            cropData.y = 0;
            cropData.w = 50;
            cropData.h = 50;
            jcrop_api.animateTo([0, 0, 160, 50]);
        }else{
            isReleased = true;
            $(".btn-confirm").addClass("ui-button-mdisable").removeClass("ui-button-mblue");
        }
    });

    function onRelease() {
        isReleased = true;
        $(".btn-confirm").addClass("ui-button-mdisable").removeClass("ui-button-mblue");
    };

    function onSelect(c) {
        cropData.x = c.x * scale;
        cropData.y = c.y * scale;
        cropData.w = c.w * scale;
        cropData.h = c.h * scale;
        isReleased = false;
        $(".btn-confirm").removeClass("ui-button-mdisable").addClass("ui-button-mblue");
    }
}
function handleValues(values) {
    if (!values) return "";
    values = values.split("\n");
    var str = "";
    for (var i = 0; i < values.length; i++) {
        var item = values[i];
        item = item.replace(/\s/g, "");
        if (item) {
            if (i == values.length - 1) {
                str = str + item;
            } else {
                str = str + item + ",";
            }
        }
    }
    return str;
}
function querySetting(param) {
    API.setting(function (result) {
        var list = result.data || [];
        Setting.news1 = _.findWhere(list, {parameter: "news1"}) || {rid: undefined,parameter:"news1",values: ""};
        Setting.news2 = _.findWhere(list, {parameter: "news2"}) || {rid: undefined,parameter:"news2",values: ""};
        Setting.documents2 = _.findWhere(list, {parameter: "documents2"}) || {rid: undefined,parameter:"documents2", values: ""};
        Setting.documents1 = _.findWhere(list, {parameter: "documents1"}) || {rid: undefined,parameter:"documents1", values: ""};
    });
}

module.exports = {
    model: Setting,
    tpl: tpl,
    render: function () {
        querySetting();
        uploadHandler();
        initDialog();
    }
}



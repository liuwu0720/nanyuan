/**************************
 * 资讯编辑
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/
var tpl = require("../html/elegant_edit.html");
var Select = require('arale-select');
require("ztree")(jQuery);
require("jcrop")(jQuery);
var Position = require("position");
var Uploader = require("upload");
var WIDTH_LIMIT = 400;
var HEIGHT_LIMIT = 272;
var MIN_LENGTH = 272;
var editor, dialog, jcrop_api, uploader, isReleased, validator, cropData = {}, type = 1;

var ElegantEdit = avalon.define("ElegantEdit", function (vm) {
    vm.obj = {
        rid: undefined,
        name: '',
        sex:'男',
        photo: '',
        politics: '',
        title: '',
        mobile: '',
        department: '',
        content:'',
        listOrder: 1
    }
    // 编辑对象
    vm.save = function () {
        if (validator.form()) {
            if (!vm.obj.photo) {
                return $("p[for=photo]").show();
            }
            var content = $.trim(editor.getContent() || "");
            if(!content){
                return $("p[for=content]").show();
            }
            vm.obj.$model.content=content;
            API.saveElegant(vm.obj.$model, function (result) {
                window.history.back();
            });
        }
    }
    vm.back = function () {
        window.history.back();
    }
});
function queryElegantById(rid, cb) {
    API.elegantById(rid, function (result) {
        cb(result.data);
    });
}
function uploadHandler() {
    uploader = new Uploader({
        trigger: '#upload-photo',
        accept: 'image/*',
        name: "Filedata",
        action: '/backend/upload/image',
    }).success(function (data) {
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            initPannel(data);
        }
    )
}
function initPannel(data) {
    dialog.before('show', function () {
        var pannel = '<div class="ui-pannel-crop"><img src="' + data.fileUrl + '" id="target" class="origin-img"></div> <div class="ui-pannel-footer"><a class="ui-button ui-button-mblue btn-confirm">确定</a><a class="ui-button ui-button-mwhite btn-cancel"  data-role="close">取消</a> </div>';
        this.set('content', pannel);
    }).show();
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
        API.cutPic(data.fileUrl, cropData, function (data) {
            if (data.code == 0) {
                ElegantEdit.obj.photo = data.url;
                $("p[for=photo]").hide();
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
        aspectRatio: 1,
        allowResize: true,
        onSelect: onSelect,
        onRelease: onRelease,
        addClass: "holder",
        boxWidth: WIDTH_LIMIT,
        boxHeight: HEIGHT_LIMIT
    }, function () {
        jcrop_api = this;
        if (width >= 50 && height >= 50) {
            isReleased = false;
            cropData.x = 0;
            cropData.y = 0;
            cropData.w = 50;
            cropData.h = 50;
            jcrop_api.animateTo([0, 0, 50, 50]);
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
        $(".btn-confirm").removeClass("ui-button-mdisable").addClass("ui-button-mblue");
    }
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
function validateHandler() {
    var form = $('#elegantEdit-form');
    var options = {
        errorElement: 'p',                         //default input error message container
        errorClass: 'input-error',                 // default input error message class
        focusInvalid: true,                       // do not focus the last invalid input
        focusCleanup: true,
        rules: {
            name: {
                required: true,
                maxlength: 20
            },
            sex: {
                required: true
            },
            politics: {
                required: true,
                maxlength: 5
            },
            department: {
                required: true,
                maxlength:20
            },
            title: {
                required: true,
                maxlength: 10
            },
            listOrder: {
                digits: true,
                range: [1, 999999]
            }
        },
        messages: {
            name: {
                required: "<i class='iconfont'></i>&nbsp;填写姓名",
                maxlength: "<i class='iconfont'></i>&nbsp;长度不超过10字"
            },
            sex: {
                required: "<i class='iconfont'></i>&nbsp;选择性别"
            },
            politics: {
                required: "<i class='iconfont'></i>&nbsp;填写政治面貌",
                maxlength: "长度不超过5字"
            },
            department: {
                required: "<i class='iconfont'></i>&nbsp;填写所在部门",
                maxlength: "<i class='iconfont'></i>&nbsp;长度不超过20字"
            },
            title: {
                required: "<i class='iconfont'></i>&nbsp;填写职务",
                maxlength: "<i class='iconfont'></i>&nbsp;长度不超过10字"
            },
            listOrder: {
                digits: "<i class='iconfont'></i>&nbsp;填写1-999999的整数",
                range: "<i class='iconfont'></i>&nbsp;填写1-999999的整数"
            }
        }
    }
    return form.validate(options);
}

function _handlerEditor(content) {
    UE.delEditor('elegant-editor');
    editor = UE.getEditor('elegant-editor', {
        initialFrameHeight: 600,
        initialFrameWidth: 600,
        autoHeightEnabled: true,
        wordCount: false,
        elementPathEnabled: false
    });
    editor.ready(function () {
        editor.setContent(content || "");
    });
}
module.exports = {
    tpl: tpl,
    model: ElegantEdit,
    render: function (param) {
        async.waterfall([function (cb) {
            if (param && param.rid) {
                queryElegantById(param.rid, function (result) {
                    cb(null, result);
                });
            } else {
                cb(null, null);
            }
        }], function (err, result) {
            ElegantEdit.obj = result || {
                    rid: undefined,
                    name: '',
                    sex:'男',
                    photo: '',
                    politics: '',
                    title: '',
                    mobile: '',
                    department: '',
                    content:'',
                    listOrder: 1
                };
            initDialog();
            uploadHandler();
            _handlerEditor(ElegantEdit.obj.content);
            validator = validateHandler();
        });
    }
}
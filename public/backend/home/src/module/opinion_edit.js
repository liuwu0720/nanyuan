/**************************
 * 资讯编辑
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/
require("../../spm_modules/jcrop/jquery.Jcrop.js")(jQuery);
var tpl = require("../html/opinion_edit.tpl");
var Position = require("position");
var Uploader = require("arale-upload");
var WIDTH_LIMIT = 400;
var HEIGHT_LIMIT = 272;
var MIN_LENGTH = 272;
var editor, dialog, jcrop_api, uploader, isReleased, cropData = {};

var OpinionEdit = avalon.define("OpinionEdit", function (vm) {
        vm.obj = {rid: undefined, cover: "", title: "", content: ""};                                                     // 编辑对象
        vm.save = function () {
            if (!vm.obj.cover) {
                $(".error-cover span").html("上传封面");
                $(".error-cover").fadeIn().delay(5000).fadeOut();
                return;
            }
            if (!(vm.obj.title = $.trim(vm.obj.title))) {
                $(".error-title span").html("标题不能为空");
                $(".error-title").fadeIn().delay(5000).fadeOut();
                return;
            }
            if (vm.obj.title.length > 50) {
                $(".error-title span").html("标题不超过50字");
                $(".error-title").fadeIn().delay(5000).fadeOut();
                return;
            }
            if (!(vm.obj.content = $.trim(vm.obj.content))) {
                $(".error-content span").html("内容不能为空");
                $(".error-content").fadeIn().delay(5000).fadeOut();
                return;
            }
            API.saveOpinion(vm.obj.$model, function (result) {
                window.history.back();
            });
        }
        vm.back = function () {
            window.history.back();
        }
    })
    ;

function queryById(rid, cb) {
    API.opinionById(rid, cb);
}

function uploadHandler() {
    uploader = new Uploader({
        trigger: '#upload-icon',
        accept: 'image/*',
        name: "Filedata",
        action: '/backend/upload/image'
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
                OpinionEdit.obj.cover = data.url;
                dialog.hide();
            }
        });
    });
};

function cropHanlder(width, height, scale) {
    $('#target').Jcrop({
        aspectRatio: 200 / 136,
        allowResize: true,
        onSelect: onSelect,
        onRelease: onRelease,
        addClass: "holder",
        boxWidth: WIDTH_LIMIT,
        boxHeight: HEIGHT_LIMIT
    }, function () {
        jcrop_api = this;
        isReleased = false;
        cropData.x = 0;
        cropData.y = 0;
        cropData.w = 100;
        cropData.h = 68;
        jcrop_api.animateTo([0, 0, 100, 68]);
    });

    function onRelease() {
        isReleased = true;
        $(".btn-confirm").addClass("ui-button-mdisable").removeClass("ui-button-mblue");
        ;
    };

    function onSelect(c) {
        cropData.x = c.x * scale;
        cropData.y = c.y * scale;
        cropData.w = c.w * scale;
        cropData.h = c.h * scale;
        $(".btn-confirm").removeClass("ui-button-mdisable").addClass("ui-button-mblue");
    }
}

module.exports = {
    tpl: tpl,
    model: OpinionEdit,
    render: function (param) {
        OpinionEdit.obj = {rid: undefined, cover: "", title: "", content: ""};
        param && param.rid && queryById(param.rid, function (result) {
            if (result.data) {
                OpinionEdit.obj = result.data;
            }
        });
        uploadHandler();
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
}



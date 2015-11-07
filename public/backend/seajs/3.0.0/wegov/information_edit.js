/**************************
 * 资讯编辑
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/
require("jcrop")(jQuery);
var tpl = require("../../../html/information_edit.html");
var Position = require("position");
var Uploader = require("upload");
var WIDTH_LIMIT = 400;
var HEIGHT_LIMIT = 272;
var MIN_LENGTH = 272;
var editor, dialog, jcrop_api, uploader, isReleased, cropData = {},type=1;

var InformationEdit = avalon.define("InformationEdit", function (vm) {
    vm.obj = {type: type, newsImage: "", content: "", title: ""};                                                     // 编辑对象
    vm.edit = function () {
        avalon.router.navigate("/information_edit/" + obj.rid || 0);
    }
    vm.save = function () {
        vm.obj.content = editor.getContent();
        if(vm.obj.title = $.trim(vm.obj.title)){
            API.saveNews(vm.obj.$model, function (result) {
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

function queryInfoById(rid, cb) {
    API.newById(rid, cb);
}

function uploadHandler() {
    uploader = new Uploader({
        trigger: '#upload-icon',
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
                InformationEdit.obj.newsImage = data.url;
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
    model: InformationEdit,
    render: function (param) {
        UE.delEditor('info-editor');
        editor = UE.getEditor('info-editor', {
            initialFrameHeight: 300,
            initialFrameWidth: 600,
            autoHeightEnabled: true,
            wordCount: false,
            elementPathEnabled: false,
            toolbars:[[
                'fullscreen', 'source', '|', 'undo', 'redo', '|',
                'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'removeformat', 'blockquote', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist','|',
                'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
                'directionalityltr', 'directionalityrtl', 'indent', '|',
                'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
                'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
                'simpleupload', 'insertimage', 'emotion', 'scrawl', 'insertvideo', 'music', 'attachment', 'map', 'gmap', 'insertframe', 'insertcode', 'webapp', 'pagebreak', 'template', 'background', '|',
                'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|',
                'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
                'print', 'preview', 'searchreplace', 'help', 'drafts'
            ]]
        });
        editor.ready(function () {
            InformationEdit.obj = {type: type, newsImage: "", content: "", title: ""};
            param && param.rid && queryInfoById(param.rid, function (result) {
                if (result.data) {
                    InformationEdit.obj = result.data;
                    editor.setContent(InformationEdit.obj.content || "");
                }
            });
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



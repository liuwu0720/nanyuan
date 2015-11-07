/**************************
 * 资讯编辑
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/
var tpl = require("../../../html/staff_edit.html");
var Select = require('arale-select');
require("ztree")(jQuery);
require("jcrop")(jQuery);
var Position = require("position");
var Uploader = require("upload");
var WIDTH_LIMIT = 400;
var HEIGHT_LIMIT = 272;
var MIN_LENGTH = 272;
var editor, dialog, jcrop_api, uploader, isReleased, validator, cropData = {}, type = 1;

var StaffEdit = avalon.define("StaffEdit", function (vm) {
    vm.obj = {
        rid: undefined,
        username: '',
        password:'',
        photo:'',
        politics: '',
        title: '',
        role: '',
        mobile: '',
        departmentId: undefined,
        listOrder: 0
    };
    vm.department = "";
    // 编辑对象
    vm.save = function () {
        if(validator.form()){
           /* if(!vm.obj.photo){
               return $("p[for=photo]").show();
            }*/
            if(!vm.obj.role){
                return $("p[for=role]").show();
            }
            if(!vm.obj.departmentId){
                return $("p[for=dempartment]").show();
            }
            API.saveStaff(vm.obj.$model, function (result) {
                window.history.back();
            });
        }
    }
    vm.back = function () {
        window.history.back();
    }
});

function queryStaffById(rid, cb) {
    API.staffById(rid, cb);
}
function handlerSelect(type) {
    new Select({
        trigger: '#role-select',
        model: [
            {value: '', text: '选择角色', selected: !type},
            {value: 'T', text: '网格员', selected: (type == "T")},
            {value: 'M', text: '负责人', selected: (type == "M")},
            {value: 'P', text: '警&nbsp;&nbsp;&nbsp;察', selected: (type == "P")},
            {value: 'W', text: '工作人员', selected: (type == "W")},
            {value: 'D', text: '市区领导', selected: (type == "D")},
            {value: 'O', text: '其它工作人员', selected: (type == "O")},
            {value: 'L', text: '其它领导', selected: (type == "L")}
        ]
    }).render().on('change', function (target, prev) {
            var status = target.attr("data-value");
            StaffEdit.obj.role = status;
            if(status){
                $("p[for=role]").hide();
            }
        });
}
function treeHandler(data) {
    var setting = {
        view: {
            dblClickExpand: false
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onClick: function (event, treeId, node) {
                StaffEdit.department = node.name;
                StaffEdit.obj.departmentId = node.id;
                $("p[for=department]").hide();
            }
        }
    };
    $.fn.zTree.init($("#staffEdit-departmentTree"), setting, data);
}
function queryDepartment(cb) {
    API.departmentList(function (result) {
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
                StaffEdit.obj.photo = data.url;
                $("p[for=photo]").hide();
                dialog.hide();
            }
        });
    });
}
function cropHanlder(width, height, scale) {
    if(jcrop_api){
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
    if(dialog){
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
    var form = $('#staffEdit-form');
    var options = {
        errorElement: 'p',                         //default input error message container
        errorClass: 'input-error',                 // default input error message class
        focusInvalid: true,                       // do not focus the last invalid input
        focusCleanup: true,
        rules: {
            username: {
                required: true,
                maxlength: 20
            },
            password: {
                required:true,
                password: true
            },
            politics: {
                required: true,
                maxlength: 5
            },
            department: {
                required: true
            },
            title: {
                required:true,
                maxlength: 10
            },
            role: {
                required: true
            },
            listOrder: {
                digits: true,
                range: [0, 999999]
            },
            mobile: {
                required:true,
                mobile: true
            },
            photo: {
                required: true
            }
        },
        messages: {
            username: {
                required: "<i class='iconfont'></i>&nbsp;填写姓名",
                maxlength: "<i class='iconfont'></i>&nbsp;长度不超过10字"
            },
            password: {
                required:"<i class='iconfont'></i>&nbsp;密码为6-18位的字母、数字或下划线",
                password: "<i class='iconfont'></i>&nbsp;密码为6-18位的字母、数字或下划线"
            },
            politics: {
                required: "<i class='iconfont'></i>&nbsp;填写政治面貌",
                maxlength: "长度不超过5字"
            },
            department: {
                required: "<i class='iconfont'></i>&nbsp;选择所在部门"
            },
            title: {
                required:"<i class='iconfont'></i>&nbsp;填写职务",
                maxlength: "<i class='iconfont'></i>&nbsp;长度不超过10字"
            },
            role: {
                required: "<i class='iconfont'></i>&nbsp;选择角色"
            },
            listOrder: {
                digits: "<i class='iconfont'></i>&nbsp;填写0-999999的整数",
                range: "<i class='iconfont'></i>&nbsp;填写0-999999的整数"
            },
            mobile: {
                required:"<i class='iconfont'></i>&nbsp;填写手机号码",
                mobile: "<i class='iconfont'></i>&nbsp;手机号码不正确"
            },
            photo: {
                required: "<i class='iconfont'></i>&nbsp;上传相片"
            }
        }
    }
    return form.validate(options);
}
module.exports = {
    tpl: tpl,
    model: StaffEdit,
    render: function (param) {
        StaffEdit.obj = {
            rid: undefined,
            username: '',
            password:'',
            photo:'',
            politics: '',
            title: '',
            role: '',
            mobile: '',
            departmentId: undefined,
            listOrder: 1
        };
        async.waterfall([function (cb) {
            queryDepartment(function (r) {
                var data = _.map(r, function (d) {
                    return {id: d.rid, pId: d.parentId, name: d.department, open: (!d.parentId)};
                })
                treeHandler(data);
                cb(null, null);
            });
        }, function (r, cb) {
            var tree = $.fn.zTree.getZTreeObj("staffEdit-departmentTree");
            if( param && param.rid){
                queryStaffById(param.rid, function (result) {
                    if (result.data) {
                        StaffEdit.obj = result.data;
                        handlerSelect(StaffEdit.obj.role);
                        var node = tree.getNodeByParam("id",StaffEdit.obj.departmentId);
                        node && (tree.selectNode(node), StaffEdit.department = node.name);
                        cb(null, null);
                    }
                });
            }else{
                var departmentId = $("#main").attr("data-department");
                if(departmentId){
                    var node = tree.getNodeByParam("id",departmentId);
                    node && (tree.selectNode(node), StaffEdit.department = node.name, StaffEdit.obj.departmentId = node.id);
                }
                handlerSelect();
                cb(null, null);
            }
        }], function (err, result) {
            uploadHandler();
            initDialog();
            validator = validateHandler();
        });
    }
}
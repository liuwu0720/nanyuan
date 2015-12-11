/**************************
 * 专项行动
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/
var tpl = require("../html/specific_edit.tpl");
var validator;

var SpecificEdit = avalon.define("SpecificEdit", function (vm) {
    vm.obj = {
        activityName: "",
        status: "C"
    };                                                     // 编辑对象
    vm.save = function () {
        if (validator.form()) {
            API.saveSpecific(vm.obj.$model, function (result) {
                window.history.back();
            });
        }
    }
    vm.back = function () {
        window.history.back();
    }

    vm.switchStatus = function (status) {
        status = status == "N" ? "C" : "N";
        vm.obj.status = status;
    }
});
function validateHandler() {
    var form = $('#specific-form');
    var options = {
        errorElement: 'p',                         //default input error message container
        errorClass: 'input-error',                 // default input error message class
        focusInvalid: true,                       // do not focus the last invalid input
        focusCleanup: true,
        rules: {
            activityName: {
                required: true,
                maxlength: 120
            }
        },
        messages: {
            contactMan: {
                required: "<i class='iconfont'></i>&nbsp;填写专项行动名称",
                maxlength: "<i class='iconfont'></i>&nbsp;长度不超过100字"
            }
        },
    }
    return form.validate(options);
}
function querySpecificById(rid, cb) {
    API.specificById(rid, cb);
}

module.exports = {
    tpl: tpl,
    model: SpecificEdit,
    render: function (param) {
        SpecificEdit.obj = {
            activityName: "",
            status: "N"
        };
        param.rid && querySpecificById(param.rid, function (result) {
            if (result.data) {
                SpecificEdit.obj = result.data;
            }
        });
        validator = validateHandler();
    }
}



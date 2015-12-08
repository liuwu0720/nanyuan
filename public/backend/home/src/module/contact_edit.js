/**************************
 * 资讯编辑
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/
var tpl = require("../html/contact_edit.html");
var validator;

var ContactEdit = avalon.define("ContactEdit", function (vm) {
    vm.obj = {
        type: "",
        department: "",
        contactMan: "",
        title: "",
        tel: "",
        groupName: "",
        listOrder: ""
    };
    vm.save = function () {
        if (validator.form()) {
            var obj = paramHandler(vm.obj.$model);
            API.saveContact(obj, function (result) {
                window.history.back();
            });
        }
    }
    vm.back = function () {
        window.history.back();
    }
});

function paramHandler(obj) {
    switch (obj.department) {
        case "1":
            obj.type = "1";
            obj.groupName = "市办领导";
            obj.department = "市办领导"
            break;
        case "2":
            obj.type = "1";
            obj.groupName = "区公安分局";
            obj.department = "区公安分局";
            break;
        case "3":
            obj.type = "1";
            obj.groupName = "区政法委(综治办)";
            obj.department = "区政法委(综治办)";
            break;
        case "4":
            obj.type = "11";
            obj.groupName = "区综管办(网格办)";
            obj.department = "区综管办(网格办)";
            break;
        case "5":
            obj.type = "11";
            obj.groupName = "区综管办(网格办)";
            obj.department = "综合科";
            break;
        case "6":
            obj.type = "11";
            obj.groupName = "区综管办(网格办)";
            obj.department = "业务科";
            break;
        case "7":
            obj.type = "11";
            obj.groupName = "区综管办(网格办)";
            obj.department = "稽查科";
            break;
        case "8":
            obj.type = "11";
            obj.groupName = "区综管办(网格办)";
            obj.department = "稽查科";
            break;
        case "9":
            obj.type = "11";
            obj.groupName = "区综管办(网格办)";
            obj.department = "出租屋管理信息中心";
            break;
    }
    return obj;
}
function departmentConvert(val) {
    switch (val) {
        case "市办领导":
            return "1";
        case "区公安分局":
            return "2";
        case "区政法委（综治办）":
        case "区政法委(综治办)":
            return "3";
        case "区综管办（网格办）":
        case "区综管办(网格办)":
            return "4";
        case "综合科":
            return "5";
        case "业务科":
            return "6";
        case "稽查科":
            return "7"
        case "网格管理科":
            return "8";
        case "出租屋管理信息中心":
            return "9";
    }
}
function validateHandler() {
    var form = $('#contactEdit-form');
    var options = {
        errorElement: 'p',                         //default input error message container
        errorClass: 'input-error',                 // default input error message class
        focusInvalid: true,                       // do not focus the last invalid input
        focusCleanup: true,
        rules: {
            contactMan: {
                required: true,
                maxlength: 20
            },
            department: {
                required: true,
                maxlength: 50
            },
            title: {
                required: true,
                maxlength: 20
            },
            listOrder: {
                digits: true,
                range: [1, 10000]
            },
            tel: {
                required: true,
                phone: true
            }
        },
        messages: {
            contactMan: {
                required: "<i class='iconfont'></i>&nbsp;填写联系人",
                maxlength: "<i class='iconfont'></i>&nbsp;长度不超过20字"
            },
            department: {
                required: "<i class='iconfont'></i>&nbsp;选择部门",
                maxlength: "<i class='iconfont'></i>&nbsp;长度不超过50字"
            },
            title: {
                required: "<i class='iconfont'></i>&nbsp;填写职位",
                maxlength: "<i class='iconfont'></i>&nbsp;长度不超过20字"
            },
            listOrder: {
                digits: "<i class='iconfont'></i>&nbsp;输入1-10000内的整数",
                range: "<i class='iconfont'></i>&nbsp;输入1-10000内的整数"
            },
            tel: {
                required: "<i class='iconfont'></i>&nbsp;填写联系方式",
                phone: "<i class='iconfont'></i>&nbsp;填写正确的手机或座机号码"
            }
        },
    }
    return form.validate(options);
}
function queryContactById(rid, cb) {
    API.agencyById(rid, cb);
}
module.exports = {
    tpl: tpl,
    model: ContactEdit,
    render: function (param) {
        ContactEdit.obj = {
            type: "",
            department: "",
            contactMan: "",
            title: "",
            tel: "",
            groupName: "",
            listOrder: ""
        };
        param.rid && queryContactById(param.rid, function (result) {
            if (result.data) {
                ContactEdit.obj = result.data;
                ContactEdit.obj.department = departmentConvert(ContactEdit.obj.department);
            }
        });
        validator = validateHandler();
    }
}



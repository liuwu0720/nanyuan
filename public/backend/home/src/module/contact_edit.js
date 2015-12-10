/**************************
 * 资讯编辑
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/
var tpl = require("../html/contact_edit.html");
var type = 1;
var validator;

var ContactEdit = avalon.define("ContactEdit", function (vm) {
    vm.obj = {
        type: "1",
        department: "",
        tel: "",
        groupName: "",
        listOrder: ""
    };
    vm.save = function () {
        if (validator.form()) {
            var obj = vm.obj.$model;
            vm.obj.groupName =  vm.obj.department;
            API.saveContact(obj, function (result) {
                window.history.back();
            });
        }
    }
    vm.back = function () {
        window.history.back();
    }
});

function validateHandler() {
    var form = $('#contactEdit-form');
    var options = {
        errorElement: 'p',                         //default input error message container
        errorClass: 'input-error',                 // default input error message class
        focusInvalid: true,                       // do not focus the last invalid input
        focusCleanup: true,
        rules: {
            department: {
                required: true,
                maxlength: 50
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
            department: {
                required: "*&nbsp;选择部门",
                maxlength: "*&nbsp;长度不超过50字"
            },
            listOrder: {
                digits: "*&nbsp;输入1-10000内的整数",
                range: "*&nbsp;输入1-10000内的整数"
            },
            tel: {
                required: "*&nbsp;填写联系方式",
                phone: "*&nbsp;填写正确的手机或座机号码"
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
            type: type,
            department: "",
            tel: "",
            groupName: "",
            listOrder: ""
        };
        param.rid && queryContactById(param.rid, function (result) {
            if (result.data) {
                ContactEdit.obj = result.data;
                ContactEdit.obj.department = ContactEdit.obj.department;
            }
        });
        validator = validateHandler();
    }
}



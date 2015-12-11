/**************************
 * 专项行动
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/
var tpl = require("../html/administrator_edit.tpl");
var validator,role_id = 2;  // 新增用户默认为普通管理员
var AdministratorEdit = avalon.define("AdministratorEdit", function (vm) {
    vm.obj =  {
        rid:undefined,
        username: "",
        nickname: "",
        phone: "",
        role_id:role_id
    };                                              // 编辑对象
    vm.save = function () {
        if (validator.form()) {
            var tip = "";
            if(vm.obj.rid){
                tip = "用户修改成功";
            }else{
                tip = "管理员已添加成功,默认密码123456";
            }
            API.saveAdmin(vm.obj.$model, function (result) {
                if(result.code==0){
                    Dialog.ConfirmBox.alert("<span style='font-weight:bold;display:block;padding:10px;font-size:14px;'>"+tip+"</span>",function () {
                        window.history.back();
                    });
                }else{
                    tip = "用户名已经存在!";
                    Dialog.ConfirmBox.alert("<span style='font-weight:bold;display:block;padding:10px;font-size:14px;'>"+tip+"</span>");
                }
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
    var form = $('#admin-form');
    var options = {
        errorElement: 'p',                         //default input error message container
        errorClass: 'input-error',                 // default input error message class
        focusInvalid: true,                       // do not focus the last invalid input
        focusCleanup: true,
        rules: {
            username: {
                required: true,
                minlength:6,
                maxlength:20
            },
            nickname:{
                required: true,
                minlength:2,
                maxlength:20
            },
            phone:{
                mobile:true
            }
        },
        messages: {
            username: {
                required: "*&nbsp;填写用户名",
                minlength: "*&nbsp;长度为6-20字",
                maxlength: "*&nbsp;长度为6-20字"
            },
            nickname: {
                required: "*&nbsp;填写用户姓名",
                minlength: "*&nbsp;用户名至少为2字",
                maxlength: "*&nbsp;用户名不超过20字"
            }
        },
    }
    return form.validate(options);
}
function queryAdminById(rid, cb) {
    API.adminById(rid, cb);
}

module.exports = {
    tpl: tpl,
    model: AdministratorEdit,
    render: function (param) {
        AdministratorEdit.obj = {
            rid:undefined,
            username: "",
            nickname: "",
            phone: "",
            role_id:role_id
        };
        param.rid && queryAdminById(param.rid, function (result) {
            if (result.data) {
                AdministratorEdit.obj = result.data;
            }
        });
        validator = validateHandler();
    }
}



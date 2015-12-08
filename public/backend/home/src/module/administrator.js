/**************************
 *办事机构b
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/

var tpl = require("../html/administrator.html");
var Paging = require("paging");
var Position = require("position");
var pageSize = 10;
var pos = [( $(window).width() - 420) / 2, ( $(window).height() - 400) / 2];

var dialog = new Dialog({
    width: 420,
    align: {
        selfXY: [0, 0],                     // element 的定位点，默认为左上角
        baseElement: Position.VIEWPORT,     // 基准定位元素，默认为当前可视区域
        baseXY: pos                         // 基准定位元素的定位点，默认为左上角
    }
});

var Administrator = avalon.define("Administrator", function (vm) {
    vm.list = [];
    vm.totalItems = 0;
    vm.currentPage = 1;
    vm.roleType = avalon.vmodels["Header"].user.roleType;
    vm.$admin = null;
    vm.edit = function (el) {
        avalon.router.navigate("/administrator_edit" + "/" + ((el && el.rid) || 0));
    }
    vm.setPassword = function (el) {
        tpl = "<div id='reply-pannel' style='padding: 20px 50px;'><p style='font-weight: bold;font-size: 14px;' id='title'>修改密码</p><hr><p id='tip' class='warn' style='margin-top:10px;text-align:center;visibility: hidden;'><i class='iconfont'>&#xe609;</i>&nbsp;<span class='tip-err'></span></p>" +
            "<table style='margin:0px auto;text-align: left;width:100%;'>" +
            "<tr  style='padding:10px 0px;height: 40px'>" +
            "<th>新&nbsp;&nbsp;密&nbsp;&nbsp;码:</th>" +
            "<td><input id='password' type='password' class='ui-input'></td>" +
            "</tr>" +
            "<tr  style='padding:10px 0px;height: 40px'>" +
            "<th>重&nbsp;复&nbsp;密&nbsp;码:</th>" +
            "<td><input id='repassword' type='password'  class='ui-input'></td>" +
            "</tr>" +
            "</table>" +
            "<div style='text-align:center;padding:20px;'>" +
            "<a class='ui-button ui-button-mblue' style='margin-right: 10px;;' onclick='savePassword()'>确&nbsp;&nbsp;&nbsp;定</a><a class='ui-button ui-button-mwhite' data-role='close'>取&nbsp;&nbsp;&nbsp;消</a> </div>" +
            "</div>";
        dialog.set("content", tpl).show();
        $("#password").val("");
        $("#repassword").val("");
        $("#tip").css("visibility", "hidden");
        vm.$admin = el;
    }
    vm.del = function (rid) {
        Dialog.ConfirmBox.confirm("确定删除当前内容吗?", "提示", function () {
            API.delAdmin(rid, function (result) {
                vm.totalItems = 0;
                vm.currentPage = 1;
                queryAdmin({currentPage: vm.currentPage, pageSize: pageSize});
            });
        });
    }
    vm.$watch("totalItems", function (val) {
        renderPager(vm.currentPage, val, pageSize);
    });
    vm.$watch("currentPage", function (val) {
        renderPager(val, vm.totalItems, pageSize);
    })
});
function queryAdmin(param) {
    API.adminList(param, function (result) {
        Administrator.list = result.data.list || [];
        Administrator.totalItems = Administrator.list.size() ? result.data.totalItems : 0;
    });
}

function renderPager(currentPage, totalItems, pageSize) {
    var html = Paging.render({
        // 当前页
        currentPage: currentPage,
        // 总页数
        pageCount: parseInt((totalItems + pageSize - 1) / pageSize),
        // 链接前缀
        link: '#!/administrator/'
    })
    document.getElementById('paging').innerHTML = html
}

function savePassword() {
    var password = $.trim($("#password").val());
    var repassword = $.trim($("#repassword").val());
    var reg = /^[a-zA-Z0-9_]{6,18}$/;
    var tip = "";
    if (!reg.test(password)) {
        tip = "密码6-18位字母、数字或下划线";
    } else if (password !== repassword) {
        tip = "两次密码输入不一致";
    }
    if (tip) {
        $("#tip .tip-err").html(tip);
        $("#tip").css("visibility", "visible");
        return;
    }
    var obj = {rid: Administrator.$admin.rid, password: password};
    dialog.hide();
    API.saveAdminPassword(obj, function (result) {
        Dialog.ConfirmBox.alert("密码修改成功!");
    });
}

module.exports = {
    model: Administrator,
    tpl: tpl,
    render: function (param) {
        Administrator.totalItems = 0;
        Administrator.currentPage = param.currentPage || 1;
        queryAdmin({currentPage: Administrator.currentPage, pageSize: pageSize});
        window.savePassword = savePassword;
    }
}



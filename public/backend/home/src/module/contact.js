/**************************
 *办事机构b
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/

var tpl = require("../html/contact.html");
var Paging = require("paging");
var Position = require("position");
var pos = [( $(window).width() - 300) / 2 + 80, 50];
var types = [1,11];                              // 类型
var pageSize = 8;

var Contact = avalon.define("Contact", function (vm) {
    vm.list = [];
    vm.totalItems = 0;
    vm.currentPage = 1;
    vm.edit = function (el) {
        avalon.router.navigate("/contact_edit" + "/" + ((el && el.rid) || 0));
    }
    vm.del = function (rid) {
        Dialog.ConfirmBox.confirm("确定删除当前内容吗?", "提示", function () {
            API.delAgency(rid, function (result) {
                vm.totalItems = 0;
                vm.currentPage = 1;
                queryContact({types: types, currentPage: vm.currentPage, pageSize: pageSize});
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
function queryContact(param) {
    API.contact(param, function (result) {
        Contact.list = result.data.list || [];
        Contact.totalItems = Contact.list.size() ? result.data.totalItems : 0;
    });
}

function renderPager(currentPage, totalItems, pageSize) {
    var html = Paging.render({
        // 当前页
        currentPage: currentPage,
        // 总页数
        pageCount: parseInt((totalItems + pageSize - 1) / pageSize),
        // 链接前缀
        link: '#!/contact/'
    })
    document.getElementById('paging').innerHTML = html
}

module.exports = {
    model: Contact,
    tpl: tpl,
    render: function (param) {
        Contact.totalItems = 0;
        Contact.currentPage = param.currentPage || 1;
        queryContact({types: types, currentPage: Contact.currentPage, pageSize: pageSize});
    }
}



/**************************
 * 政策指向
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/

var tpl = require("../html/standard.html");
var Paging = require("paging");
var Position = require("position");
var pos = [( $(window).width() - 300) / 2 + 80, 50];
var type = 3;
var pageSize = 8;

var Standard = avalon.define("Standard", function (vm) {
    vm.list = [];
    vm.totalItems = 0;
    vm.currentPage = 1;
    vm.edit = function (el) {
        avalon.router.navigate("/standard_edit" + "/" + ((el && el.rid) || 0));
    }
    vm.del = function (rid) {
        Dialog.ConfirmBox.confirm("确定删除当前内容吗?", "提示", function () {
            API.delDoc(rid, function (result) {
                vm.totalItems = 0;
                vm.currentPage = 1;
                queryDocByType({type: type, currentPage: vm.currentPage, pageSize: pageSize});
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
function queryDocByType(param) {
    API.docByType(param, function (result) {
        Standard.list = result.data.list || [];
        Standard.totalItems = Standard.list.size() ? result.data.totalItems : 0;
    });
}

function renderPager(currentPage, totalItems, pageSize) {
    var html = Paging.render({
        // 当前页
        currentPage: currentPage,
        // 总页数
        pageCount: parseInt((totalItems + pageSize - 1) / pageSize),
        // 链接前缀
        link: '#!/standard/'
    })
    document.getElementById('paging').innerHTML = html;
}

module.exports = {
    model: Standard,
    tpl: tpl,
    render: function (param) {
        Standard.totalItems = 0;
        Standard.currentPage = param.currentPage || 1;
        queryDocByType({type: type, currentPage: Standard.currentPage, pageSize: pageSize});
    }
}



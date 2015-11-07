/**************************
 * 政策指向
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/

var tpl = require("../../../html/weekly.html");
var Paging = require("paging");
var Position = require("position");
var pos = [( $(window).width() - 300) / 2 + 80, 50];
var type = 4;
var pageSize = 8;

var Weekly = avalon.define("Weekly", function (vm) {
    vm.list = [];
    vm.totalItems = 0;
    vm.currentPage = 1;
    vm.edit = function (el) {
        avalon.router.navigate("/weekly_edit" + "/" + ((el && el.rid) || 0));
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
        Weekly.list = result.data.list || [];
        Weekly.totalItems = Weekly.list.size() ? result.data.totalItems : 0;
    });
}

function renderPager(currentPage, totalItems, pageSize) {
    var html = Paging.render({
        // 当前页
        currentPage: currentPage,
        // 总页数
        pageCount: parseInt((totalItems + pageSize - 1) / pageSize),
        // 链接前缀
        link: '#!/weekly/'
    })
    document.getElementById('paging').innerHTML = html;
}

module.exports = {
    model: Weekly,
    tpl: tpl,
    render: function (param) {
        Weekly.totalItems = 0;
        Weekly.currentPage = param.currentPage || 1;
        queryDocByType({type: type, currentPage: Weekly.currentPage, pageSize: pageSize});
    }
}



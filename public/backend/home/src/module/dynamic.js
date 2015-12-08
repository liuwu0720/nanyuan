/**************************
 * 员工风采
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/

var tpl = require("../html/dynamic.html");
var Paging = require("paging");
var Position = require("position");
var pos = [( $(window).width() - 300) / 2 + 80, 50];
var newsType;                              // 资讯类型
var pageSize = 8;

var Dynamic = avalon.define("Dynamic", function (vm) {
    vm.list = [];
    vm.totalItems = 0;
    vm.currentPage = 1;
    vm.edit = function (el) {
        avalon.router.navigate("/dynamic_edit" + "/" + ((el && el.rid) || 0));
    }
    vm.del = function (rid) {
        Dialog.ConfirmBox.confirm("确定删除当前内容吗?", "提示", function () {
            API.delNews(rid, function (result) {
                vm.totalItems = 0;
                vm.currentPage = 1;
                queryNewsByType({type: newsType, currentPage: vm.currentPage, pageSize: pageSize});
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
function queryNewsByType(param) {
    API.newsByType(param, function (result) {
        Dynamic.list = result.data.list || [];
        Dynamic.totalItems = Dynamic.list.size() ? result.data.totalItems : 0;
    });
}

function renderPager(currentPage, totalItems, pageSize) {
    var html = Paging.render({
        // 当前页
        currentPage: currentPage,
        // 总页数
        pageCount: parseInt((totalItems + pageSize - 1) / pageSize),
        // 链接前缀
        link: '#!/dynamic/'
    })
    document.getElementById('paging').innerHTML = html
}

module.exports = {
    model: Dynamic,
    tpl: tpl,
    render: function (param) {
        Dynamic.totalItems = 0;
        newsType = param.type || 1;
        Dynamic.currentPage = param.currentPage || 1;
        queryNewsByType({type: newsType, currentPage: Dynamic.currentPage, pageSize: pageSize});
    }
}



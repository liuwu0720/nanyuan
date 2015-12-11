/**************************
 * 员工风采
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/

var tpl = require("../html/announce.tpl");
var Paging = require("paging");
var Position = require("position");
var pos = [( $(window).width() - 300) / 2 + 80, 50];
var newsType = 3;                              // 资讯类型
var pageSize = 8;

var Announce = avalon.define("Announce", function (vm) {
    vm.list = [];
    vm.totalItems = 0;
    vm.currentPage = 1;
    vm.edit = function (el) {
        avalon.router.navigate("/announce_edit" + "/" + ((el && el.rid) || 0));
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
        Announce.list = result.data.list || [];
        Announce.totalItems = Announce.list.size() ? result.data.totalItems : 0;
    });
}

function renderPager(currentPage, totalItems, pageSize) {
    var html = Paging.render({
        // 当前页
        currentPage: currentPage,
        // 总页数
        pageCount: parseInt((totalItems + pageSize - 1) / pageSize),
        // 链接前缀
        link: '#!/announce/'
    })
    document.getElementById('paging').innerHTML = html
}

module.exports = {
    model: Announce,
    tpl: tpl,
    render: function (param) {
        Announce.totalItems = 0;
        Announce.currentPage = param.currentPage || 1;
        queryNewsByType({type: newsType, currentPage: Announce.currentPage, pageSize: pageSize});
    }
}



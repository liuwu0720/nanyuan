/**************************
 * 意见与建议
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/

var tpl = require("../html/suggest.tpl");
var Paging = require("paging");
var Position = require("position");
var pos = [( $(window).width() - 300) / 2 + 80, 50];
var pageSize = 8;

var Suggest = avalon.define("Suggest", function (vm) {
    vm.list = [];
    vm.totalItems = 0;
    vm.currentPage = 1;
    vm.del = function (rid) {
        Dialog.ConfirmBox.confirm("确定删除当前内容吗?", "提示", function () {
            API.delSuggest(rid, function (result) {
                vm.totalItems = 0;
                vm.currentPage = 1;
                querySuggest({currentPage: vm.currentPage, pageSize: pageSize});
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
function querySuggest(param) {
    API.querySuggest(param, function (result) {
        Suggest.list = result.data.list || [];
        Suggest.totalItems = Suggest.list.size() ? result.data.totalItems : 0;
    });
}
function renderPager(currentPage, totalItems, pageSize) {
    var html = Paging.render({
        // 当前页
        currentPage: currentPage,
        // 总页数
        pageCount: parseInt((totalItems + pageSize - 1) / pageSize),
        // 链接前缀
        link: '#!/suggest/'
    })
    document.getElementById('paging').innerHTML = html
}

module.exports = {
    model: Suggest,
    tpl: tpl,
    render: function (param) {
        Suggest.totalItems = 0;
        Suggest.currentPage = param.currentPage || 1;
        querySuggest({currentPage: Suggest.currentPage, pageSize: pageSize});
    }
}



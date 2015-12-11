/**************************
 * 意见与建议
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/

var tpl = require("../html/calculate.tpl");
var Paging = require("paging");
var Position = require("position");
var pos = [( $(window).width() - 300) / 2 + 80, 50];
var pageSize = 10;

var Calculate = avalon.define("Calculate", function (vm) {
    vm.list = [];
    vm.totalItems = 0;
    vm.currentPage = 1;
    vm.$watch("totalItems", function (val) {
        renderPager(vm.currentPage, val, pageSize);
    });
    vm.$watch("currentPage", function (val) {
        renderPager(val, vm.totalItems, pageSize);
    })
});
function questionCalc(param) {
    API.questionCalc(param, function (result) {
        Calculate.list = result.data.list || [];
        Calculate.totalItems = Calculate.list.size() ? result.data.totalItems : 0;
    });
}
function renderPager(currentPage, totalItems, pageSize) {
    var html = Paging.render({
        // 当前页
        currentPage: currentPage,
        // 总页数
        pageCount: parseInt((totalItems + pageSize - 1) / pageSize),
        // 链接前缀
        link: '#!/calculate/'
    })
    document.getElementById('paging').innerHTML = html;
}

module.exports = {
    model: Calculate,
    tpl: tpl,
    render: function (param) {
        Calculate.totalItems = 0;
        Calculate.currentPage = param.currentPage || 1;
        questionCalc({currentPage: Calculate.currentPage, pageSize: pageSize});
    }
}



/**************************
 *办事机构b
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/

var tpl = require("../html/agency.tpl");
var Paging = require("paging");
var Position = require("position");
var pos = [( $(window).width() - 300) / 2 + 80, 50];
var type = 2;                              // 类型
var pageSize = 8;

var Agency = avalon.define("Agency", function (vm) {
    vm.list = [];
    vm.totalItems = 0;
    vm.currentPage = 1;
    vm.edit = function (el) {
        avalon.router.navigate("/agency_edit" + "/" + ((el && el.rid) || 0));
    }
    vm.del = function (rid) {
        Dialog.ConfirmBox.confirm("确定删除当前内容吗?", "提示", function () {
            API.delAgency(rid, function (result) {
                vm.totalItems = 0;
                vm.currentPage = 1;
                queryAgencyByType({type: type, currentPage: vm.currentPage, pageSize: pageSize});
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
function queryAgencyByType(param) {
    API.agencyByType(param, function (result) {
        Agency.list = result.data.list || [];
        Agency.totalItems = Agency.list.size() ? result.data.totalItems : 0;
    });
}

function renderPager(currentPage, totalItems, pageSize) {
    var html = Paging.render({
        // 当前页
        currentPage: currentPage,
        // 总页数
        pageCount: parseInt((totalItems + pageSize - 1) / pageSize),
        // 链接前缀
        link: '#!/agency/'
    })
    document.getElementById('paging').innerHTML = html
}

module.exports = {
    model: Agency,
    tpl: tpl,
    render: function (param) {
        Agency.totalItems = 0;
        Agency.currentPage = param.currentPage || 1;
        queryAgencyByType({type: type, currentPage: Agency.currentPage, pageSize: pageSize});
    }
}



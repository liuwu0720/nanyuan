/**************************
 *办事机构b
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/

var tpl = require("../html/specific.html");
var Paging = require("paging");
var Position = require("position");
var pos = [( $(window).width() - 300) / 2 + 80, 50];
var pageSize = 2;

var Specific = avalon.define("Specific", function (vm) {
    vm.list = [];
    vm.totalItems = 0;
    vm.currentPage = 1;
    vm.edit = function (el) {
        avalon.router.navigate("/specific_edit" + "/" + ((el && el.rid) || 0));
    }
    vm.toggle = function (el) {
        var status = el.status == "N" ? "C" : "N";
        API.saveSpecific({rid: el.rid, status: el.status}, function () {
            el.status = status;
        })
    }
    vm.del = function (rid) {
        Dialog.ConfirmBox.confirm("确定删除当前内容吗?", "提示", function () {
            API.delSpecific(rid, function (result) {
                vm.totalItems = 0;
                vm.currentPage = 1;
                querySpecific({currentPage: vm.currentPage, pageSize: pageSize});
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
function querySpecific(param) {
    API.specificList(param, function (result) {
        Specific.list = result.data.list || [];
        Specific.totalItems = Specific.list.size() ? result.data.totalItems : 0;
    });
}

function renderPager(currentPage, totalItems, pageSize) {
    var html = Paging.render({
        // 当前页
        currentPage: currentPage,
        // 总页数
        pageCount: parseInt((totalItems + pageSize - 1) / pageSize),
        // 链接前缀
        link: '#!/specific/'
    })
    document.getElementById('paging').innerHTML = html
}

module.exports = {
    model: Specific,
    tpl: tpl,
    render: function (param) {
        Specific.totalItems = 0;
        Specific.currentPage = param.currentPage || 1;
        querySpecific({currentPage: Specific.currentPage, pageSize: pageSize});
    }
}



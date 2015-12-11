/**************************
 * 员工风采
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/

var tpl = require("../html/emergency.tpl");
var Paging = require("paging");
var Position = require("position");
var pos = [( $(window).width() - 300) / 2 + 80, 50];
var newsType;                              // 资讯类型
var pageSize = 8;

var Emergency = avalon.define("Emergency", function (vm) {
    vm.list = [];
    vm.totalItems = 0;
    vm.currentPage = 1;
    vm.edit = function (el) {
        avalon.router.navigate("/emergency_edit" + "/" + ((el && el.rid) || 0));
    }
    vm.del = function (rid) {
        Dialog.ConfirmBox.confirm("确定删除当前内容吗?", "提示", function () {
            API.delEmergency(rid, function (result) {
                vm.totalItems = 0;
                vm.currentPage = 1;
                queryEmergency({type: newsType, currentPage: vm.currentPage, pageSize: pageSize});
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
function queryEmergency(param) {
    API.emergency(param, function (result) {
        Emergency.list = result.data.list || [];
        Emergency.totalItems = Emergency.list.size() ? result.data.totalItems : 0;
    });
}

function renderPager(currentPage, totalItems, pageSize) {
    var html = Paging.render({
        // 当前页
        currentPage: currentPage,
        // 总页数
        pageCount: parseInt((totalItems + pageSize - 1) / pageSize),
        // 链接前缀
        link: '#!/emergency/'
    })
    document.getElementById('paging').innerHTML = html
}

module.exports = {
    model: Emergency,
    tpl: tpl,
    render: function (param) {
        Emergency.totalItems = 0;
        newsType = param.type || 1;
        Emergency.currentPage = param.currentPage || 1;
        queryEmergency({currentPage: Emergency.currentPage, pageSize: pageSize});
    }
}



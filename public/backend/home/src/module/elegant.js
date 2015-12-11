/**************************
 * 员工风采
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/
var tpl = require("../html/elegant.tpl");
var Paging = require("paging");
var pageSize = 6;
var type = 1;
var Elegant = avalon.define("Elegant", function (vm) {
    vm.list = [];
    vm.totalItems = 0;
    vm.currentPage = 1;
    vm.edit = function (el) {
        avalon.router.navigate("/elegant_edit" + "/" + ((el && el.rid) || 0));
    }
    vm.del = function (el) {
        event.stopPropagation();
        Dialog.ConfirmBox.confirm("确定删除<span style='color:red'>" + el.name + "</span>吗?", "提示", function () {
            API.delElegant(el.rid, function (result) {
                vm.totalItems = 0;
                vm.currentPage = 1;
                queryElegant({type: type, currentPage: 1, pageSize: pageSize});
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

function renderPager(currentPage, totalItems, pageSize) {
    var html = Paging.render({
        // 当前页
        currentPage: currentPage,
        // 总页数
        pageCount: parseInt((totalItems + pageSize - 1) / pageSize),
        // 链接前缀
        link: '#!/elegant/'
    })
    document.getElementById('paging').innerHTML = html
}


function queryElegant(param) {
    API.elegantList(param, function (result) {
        Elegant.list = result.data.list || [];
        Elegant.totalItems = result.data.totalItems;
    });
}
module.exports = {
    model: Elegant,
    tpl: tpl,
    render: function (param) {
        Elegant.totalItems = 0;
        Elegant.currentPage = param.currentPage || 1;
        queryElegant({type: type, currentPage: Elegant.currentPage, pageSize: pageSize});
    }
}



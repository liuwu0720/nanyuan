/**************************
 * 政策指向
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/

var tpl = require("../html/opinion.tpl");
var Paging = require("paging");
var Position = require("position");
var pos = [( $(window).width() - 300) / 2 + 80, 50];
var pageSize = 8;

var Opinion = avalon.define("Opinion", function (vm) {
    vm.list = [];
    vm.totalItems = 0;
    vm.currentPage = 1;
    vm.edit = function (el) {
        avalon.router.navigate("/opinion_edit" + "/" + ((el && el.rid) || 0));
    }

    vm.update = function (el) {
        var obj = {rid: el.rid, status: el.status == "N" ? "C" : "N"};
        API.updateOpinion(obj, function (result) {
            if (result.code === 0) {
                el.status = obj.status;
            }
        });
    }
    vm.del = function (rid) {
        Dialog.ConfirmBox.confirm("确定删除当前内容吗?", "提示", function () {
            API.delOpinion(rid, function (result) {
                vm.totalItems = 0;
                vm.currentPage = 1;
                queryOpinion({currentPage: vm.currentPage, pageSize: pageSize});
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
function queryOpinion(param) {
    API.opinion(param, function (result) {
        Opinion.list = result.data.list || [];
        Opinion.totalItems = Opinion.list.size() ? result.data.totalItems : 0;
    });
}

function renderPager(currentPage, totalItems, pageSize) {
    var html = Paging.render({
        // 当前页
        currentPage: currentPage,
        // 总页数
        pageCount: parseInt((totalItems + pageSize - 1) / pageSize),
        // 链接前缀
        link: '#!/opinion/'
    })
    document.getElementById('paging').innerHTML = html
}

module.exports = {
    model: Opinion,
    tpl: tpl,
    render: function (param) {
        Opinion.totalItems = 0;
        Opinion.currentPage = param.currentPage || 1;
        queryOpinion({currentPage: Opinion.currentPage, pageSize: pageSize});
    }
}



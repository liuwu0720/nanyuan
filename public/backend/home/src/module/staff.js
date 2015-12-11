/**************************
 * 人员维护
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/
var tpl = require("../html/staff.tpl");
var Paging = require("paging");
require("ztree")(jQuery);
var pageSize = 10;
var Staff = avalon.define("Staff", function (vm) {
    vm.list = [];
    vm.totalItems = 0;
    vm.currentPage = 1;
    vm.edit = function (el) {
        avalon.router.navigate("/staff_edit" + "/" + ((el && el.rid) || 0));
    }
    vm.del = function(el){
        Dialog.ConfirmBox.confirm("确定删除<span style='color:red'>"+el.username+"</span>吗","删除提醒",function(){
            API.delStaff(el.rid);
            vm.list.remove(el);
        });
    }
    vm.$watch("totalItems", function (val) {
        renderPager(vm.currentPage, val, pageSize);
    });
    vm.$watch("currentPage", function (val) {
        renderPager(val, vm.totalItems, pageSize);
    })
});
function queryDepartment(cb) {
    API.departmentList(function (result) {
        cb(null, result.data);
    });
}

function queryStaff(param) {
    API.staffList(param, function (result) {
        Staff.list = result.data.list || [];
        Staff.totalItems = result.data.totalItems;
    });
}

function renderPager(currentPage, totalItems, pageSize) {
    var html = Paging.render({
        // 当前页
        currentPage: currentPage,
        // 总页数
        pageCount: parseInt((totalItems + pageSize - 1) / pageSize),
        // 链接前缀
        link: '#!/staff/'
    })
    document.getElementById('paging').innerHTML = html
}


function treeHandler(data) {
    var setting = {
        view: {
            dblClickExpand: false
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onClick: function (event, treeId, node) {
                $("#main").attr("data-department",node.id);
                avalon.router.navigate("/staff");
                queryStaff({departmentId:node.id,currentPage: 1, pageSize: 10});
            }
        }
    };
    $.fn.zTree.init($("#staff-departmentTree"), setting, data);
}
module.exports = {
    model: Staff,
    tpl: tpl,
    render: function (param) {
        var departmentId = $("#main").attr("data-department");
        async.waterfall([function (cb) {
            Staff.totalItems = 0;
            Staff.currentPage = param.currentPage || 1;
            queryStaff({departmentId:departmentId || "0",currentPage:  Staff.currentPage, pageSize: pageSize});
            queryDepartment(cb);
        }], function (err, result) {
            var data = _.map(result, function (d) {
                return {id: d.rid, pId: d.parentId, name: d.department, open: (!d.parentId)};
            })
            treeHandler(data);
            var tree = $.fn.zTree.getZTreeObj("staff-departmentTree");
            var node = tree.getNodeByParam("id",departmentId);
            node && tree.selectNode(node);
        });
    }
}



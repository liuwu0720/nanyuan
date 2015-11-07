/**************************
 *办事机构b
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/

var tpl = require("../../../html/department.html");
var Position = require("position");
var pos = [( $(window).width() - 420) / 2, ( $(window).height() - 400) / 2];
require("ztree")(jQuery);

var dialog = new Dialog({
    width: 420,
    align: {
        selfXY: [0, 0],                     // element 的定位点，默认为左上角
        baseElement: Position.VIEWPORT,     // 基准定位元素，默认为当前可视区域
        baseXY: pos                         // 基准定位元素的定位点，默认为左上角
    }
});

var Department = avalon.define("Department", function (vm) {
    vm.$selected = null;
    vm.$action = 'add';
    vm.editNode = function (action) {
        var zTree = $.fn.zTree.getZTreeObj("departmentTree");
        var nodes = zTree.getSelectedNodes();
        vm.$selected = (nodes.length && nodes[0]) || null;
        vm.$action = action;
        if (action == "edit" && !vm.$selected) {
            return alert("选择部门");
        }
        var parentName, departmentName = "";
        if (action == "edit") {
            var parentNode = vm.$selected.getParentNode();
            parentName = parentNode ? parentNode.name : null;
            departmentName = vm.$selected.name;
        } else if (action == "add") {
            parentName = vm.$selected ? vm.$selected.name : null;
            departmentName = "";
        }
        tpl = "<div id='reply-pannel' style='padding: 20px 50px;'><p style='font-weight: bold;font-size: 16px;' id='title'></p><hr><p id='tip' class='warn' style='margin-top:10px;text-align:center;visibility: hidden;'><i class='iconfont'>&#xe619;</i>&nbsp;<span class='tip-err'></span></p>" +
            "<table style='margin:0px auto;text-align: left;width:100%;'>" +
            "<tr style='padding:10px 0px;height: 40px'>" +
            "<th style='width:100px'>上&nbsp;级&nbsp;部&nbsp;门:</th>" +
            "<td>" + (parentName || "根节点") + "</td>" +
            "</tr>" +
            "<tr  style='padding:10px 0px;height: 40px'>" +
            "<th>部&nbsp;门&nbsp;名&nbsp;称:</th>" +
            "<td><input id='departmentName' class='ui-input'></td>" +
            "</tr>" +
            "<tr  style='padding:10px 0px;height: 40px'>" +
            "<th>星&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级:</th>" +
            "<td>" +
            "<div class='star-box'> " +
            "<i class='iconfont' data-index='1'>&#xe63c;</i><i class='iconfont star' data-index='2' >&#xe63b;</i><i class='iconfont' data-index='3'>&#xe63c;</i><i class='iconfont' data-index='4'>&#xe63c;</i><i class='iconfont' data-index='5'>&#xe63c;</i>" +
            "</div>" +
            "</td>" +
            "</tr>" +
            "<tr  style='padding:10px 0px;height: 40px'>" +
            "<th>领&nbsp;导&nbsp;加&nbsp;星:</th>" +
            "<td>" +
            "<div><i class='iconfont star-plus star-active' style='color:red' >&#xe63c;</i></div></td>" +
            "</tr>" +
            "<tr  style='padding:10px 0px;height: 40px'>" +
            "<th>排&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;序:</th>" +
            "<td><input id='departmentOrder' class='ui-input' value='1'></td>" +
            "</tr>" +
            "</table>" +
            "<div style='text-align:center;padding:20px;'>" +
            "<a class='ui-button ui-button-mblue' style='margin-right: 10px;;' onclick='saveDepartment()'>确&nbsp;&nbsp;&nbsp;定</a><a class='ui-button ui-button-mwhite' data-role='close'>取&nbsp;&nbsp;&nbsp;消</a> </div>" +
            "</div>";
        dialog.set("content", tpl).show();
        $("#tip").css("visibility", "hidden");
        $("#departmentName").val(departmentName);
        $("#title").html(action == "add" ? "添加部门" : "编辑部门");
        var starLevel = (vm.$selected && vm.$selected.starLevel) || 0;
        var managerLevel = (vm.$selected && vm.$selected.managerLevel) || 0;
        $("#departmentOrder").val((vm.$selected && vm.$selected.departmentOrder)) || 1;
        initStar(starLevel, managerLevel);
    }
    vm.delNode = function () {
        var zTree = $.fn.zTree.getZTreeObj("departmentTree");
        var selectedNodes = zTree.getSelectedNodes();
        if (!selectedNodes || !selectedNodes.length) {
            return alert("选择要删除的部门");
        }
        var node = selectedNodes[0];
        Dialog.ConfirmBox.confirm("确定删除" + node.name + "以及其以下部门?", "删除提醒", function () {
            API.delDepartment(node.id, function (result) {
                zTree.removeNode(node);
                vm.$selected = null;
            });
        });
    }
});

function initStar(level, managerLevel) {
    for (var i = 1; i <= 5; i++) {
        if (i <= level) {
            $(".star-box i[data-index=" + i + "]").html("&#xe63b;").addClass("star-box-active");
        } else {
            $(".star-box i[data-index=" + i + "]").html("&#xe63c;").removeClass("star-box-active");
        }
    }
    if (managerLevel == 1) {
        $(".star-plus").html("&#xe63b;");
        $(".star-plus").addClass("star-active");
    } else {
        $(".star-plus").html("&#xe63c;");
        $(".star-plus").removeClass("star-active");
    }
}

function queryDepartment(cb) {
    API.departmentList(function (result) {
        cb(null, result.data);
    });
}
function treeHandler(data) {
    var setting = {
        view: {
            dblClickExpand: false
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pId",
                rootPId: 0,
                starLevel: "starLevel",
                managerLevel: "managerLevel",
                departmentOrder:"departmentOrder"
            }
        },
        callback: {
            beforeClick: function (treeId, node) {
                var zTree = $.fn.zTree.getZTreeObj(treeId);
                if ($(".curSelectedNode").length) {
                    if ($(".curSelectedNode").parent().attr("id") == node.tId) {            // 自身
                        zTree.cancelSelectedNode(node);
                        return false
                    } else {                                                             // 其它
                        zTree.cancelSelectedNode();
                    }
                }
            }
        }
    };
    $.fn.zTree.init($("#departmentTree"), setting, data);
}

function saveDepartment() {
    var departmentName = $.trim($("#departmentName").val());
    var starLevel = $(".star-box-active").length;
    var managerLevel = $(".star-active").length;
    var departmentOrder = $("#departmentOrder").val();
    var tip = "";
    if (!departmentName) {
        tip = "填写部门名称";
    } else if (departmentName.length > 12) {
        tip = "部门名称长度不超过12字";
    }
    if (tip) {
        $("#tip .tip-err").html(tip);
        return $("#tip").css("visibility", "visible");
    }
    var zTree = $.fn.zTree.getZTreeObj("departmentTree");
    var obj = {department: departmentName};
    if (Department.$action == "add") {
        obj.parentId = (Department.$selected && Department.$selected.id) || 0;                                   // 父节点
    } else if (Department.$action == "edit") {
        Department.$selected.name = departmentName;
        Department.$selected.starLevel = starLevel;
        Department.$selected.managerLevel = managerLevel;
        Department.$selected.departmentOrder = departmentOrder;
        obj.parentId  = (Department.$selected && Department.$selected.parentId) || 0;
        obj.rid = Department.$selected.id;
    }
    obj.starLevel = starLevel;
    obj.managerLevel = managerLevel;
    obj.departmentOrder = departmentOrder;
    API.saveDepartment(obj, function (result) {
        if (Department.$action == "add") {
            zTree.addNodes(Department.$selected, {
                id: result.rid,
                pid: obj.parentId,
                name: departmentName,
                starLevel: starLevel,
                managerLevel: managerLevel,
                departmentOrder: departmentOrder,
                parentId:"parentId"
            });
        } else if (Department.$action == "edit") {
            zTree.updateNode(Department.$selected);
        }
    });
    dialog.hide();
}
function handleHoverStar() {
    $("body").on("mouseover", ".star-box i", function () {
        var index = parseInt($(this).attr("data-index"));
        for (var i = 1; i <= 5; i++) {
            if (i <= index) {
                $(".star-box i[data-index=" + i + "]").html("&#xe63b;").addClass("star-box-active");
            } else {
                $(".star-box i[data-index=" + i + "]").html("&#xe63c;").removeClass("star-box-active");
            }
        }
    });

    $("body").on("click", ".star-plus", function () {
        if ($(this).hasClass("star-active")) {
            $(this).html("&#xe63c;");
            $(this).removeClass("star-active");
        } else {
            $(this).html("&#xe63b;");
            $(this).addClass("star-active");
        }
    });
}

function validateInput() {
    $("body").on("keyup", "#departmentOrder", function () {
        var val = $(this).val();
        var reg = /^[1-9][0-9]*$/;
        if (!reg.test(val)) {
            return $(this).val(1);
        }
        if (val > 10000) {
            return $(this).val(10000);
        }
    });
}

module.exports = {
    model: Department,
    tpl: tpl,
    render: function (param) {
        async.waterfall([function (cb) {
            queryDepartment(cb);
        }], function (err, result) {
            var data = _.map(result, function (d) {
                return {
                    id: d.rid,
                    pId: d.parentId,
                    name: d.department,
                    open: (!d.parentId),
                    starLevel: (d.starLevel || 0),
                    managerLevel: (d.managerLevel || 0),
                    departmentOrder:(d.departmentOrder || 1) ,
                    parentId:(d.parentId || 0)
                };
            })
            treeHandler(data);
            handleHoverStar();
            validateInput();
            window.saveDepartment = saveDepartment;
        });
    }
}



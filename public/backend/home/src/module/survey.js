/**************************
 * 人员维护
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/
var tpl = require("../html/survey.tpl");
var Paging = require("paging");
var Position = require("position");
var pos = [( $(window).width() - 420) / 2, ( $(window).height() - 400) / 2];
var dialog, pageSize = 10;
var Survey = avalon.define("Survey", function (vm) {
    vm.list = [];
    vm.surveyGroup = [];
    vm.group = {};
    vm.totalItems = 0;
    vm.currentPage = 1;
    vm.edit = function (el) {
        if (!el && !vm.group.rid) {
            return Dialog.ConfirmBox.alert("选择问卷后,添加问题", function () {
            });
        } else {
            if (el) {
                avalon.router.navigate("/survey_edit" + "/" + ((el && el.rid) || 0));
            } else {
                avalon.router.navigate("/survey_edit" + "/" + ((el && el.rid) || 0) + "/" + vm.group.rid);
            }
        }
    }
    vm.del = function (el) {
        var title = (el.title && el.title.length > 10) ? el.title.substring(0, 10) + "..." : el.title;
        Dialog.ConfirmBox.confirm("确定删除题目<span style='color:red'>" + title + "</span>吗", "删除提醒", function () {
            API.delQuestion(el.rid);
            vm.list.remove(el);
        });
    }

    vm.addGroup = function () {
        tpl = "<div id='reply-pannel' style='padding: 20px 50px;'><p style='font-weight: bold;font-size: 14px;' id='title'>添加试卷</p><hr><p id='tip' class='warn' style='margin-top:10px;text-align:center;visibility: hidden;'><i class='iconfont'>&#xe609;</i>&nbsp;<span class='tip-err'></span></p>" +
            "<table style='margin:0px auto;text-align: left;width:100%;'>" +
            "<tr  style='padding:10px 0px;height: 40px'>" +
            "<th>试&nbsp;卷&nbsp;标&nbsp;题:</th>" +
            "<td><input id='group-title' type='text' class='ui-input'></td>" +
            "</tr>" +
            "<tr  style='padding:10px 0px;height: 40px'>" +
            "<th>状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态:</th>" +
            "<td><input type='radio' class='ui-input' name='group-status' value='1' checked>&nbsp;展示&nbsp;<input type='radio' class='ui-input' name='group-status' value='0'>&nbsp;隐藏</td>" +
            "</tr>" +
            "</table>" +
            "<div style='text-align:center;padding:20px;'>" +
            "<a class='ui-button ui-button-mblue' style='margin-right: 10px;;' onclick='saveGroup()'>确&nbsp;&nbsp;&nbsp;定</a><a class='ui-button ui-button-mwhite' data-role='close'>取&nbsp;&nbsp;&nbsp;消</a> </div>" +
            "</div>";
        dialog.set("content", tpl).show();
        $("#group-title").val("");
        $("input[value='1']").prop("checked", true);
        $("#tip").css("visibility", "hidden");
    }
    vm.queryByGroup = function (el) {
        vm.group = el;
        $(".container").attr("data-groupId",el.rid);
        queryQuestion({groupId: el.rid, currentPage: Survey.currentPage, pageSize: pageSize});
    };
    vm.delGroup = function () {
        if (vm.group.rid) {
            Dialog.ConfirmBox.confirm("确定删除<span style='color:red'>" + vm.group.title + "</span>吗", "删除提醒", function () {
                API.delQuestionGroup(vm.group.rid);
                vm.surveyGroup.remove(vm.group);
                vm.group = {};
                queryQuestion({currentPage: 1, pageSize: pageSize});
            });
        }
    };
    vm.editGroup = function () {
        if (vm.group && vm.group.rid) {
            tpl = "<div id='reply-pannel' style='padding: 20px 50px;'><p style='font-weight: bold;font-size: 14px;' id='title'>添加试卷</p><hr><p id='tip' class='warn' style='margin-top:10px;text-align:center;visibility: hidden;'><i class='iconfont'>&#xe609;</i>&nbsp;<span class='tip-err'></span></p>" +
                "<table style='margin:0px auto;text-align: left;width:100%;'>" +
                "<tr  style='padding:10px 0px;height: 40px'>" +
                "<th>试&nbsp;卷&nbsp;标&nbsp;题:</th>" +
                "<td><input id='group-title' type='text' class='ui-input' value='" + vm.group.title + "'></td>" +
                "</tr>" +
                "<tr  style='padding:10px 0px;height: 40px'>" +
                "<th>状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态:</th>" +
                "<td><input type='radio' class='ui-input' name='group-status' value='1'>&nbsp;展示&nbsp;<input type='radio' class='ui-input' name='group-status' value='0'>&nbsp;隐藏</td>" +
                "</tr>" +
                "</table>" +
                "<div style='text-align:center;padding:20px;'>" +
                "<a class='ui-button ui-button-mblue' style='margin-right: 10px;;' onclick='saveGroup()'>确&nbsp;&nbsp;&nbsp;定</a><a class='ui-button ui-button-mwhite' data-role='close'>取&nbsp;&nbsp;&nbsp;消</a> </div>" +
                "</div>";
            dialog.set("content", tpl).show();
            if (vm.group.state == 1) {
                $("input[value='1']").prop("checked", true);
            } else {
                $("input[value='0']").prop("checked", true);
            }
            $("#tip").css("visibility", "hidden");
        }

    }
    vm.$watch("totalItems", function (val) {
        renderPager(vm.currentPage, val, pageSize);
    });
    vm.$watch("currentPage", function (val) {
        renderPager(val, vm.totalItems, pageSize);
    })
});

function surveyGroup(cb) {
    API.surveyGroup(function (result) {
        cb(result.data);
    });
}
function queryQuestion(param) {
    API.questionList(param, function (result) {
        Survey.list = result.data.list || [];
        Survey.totalItems = result.data.totalItems;
    });
}

function saveGroup() {
    var title = $.trim($("#group-title").val());
    var status = $("input[name='group-status']:checked").val();
    if (!title) {
        $("#tip .tip-err").html("填写问卷标题");
        $("#tip").css("visibility", "visible");
        return;
    }
    if (title.length > 12) {
        $("#tip .tip-err").html("问卷标题不超过12字");
        $("#tip").css("visibility", "visible");
        return;
    }
    var obj;
    if (Survey.group && Survey.group.rid) {
        obj = {rid: Survey.group.rid, title: title, state: status};
    } else {
        obj = {title: title, state: status};
    }
    API.addGroup(obj, function (result) {
        obj.rid = result.rid;
        if (Survey.group && Survey.group.rid) {
            Survey.group.title = obj.title;
            Survey.group.state = obj.state;
        } else {
            Survey.surveyGroup.unshift(obj);
        }
        Survey.group = {};
        dialog.hide();
    });
}
function renderPager(currentPage, totalItems, pageSize) {
    var html = Paging.render({
        // 当前页
        currentPage: currentPage,
        // 总页数
        pageCount: parseInt((totalItems + pageSize - 1) / pageSize),
        // 链接前缀
        link: '#!/survey/'
    })
    document.getElementById('paging').innerHTML = html;
}
module.exports = {
    model: Survey,
    tpl: tpl,
    render: function (param) {
        Survey.totalItems = 0;
        Survey.currentPage = param.currentPage || 1;
        var groupId = $(".container").attr("data-groupId") || "";
        queryQuestion({groupId:groupId,currentPage: Survey.currentPage, pageSize: pageSize});
        surveyGroup(function (result) {
            Survey.surveyGroup = result;
        });
        dialog = new Dialog({
            width: 420,
            align: {
                selfXY: [0, 0],                     // element 的定位点，默认为左上角
                baseElement: Position.VIEWPORT,     // 基准定位元素，默认为当前可视区域
                baseXY: pos                         // 基准定位元素的定位点，默认为左上角
            }
        });
        window.saveGroup = saveGroup;
    }
}



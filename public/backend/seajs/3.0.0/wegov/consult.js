/**************************
 * 咨询回复
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/

var tpl = require("../../../html/consult.html");
var Paging = require("paging");
var Position = require("position");
var pos = [( $(window).width() - 680) / 2, ( $(window).height() - 400) / 2];
var Select = require('arale-select');
var type = 1;
var pageSize = 5;

var dialog = new Dialog({
    width: 680,
    align: {
        selfXY: [0, 0],                     // element 的定位点，默认为左上角
        baseElement: Position.VIEWPORT,     // 基准定位元素，默认为当前可视区域
        baseXY: pos                         // 基准定位元素的定位点，默认为左上角
    }
});

var Consult = avalon.define("Consult", function (vm) {
    vm.list = [];
    vm.totalItems = 0;
    vm.currentPage = 1;
    vm.status = "0";
    vm.$el = null;
    vm.reply = function (el) {
        vm.$el = el;
        tpl = "<div id='reply-pannel' style='padding: 20px 50px;'><p style='font-weight: bold;font-size: 16px;'>消息回复</p><hr><p id='tip' class='warn' style='margin-top:10px;text-align:center;visibility: hidden;'><i class='iconfont'>&#xe619;</i>&nbsp;未填写回复内容</p>" +
                "<table style='margin:0px auto;text-align: left;width:100%;'>" +
                    "<tr style='padding:10px 0px;height: 80px'>" +
                        "<th style='width:100px'>问&nbsp;&nbsp;&nbsp;题:</th>" +
                        "<td>" + el.questions + "</td>" +
                    "</tr>" +
                    "<tr  style='padding:10px 0px;height: 80px'>" +
                        "<th>回&nbsp;&nbsp;&nbsp;答:</th>" +
                        "<td><textarea id='answerText' style='width: 400px;height:100px;' maxlength='500'></textarea> </td>" +
                    "</tr>" +
                "</table>" +
            "<div style='text-align:center;padding:20px;'>" +
            "<a class='ui-button ui-button-mblue' style='margin-right: 10px;;' onclick='saveReply()'>确&nbsp;&nbsp;&nbsp;定</a><a class='ui-button ui-button-mwhite' data-role='close'>取&nbsp;&nbsp;&nbsp;消</a> </div>" +
            "</div>";
        dialog.set("content", tpl).show();
    }
    vm.del = function (rid) {
        Dialog.ConfirmBox.confirm("确定删除当前内容吗?", "提示", function () {
            API.delConsult(rid, function (result) {
                vm.totalItems = 0;
                vm.currentPage = 1;
                queryConsult({status: vm.status, currentPage: vm.currentPage, pageSize: pageSize});
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
function queryConsult(param) {
    API.queryConsult(param, function (result) {
        Consult.list = result.data.list || [];
        Consult.totalItems = Consult.list.size() ? result.data.totalItems : 0;
    });
}

function renderPager(currentPage, totalItems, pageSize) {
    var html = Paging.render({
        // 当前页
        currentPage: currentPage,
        // 总页数
        pageCount: parseInt((totalItems + pageSize - 1) / pageSize),
        // 链接前缀
        link: '#!/consult/'
    })
    document.getElementById('paging').innerHTML = html
}

function selectHandler() {
    var selected = $("#main").attr("data-value") || '0';
    new Select({
        trigger: '#status-select',
        model: [
            {value: '0', text: '选择状态', selected: (selected == "0")},
            {value: 'A', text: '未回复', selected: (selected == "A")},
            {value: 'C', text: '已回复', selected: (selected == "C")}
        ]
    }).render().on('change', function (target, prev) {
            Consult.totalItems = 0;
            Consult.currentPage = 1;
            var status = target.attr("data-value");
            $("#main").attr("data-value", status);
            avalon.router.navigate("/consult");
        });
}

module.exports = {
    model: Consult,
    tpl: tpl,
    render: function (param) {
        Consult.totalItems = 0;
        Consult.currentPage = param.currentPage || 1;
        selectHandler();
        var status = $("#main").attr("data-value") || 0;
        queryConsult({status: status, currentPage: Consult.currentPage, pageSize: pageSize});
        window.saveReply = function(){
            var rid = Consult.$el.rid;
            var answer = $.trim($("#answerText").val());
            if(!answer) return $("#tip").css("visibility","visible").delay(3000).css("visibility","hidden");
            var status = "C";
            API.saveConsult(rid,answer,status,function(result){
                Consult.$el.answer = answer;
                Consult.$el.status = status;
                Consult.$el.answerDate = new Date();
                dialog&&dialog.hide();
            });
        }
    }
}




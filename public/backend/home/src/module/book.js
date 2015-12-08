/**************************
 * 政策指向
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/

var tpl = require("../html/book.html");
var Paging = require("paging");
var Position = require("position");
var pos = [( $(window).width() - 680) / 2, ( $(window).height() - 400) / 2];
var type = 3;
var pageSize = 8;
var dialog;

var Book = avalon.define("Book", function (vm) {
    vm.list = [];
    vm.$el = null;
    vm.totalItems = 0;
    vm.currentPage = 1;
    vm.update = function (el) {
        vm.$el = el;
        if (el.status == "booking") {
            el.resultInfo = "您的预约已经受理,请按预约时间到指定地点办理业务.";
        } else if (el.status == "booked") {
            el.resultInfo = "业务办理完成.";
        }
        tpl = "<div id='reply-pannel' style='padding: 20px 50px;'><p style='font-weight: bold;font-size: 16px;'><p>预约回复</p><hr><p id='tip' class='warn' style='margin-top:10px;text-align:center;visibility: hidden;'><i class='iconfont'>&#xe619;</i>&nbsp;未填写回复内容</p>" +
            "<table style='margin:0px auto;text-align: left;width:100%;'>" +
            "<tr  style='padding:10px 0px;height: 80px'>" +
            "<th>回复内容:</th>" +
            "<td><textarea id='answerText' style='width: 400px;height:100px;' maxlength='500'>" + (el.resultInfo || "") + "</textarea> </td>" +
            "</tr>" +
            "</table>" +
            "<div style='text-align:center;padding:20px;'>" +
            "<a class='ui-button ui-button-mblue' style='margin-right: 10px;;' onclick='updateBook()'>确&nbsp;&nbsp;&nbsp;定</a><a class='ui-button ui-button-mwhite' data-role='close'>取&nbsp;&nbsp;&nbsp;消</a> </div>" +
            "</div>";
        dialog.set("content", tpl).show();

    }
    vm.del = function (rid) {
        Dialog.ConfirmBox.confirm("确定删除当前内容吗?", "提示", function () {
            API.delBooking(rid, function (result) {
                vm.totalItems = 0;
                vm.currentPage = 1;
                queryBook({currentPage: vm.currentPage, pageSize: pageSize});
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
function queryBook(param) {
    API.book(param, function (result) {
        Book.list = result.data.list || [];
        Book.totalItems = Book.list.size() ? result.data.totalItems : 0;
    });
}

function renderPager(currentPage, totalItems, pageSize) {
    var html = Paging.render({
        // 当前页
        currentPage: currentPage,
        // 总页数
        pageCount: parseInt((totalItems + pageSize - 1) / pageSize),
        // 链接前缀
        link: '#!/book/'
    })
    document.getElementById('paging').innerHTML = html;
}

function updateBook() {
    var answer = $.trim($("#answerText").val());
    if (!answer) return $("#tip").css("visibility", "visible").delay(3000).css("visibility", "hidden");
    var status = "";
    if (Book.$el.status == "booking") {
        status = "booked";
    } else if (Book.$el.status == "booked") {
        status = "handled";
    }
    var obj = {rid: Book.$el.rid, status: status,resultInfo:answer};
    API.updateBooking(obj, function () {
        Book.$el.status = obj.status;
        dialog && dialog.hide();
    });
}

module.exports = {
    model: Book,
    tpl: tpl,
    render: function (param) {
        Book.totalItems = 0;
        Book.currentPage = param.currentPage || 1;
        queryBook({currentPage: Book.currentPage, pageSize: pageSize});
        window.updateBook = updateBook;
        dialog = new Dialog({
            width: 680,
            align: {
                selfXY: [0, 0],                     // element 的定位点，默认为左上角
                baseElement: Position.VIEWPORT,     // 基准定位元素，默认为当前可视区域
                baseXY: pos                         // 基准定位元素的定位点，默认为左上角
            }
        });

    }
}



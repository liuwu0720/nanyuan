/**
 * User: Becky
 * Date: 15-8-22
 * Time: 下午8:22
 */
var $ = window.$ = window.jQuery = require("jquery");
var _ = window._ = require("underscore");
var async = window.async = require("async");
var API = window.API = require("./comm/api");
var history = require("mmHistory");
var avalon = require("mmRouter");
var Dialog = window.Dialog = require("arale-dialog");
var Switchable = require("arale-switchable");
require("validator")($);

function _moduleHandler(model, params) {
    $("form[action='/backend/upload/image']").remove();                      // 清除上传组件的残留
    $("#main").html(model.tpl);
    $("body").scrollTop(0);
    model.model && $("#main").attr("ms-controller", model.model.$id).attr("avalonctrl", model.model.$id) && avalon.scan(document.getElementById("#main"), model.model);
    if (typeof model.render === 'function') {
        model.render(params);
    }
}

// ==================  首 页   START==================== //
avalon.router.get("/index", function () {
    var model = require("./module/index");
    _moduleHandler(model, this.params);
});

// ================== 通知公告 START==================== //
avalon.router.get("/announce", function () {
    var model = require("./module/announce");
    _moduleHandler(model, this.params);
});
avalon.router.get("/announce_edit/{rid:[0-9][0-9]*}", function () {
    var model = require("./module/announce_edit");// 编辑
    _moduleHandler(model, this.params);
});

// ================== 南园动态 START==================== //
avalon.router.get("/dynamic", function () {
    var model = require("./module/dynamic");
    _moduleHandler(model, this.params);
});
avalon.router.get("/dynamic_edit/{rid:[0-9][0-9]*}", function () {
    var model = require("./module/dynamic_edit");// 编辑
    _moduleHandler(model, this.params);
});
avalon.router.get("/dynamic" + "/{currentPage:[1-9][0-9]*}", function () {
    var model = require("./module/dynamic");
    _moduleHandler(model, this.params);
});

// ================== 民生实事 START==================== //
avalon.router.get("/fact", function () {
    var model = require("./module/fact");
    _moduleHandler(model, this.params);
});
avalon.router.get("/fact_edit/{rid:[0-9][0-9]*}", function () {
    var model = require("./module/fact_edit");
    _moduleHandler(model, this.params);
});
avalon.router.get("/fact" + "/{currentPage:[1-9][0-9]*}", function () {
    var model = require("./module/fact");
    _moduleHandler(model, this.params);
});

// ================== 民生实事 START==================== //
avalon.router.get("/opinion", function () {
    var model = require("./module/opinion");
    _moduleHandler(model, this.params);
});
avalon.router.get("/opinion_edit/{rid:[0-9][0-9]*}", function () {
    var model = require("./module/opinion_edit");
    _moduleHandler(model, this.params);
});
avalon.router.get("/opinion" + "/{currentPage:[1-9][0-9]*}", function () {
    var model = require("./module/opinion");
    _moduleHandler(model, this.params);
});

// ================== 办事机构 START==================== //
avalon.router.get("/agency", function () {
    var model = require("./module/agency");
    _moduleHandler(model, this.params);
});
avalon.router.get("/agency_edit/{rid:[0-9][0-9]*}", function () {
    var model = require("./module/agency_edit");
    _moduleHandler(model, this.params);
});
avalon.router.get("/agency" + "/{currentPage:[1-9][0-9]*}", function () {
    var model = require("./module/agency");
    _moduleHandler(model, this.params);
});

// ================== 联系人 START==================== //
avalon.router.get("/contact", function () {
    var model = require("./module/contact");
    _moduleHandler(model, this.params);
});
avalon.router.get("/contact_edit/{rid:[0-9][0-9]*}", function () {
    var model = require("./module/contact_edit");
    _moduleHandler(model, this.params);
});
avalon.router.get("/contact" + "/{currentPage:[1-9][0-9]*}", function () {
    var model = require("./module/contact");
    _moduleHandler(model, this.params);
});

// ================== 我要咨询 START==================== //
avalon.router.get("/consult", function () {
    var model = require("./module/consult");
    _moduleHandler(model, this.params);
});
avalon.router.get("/consult_edit/{rid:[0-9][0-9]*}", function () {
    var model = require("./module/consult_edit");
    _moduleHandler(model, this.params);
});
avalon.router.get("/consult" + "/{currentPage:[1-9][0-9]*}", function () {
    var model = require("./module/consult");
    _moduleHandler(model, this.params);
});

// ================== 意见与建议 START==================== //
avalon.router.get("/suggest", function () {
    var model = require("./module/suggest");
    _moduleHandler(model, this.params);
});
avalon.router.get("/suggest" + "/{currentPage:[1-9][0-9]*}", function () {
    var model = require("./module/suggest");
    _moduleHandler(model, this.params);
});

// ================== 政策法规 START==================== //
avalon.router.get("/policy", function () {
    var model = require("./module/policy");
    _moduleHandler(model, this.params);
});
avalon.router.get("/policy_edit/{rid:[0-9][0-9]*}", function () {
    var model = require("./module/policy_edit");
    _moduleHandler(model, this.params);
});
avalon.router.get("/policy" + "/{currentPage:[1-9][0-9]*}", function () {
    var model = require("./module/policy");
    _moduleHandler(model, this.params);
});

// ================== 办事流程 START==================== //
avalon.router.get("/flow", function () {
    var model = require("./module/flow");
    _moduleHandler(model, this.params);
});
avalon.router.get("/flow_edit/{rid:[0-9][0-9]*}", function () {
    var model = require("./module/flow_edit");
    _moduleHandler(model, this.params);
});
avalon.router.get("/flow" + "/{currentPage:[1-9][0-9]*}", function () {
    var model = require("./module/flow");
    _moduleHandler(model, this.params);
});

// ================== 预约办事 START==================== //
avalon.router.get("/book", function () {
     var model = require("./module/book");
    _moduleHandler(model, this.params);
});
avalon.router.get("/book" + "/{currentPage:[1-9][0-9]*}", function () {
    var model = require("./module/book");
    _moduleHandler(model, this.params);
});

// ================== 管理员 START==================== //
avalon.router.get("/administrator", function () {
    var model = require("./module/administrator");
    _moduleHandler(model, this.params);
});
avalon.router.get("/administrator_edit/{rid:[0-9][0-9]*}", function () {
    var model = require("./module/administrator_edit");
    _moduleHandler(model, this.params);
});
avalon.router.get("/administrator" + "/{currentPage:[1-9][0-9]*}", function () {
    var model = require("./module/administrator");
    _moduleHandler(model, this.params);
});

// ================== 随手拍 START==================== //
avalon.router.get("/emergency", function () {
    var model = require("./module/emergency");
    _moduleHandler(model, this.params);
});
avalon.router.get("/emergency_edit/{rid:[0-9][0-9]*}", function () {
    var model = require("./module/emergency_edit");
    _moduleHandler(model, this.params);
});
avalon.router.get("/emergency" + "/{currentPage:[1-9][0-9]*}", function () {
    var model = require("./module/emergency");
    _moduleHandler(model, this.params);
});

// ================== 问卷调查 START==================== //
avalon.router.get("/survey", function () {
    var model = require("./module/survey");
    _moduleHandler(model, this.params);
});
avalon.router.get("/survey_edit/{rid:[0-9][0-9]*}", function () {
    var model = require("./module/survey_edit");
    _moduleHandler(model, this.params);
});
avalon.router.get("/survey_edit/{rid:[0-9][0-9]*}/{groupId:[0-9][0-9]*}", function () {
    var model = require("./module/survey_edit");
    _moduleHandler(model, this.params);
});
avalon.router.get("/survey" + "/{currentPage:[1-9][0-9]*}", function () {
    var model = require("./module/survey");
    _moduleHandler(model, this.params);
});

// ================== 意见与建议 START==================== //
avalon.router.get("/calculate", function () {
    var model = require("./module/calculate");
    _moduleHandler(model, this.params);
});
avalon.router.get("/calculate" + "/{currentPage:[1-9][0-9]*}", function () {
    var model = require("./module/calculate");
    _moduleHandler(model, this.params);
});

avalon.router.error(function () {
    avalon.router.navigate("/index");
});
avalon.history.start();

var Header = avalon.define("Header", function (vm) {
    vm.user = {};

    vm.logout = function () {
        API.logout(function (result) {
            window.location.href = "login.html";
        });
    };
});
var Menu = avalon.define("Menu", function (vm) {
    vm.menus = [];
    vm.toPage = function (url, is_active) {
        if (is_active == 1) {
            avalon.router.navigate("/" + url);
        }
    }
});
avalon.scan(document.getElementById("header"), Header);
avalon.scan(document.getElementById("menu-box"), Menu);

function _menuHandler() {
    var Accordion = Switchable.Accordion;
    var accordion = new Accordion({
        triggerType: "click",
        element: '#menu',
        multiple: false,
        easing: "easeBoth",
        viewSize: 0,
        activeIndex: -99
    }).render();

    $("#menu .ui-switchable-trigger").on("click", function () {
        if ($(this).children("a").hasClass("disable")) return;
        $("#menu .ui-switchable-trigger").removeClass("ui-switchable-active");
        $("#menu .ui-switchable-panel li a").removeClass("active");
        $(this).addClass("ui-switchable-active");
    });
    $("#menu .ui-switchable-panel li a").on("click", function () {
        if ($(this).parent().hasClass("disable")) return;
        $("#menu .ui-switchable-trigger").removeClass("ui-switchable-active");
        $("#menu .ui-switchable-panel li a").removeClass("active");
        $(this).addClass("active");
    });
}
function _extendValidators() {
    $.validator.addMethod("phone", function (value, element) {
        var tel = /^(1[0-9]{10}|[0-9]{4}-[0-9]{7,8})$/;
        return this.optional(element) || (tel.test(value));
    }, "* 输入正确的手机或座机号码");
    $.validator.addMethod("mobile", function (value, element) {
        var mobile = /^1[0-9]{10}$/;
        return this.optional(element) || (mobile.test(value));
    }, "* 输入正确的手机号码");
    $.validator.addMethod("password", function (value, element) {
        var password = /^[a-zA-Z0-9_]{6,18}$/;
        return this.optional(element) || (password.test(value));
    }, "* 密码为6-18位的字母、数字或下划线");
}
function _extendAvalonFilter() {
    avalon.filters.userType = function (val) {
        switch (val) {
            case "T":
                return "网格员";
            case "W":
                return "工作人员";
            case "P":
                return "警    察";
            case "M":
                return "负责人";
            case "D":
                return "市区领导";
            case "O":
                return "其它工作人员";
            case "L":
                return "其它领导";
        }
    }

    avalon.filters.textFromHtml = function (val) {
        var reg = /<[a-zA-Z]+[^<]*>|<\/[a-zA-Z]+>/g;
        if (!val) return "";
        return val.replace(reg, "");
    }
}
function render() {
    API.userinfo(function (data) {
        var menus = _.filter(data.menus, function (menu) {
            if (menu.parent_id) return false;
            return true;
        });
        for (var i = 0; i < menus.length; i++) {
            var menu = menus[i];
            menu.subs = [];
            for (var j = 0; j < data.menus.length; j++) {
                var sub = data.menus[j];
                if (sub.parent_id == menu.rid) {
                    menu.subs.push(sub);
                }
            }
        }
        Menu.menus = menus;
        Header.user = data.user;
        _menuHandler();
    });
    _extendValidators();
    _extendAvalonFilter();
}
render();

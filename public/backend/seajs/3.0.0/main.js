/**
 * User: Becky
 * Date: 15-8-22
 * Time: 下午8:22
 */
seajs.use(["avalon", "mmHistory", "mmRouter", "jquery", "underscore","async", "api"], function (a, history, avalon, $, _,async, API) {
    window.API = API;
    window.$ = window.jQuery = $;
    window._ = window.underscore = _;
    window.async = async;
    window.Dialog = require('dialog/dialog');
    require('validator')($);

    function _moduleHandler(moduleName, params) {
        $("form[action='/backend/upload/image']").remove();                      // 清除上传组件的残留
        seajs.use("wegov" + "/" + moduleName, function (current_module) {
            $("#main").html(current_module.tpl);
            $("body").scrollTop(0);
            current_module.model && $("#main").attr("ms-controller", current_module.model.$id).attr("avalonctrl", current_module.model.$id) && avalon.scan(document.getElementById("#main"), current_module.model);
            if (typeof current_module.render === 'function') {
                current_module.render(params);
            }
        });
    }
    var simpleModules = [
        "index","staff", "introduction", "information", "lawreg", "policy",
        "business", "guide", "consult", "suggest", "agency",
        "department","elegant","staff","specific","setting","contact","standard","weekly"];                    // 简单模块
    var editModules = [
        "information", "lawreg", "policy", "business", "guide",
        "agency","elegant","staff","elegant","specific","contact","standard","weekly"];                       // 编辑模块
    var pagingModules = [
        "information", "lawreg", "policy", "business", "guide",
        "consult", "suggest", "agency","staff","elegant",
        "specific","contact","standard","weekly"];                                                  // 分页模块
    simpleModules.forEach(function (moduleName) {
        avalon.router.get("/" + moduleName, function () {
            _moduleHandler(moduleName, this.params);
        });
    });
    editModules.forEach(function (moduleName) {
        avalon.router.get("/" + moduleName + "_edit/{rid:[0-9][0-9]*}", function () {           // 编辑
            _moduleHandler(moduleName + "_edit", this.params);
        });
    });
    pagingModules.forEach(function (moduleName) {
        avalon.router.get("/" + moduleName + "/{currentPage:[1-9][0-9]*}", function () {        // 分页
            _moduleHandler(moduleName, this.params);
        });
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
    });
    avalon.scan(document.getElementById("header"), Header);
    avalon.scan(document.getElementById("menu-box"), Menu);

    function _menuHandler() {
        var Accordion = require("switchable/switchable").Accordion;
        var accordion = new Accordion({
            triggerType: "click",
            element: '#menu',
            multiple: false,
            easing: "easeBoth",
            viewSize: 0,
            activeIndex: -99
        }).render();

        $("#menu .ui-switchable-trigger").on("click", function () {
            $("#menu .ui-switchable-trigger").removeClass("ui-switchable-active");
            $("#menu .ui-switchable-panel li a").removeClass("active");
            $(this).addClass("ui-switchable-active");
        });
        $("#menu .ui-switchable-panel li a").on("click", function () {
            $("#menu .ui-switchable-trigger").removeClass("ui-switchable-active");
            $("#menu .ui-switchable-panel li a").removeClass("active");
            $(this).addClass("active");
            // $(this).parent().parent().parent().prev().addClass("ui-switchable-active");
        });
    }
    function _extendValidators(){
        jQuery.validator.addMethod("phone", function(value, element) {
            var tel =/^(1[0-9]{10}|[0-9]{4}-[0-9]{7,8})$/;
            return this.optional(element) || (tel.test(value));
        }, "* 输入正确的手机或座机号码");
        jQuery.validator.addMethod("mobile", function(value, element) {
            var mobile =/^1[0-9]{10}$/;
            return this.optional(element) || (mobile.test(value));
        }, "* 输入正确的手机号码");
        jQuery.validator.addMethod("password", function(value, element) {
            var password =/^[a-zA-Z0-9_]{6,18}$/;
            return this.optional(element) || (password.test(value));
        }, "* 密码为6-18位的字母、数字或下划线");
    }
    function _extendAvalonFilter(){
        avalon.filters.userType = function(val){
              switch (val){
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

        avalon.filters.textFromHtml = function(val){
            var reg =/<[a-zA-Z]+[^<]*>|<\/[a-zA-Z]+>/g;
            if(!val) return "";
            return val.replace(reg,"");
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
});
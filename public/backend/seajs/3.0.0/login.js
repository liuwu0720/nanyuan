/**
 * User: Becky
 * Date: 15-9-27
 * Time: 下午3:15
 */
seajs.use(["jquery", "api"], function ($, API) {
    window.$ = $;
    var Slide = require('switchable/switchable').Slide;
    var slide = new Slide({
        element: '#slide-demo-1',
        effect: 'scrolly',
        interval: 3000
    });
    function _validateForm() {
        var username = $.trim($("#username").val());
        var password = $.trim($("#password").val());
        if (!username) {
            $(".error").css("visibility","visible").find("span").html("填写用户名");
            return false;
        }
        if (!password) {
            $(".error").css("visibility","visible").find("span").html("填写密码");
            return false;
        }
        return {username: username, password: password};
    }

    var _handleLogin = function () {
        $(".btn-login").click(function () {
            login();
        });
        $(".form-group input").keydown(function (event) {
            if (event.keyCode == 13) {
                login();
            }
        });
        function login() {
            var data = _validateForm();
            if (!data) return;
            API.login(data, function (data) {
                if(data.code == 1){
                   return $(".error").css("visibility","visible").find("span").html("用户名或密码错误");
                }
                window.location.href = "index.html#!/";
            });
        }
    }
    _handleLogin();
});
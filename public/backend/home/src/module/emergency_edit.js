/**************************
 * 资讯编辑
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/
var tpl = require("../html/emergency_edit.html");

var EmergencyEdit = avalon.define("EmergencyEdit", function (vm) {
    vm.obj = {};                                                     // 编辑对象
    vm.back = function () {
        window.history.back();
    }
});

function queryById(rid, cb) {
    API.emergencyById(rid, cb);
}
module.exports = {
    tpl: tpl,
    model: EmergencyEdit,
    render: function (param) {
        if (param && param.rid) {
            queryById(param.rid, function (result) {
                if (result.data) {
                    result.data.images = JSON.parse(result.data.images);
                    EmergencyEdit.obj = result.data;
                } else {
                    avalon.router.navigate("/index");
                }
            });
        } else {
            avalon.router.navigate("/index");
        }
    }
}



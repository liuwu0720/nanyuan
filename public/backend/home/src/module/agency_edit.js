/**************************
 * 资讯编辑
 * User: Becky
 * Date: 15-9-26
 * Time: 下午2:45
 *************************/
var tpl = require("../html/agency_edit.html");
var map = null;                             // 地图对象
var geocoder = null;                        // 地图解析对象
var marker = null;                          // 分店标点
var local = null;
var type = 2;
var validator;

var AgencyEdit = avalon.define("AgencyEdit", function (vm) {
    vm.obj = {
        type: type,
        department: "",
        contactMan: "",
        title: "",
        address: "",
        tel: "",
        lng: "",
        lat: "",
        listOrder: "1"
    };                                                     // 编辑对象
    vm.save = function () {
        if (validator.form()) {
            var position = getPosition();
            if (!position.lat || !position.lng) {
                return validator.showErrors({
                    address: "<i class='iconfont'></i>&nbsp;请在地图标注位置"
                })
            }
            vm.obj.lat = position.lat;
            vm.obj.lng = position.lng;
            API.saveAgency(vm.obj.$model, function (result) {
                window.history.back();
            });
        }
    }
    vm.back = function () {
        window.history.back();
    }

    /***********************************
     *  创建可移动的标注，用于地图修改
     **********************************/

    vm.createMarker = function () {
        _createMarker();
    }

    /***********************************
     *  地图搜索
     **********************************/

    vm.mapSearch = function () {
        local.search(vm.obj.address);
        setTimeout(function () {
            _createMarker();
        }, 500)
    }
});
function validateHandler() {
    var form = $('#agency-form');
    var options = {
        errorElement: 'p',                         //default input error message container
        errorClass: 'input-error',                 // default input error message class
        focusInvalid: true,                       // do not focus the last invalid input
        focusCleanup: true,
        rules: {
            contactMan: {
                maxlength: 20
            },
            department: {
                required: true,
                maxlength: 50
            },
            title: {
                maxlength: 20
            },
            listOrder: {
                digits: true,
                range: [1, 100]
            },
            tel: {
                phone: true
            },
            address: {
                required: true,
                maxlength: 100
            }
        },
        messages: {
            contactMan: {
                required: "<i class='iconfont'></i>&nbsp;填写联系人",
                maxlength: "<i class='iconfont'></i>&nbsp;长度不超过20字"
            },
            department: {
                required: "<i class='iconfont'></i>&nbsp;填写部门",
                maxlength: "<i class='iconfont'></i>&nbsp;长度不超过50字"
            },
            title: {
                required: "<i class='iconfont'></i>&nbsp;填写职位",
                maxlength: "<i class='iconfont'></i>&nbsp;长度不超过20字"
            },
            listOrder: {
                digits: "<i class='iconfont'></i>&nbsp;输入1-100内的整数",
                range: "<i class='iconfont'></i>&nbsp;输入1-100内的整数"
            },
            tel: {
                required: "<i class='iconfont'></i>&nbsp;填写联系方式",
                phone: "<i class='iconfont'></i>&nbsp;填写正确的手机或座机号码"
            },
            address: {
                required: "<i class='iconfont'></i>&nbsp;填写详细地址",
                maxlength: "<i class='iconfont'></i>&nbsp;长度不超过100"
            }
        },
    }
    return form.validate(options);
}
function queryAgencyById(rid, cb) {
    API.agencyById(rid, cb);
}
function getPosition() {
    if (!marker)
        return null;
    var position = marker.getPosition();
    return Convert_BD09_To_GCJ02(position);
}
function _createMarker() {
    var p = map.getCenter();
    if (marker) {
        marker.setPosition(p);
        map.addOverlay(marker);
    }
    else {
        var myIcon = new BMap.Icon("/backend/img/marker_blue_sprite.png", new BMap.Size(26, 25), {
            anchor: new BMap.Size(12, 24)
        });
        marker = new BMap.Marker(p, {icon: myIcon});
        marker.enableDragging();
        map.addOverlay(marker);
    }
}

/**********************************************************************
 * 中国正常坐标系GCJ02协议的坐标，转到 百度地图对应的 BD09 协议坐标
 *********************************************************************/

function Convert_GCJ02_To_BD09(position) {
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    var x = position.lng, y = position.lat;
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
    position.lng = z * Math.cos(theta) + 0.0065;
    position.lat = z * Math.sin(theta) + 0.006;
    return position;
}


/**********************************************************************
 * 百度地图对应的 BD09 协议坐标，转到 中国正常坐标系GCJ02协议的坐标
 *********************************************************************/

function Convert_BD09_To_GCJ02(position) {
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    var x = position.lng - 0.0065, y = position.lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    position.lng = z * Math.cos(theta);
    position.lat = z * Math.sin(theta);
    return position;
}

function initMap(cb) {
    marker = null;
    var time = 0;
    if(!BMap){
        time = 200;
    }
    setTimeout(function(){
        map = new BMap.Map("container");                                     // 创建Map实例
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);              // 初始化地图,设置中心点坐标和地图级别
        map.addControl(new BMap.MapTypeControl());                           // 添加地图类型控件
        map.enableScrollWheelZoom(true);                                     // 开启鼠标滚轮缩放
        map.addControl(new BMap.NavigationControl());
        local = new BMap.LocalSearch(map, {
            renderOptions: {map: map}
        });
        geocoder = new BMap.Geocoder();
        var p = {lng: '113.94143960928416', lat: '22.509502224441416'}
        map.centerAndZoom(p, 18);
        cb(null,null);
    },time);
}


module.exports = {
    tpl: tpl,
    model: AgencyEdit,
    render: function (param) {
        async.waterfall([function(next){
            initMap(next);
        }],function(err,result){
            AgencyEdit.obj = {
                type: type,
                department: "",
                contactMan: "",
                title: "",
                address: "",
                tel: "",
                lng: "",
                lat: "",
                listOrder: ""
            };
            param.rid && queryAgencyById(param.rid, function (result) {
                if (result.data) {
                    AgencyEdit.obj = result.data;
                    if (AgencyEdit.obj.lng && AgencyEdit.obj.lat) {
                        var p = Convert_GCJ02_To_BD09(new BMap.Point(parseFloat(AgencyEdit.obj.lng), parseFloat(AgencyEdit.obj.lat)));
                        map.centerAndZoom(p, 18);
                        _createMarker();
                    }
                }
            });
            validator = validateHandler();
        })
    }
}



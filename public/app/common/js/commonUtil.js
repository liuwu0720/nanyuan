function gObjectClone(obj) {
    if (obj) {
        var s = JSON.stringify(obj);
        var o = JSON.parse(s);
        return o;
    } else {
        return null;
    }
}

function mobileReg(mobile) {
    var reg = /^1[3|4|5|7|8|][0-9]{9}$/;
    return reg.test(mobile);
}

function gObjectCopy(obj, from) {
    for (var p in from) {
        if (typeof(from[p]) != "function") {
            obj[p] = from[p];
        }
    }
}

function gArrayCopy(arrObj, from) {
    for(var i=0;i<from.length;i++){
        arrObj.push(from[i]);
    }
}

function ajaxGetBackend(url, data, cb) {
    $.ajax({
        url: "/nanyuan/app"+url,
        type: 'GET',
        data: data,
        dataType: "json",
        success: function (result) {
            cb(result);
        },
        error:function(){
        }
    });
}

function ajaxPostBackend(url, data, cb) {
    $.ajax({
        url:"/nanyuan/app"+url,
        type: 'POST',
        data: data,
        dataType: "json",
        success: function (result) {
            cb(result);
        },
        error:function(){
        }
    });
}

function ajaxGet(url, data, cb) {
    var el=null;
    try
    {
        el=$.loading({
            content:''
        })
    }catch(e){
    }
    $.ajax({
        url: "/nanyuan/app"+url,
        type: 'GET',
        data: data,
        dataType: "json",
        success: function (result) {
            try{
                el.loading("hide");
            }catch(e){
            }
            cb(result);
        },
        error:function(){
            try{
                el.loading("hide");
            }catch(e){
            }
        }
    });
}

function ajaxPost(url, data, cb) {
    var el=null;
    try
    {
        el=$.loading({
            content:''
        })
    }catch(e){
    }
    $.ajax({
        url:"/nanyuan/app"+url,
        type: 'POST',
        data: data,
        dataType: "json",
        success: function (result) {
            try{
                el.loading("hide");
            }catch(e){
            }
            cb(result);
        },
        error:function(){
            try{
                el.loading("hide");
            }catch(e){
            }
        }
    });
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
function chineseToUtf8(str) {
    str = str.replace(/[^u0000-u00FF]/g, function ($0) {
        return escape($0).replace(/(%u)(w{4})/gi, "&#x$2;")
    });
    return str;
}

function chineseFromUtf8(str) {
    str = unescape(str.replace(/&#x/g, '%u').replace(/;/g, ''));
    return str;
}
/**
 * @function
 * @memberOf lang
 * @name save
 * @desctiption 本地存储,存
 * @param {String} name 存储名称
 * @param {Object} data 被存储的对象，如果为null，则是把name删除掉
 * @param {boolean} [isPermanent] 是否永久性存储，true是永久存储，false或默认不填是会话存储
 * @see load
 * @example
 * FW.use().save("abc",{a:'hello'});//存储
 * FW.use().save("abc",null);//删除
 *
 */
var saveLocal = function (name, data, isPermanent) {
    if (/android/i.test(navigator.userAgent)) {
        addCookie(name, data, 10000, '/');
    } else {
        if (!window.localStorage || !window.sessionStorage) {
            console.info("browser not supprt window.loalStorage!");
            return;
        }
        var storage = (isPermanent) ? localStorage : sessionStorage;
        if (data) {
            storage.setItem(name, data);
        } else {
            //如果是null，表示删除
            storage.removeItem(name);
        }
    }
};

/**
 * @function
 * @memberOf lang
 * @name load
 * @desctiption 本地存储，取
 * @param {String} name 存储名称
 * @param {boolean} [isPermanent] 是否永久性存储，true是永久存储，false或默认不填是会话存储
 * @return 返回本地存储name对应的值
 * @see save
 * @example
 * FW.use().load("abc");
 *
 */
var loadLocal = function (name, isPermanent) {
    var resultJson = null;
    if (/android/i.test(navigator.userAgent)) {
        resultJson = getCookie(name);
        resultJson = chineseFromUtf8(resultJson);
    } else {
        if (!window.localStorage || !window.sessionStorage) {
            console.info("browser not supprt window.loalStorage!");
            return null;
        }
        var storage = (isPermanent) ? localStorage : sessionStorage;
        resultJson = storage.getItem(name);
    }
    return resultJson;
};
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

existsInArray = function (array, value) {
    for (var i = 0; i < array.length; i++) {
        var item = array[i];
        if (item === value) {
            return true;
        }
    }
    return false;
}

Date.prototype.addDays = function (d) {
    this.setDate(this.getDate() + d);
};

var fromStrToDate = function (str) {  //如:fromStrToDate("2014-12-12 18:00:00")
    var tempStrs = str.split(" ");
    var dateStrs = tempStrs[0].split("-");
    var year = parseInt(dateStrs[0], 10);
    var month = parseInt(dateStrs[1], 10) - 1;
    var day = parseInt(dateStrs[2], 10);   //

    if (tempStrs.length > 1) {
        var timeStrs = tempStrs[1].split(":");
        var hour = parseInt(timeStrs [0], 10);
        var minute = parseInt(timeStrs[1], 10);
        var second = parseInt(timeStrs[2], 10);
        var date = new Date(year, month, day, hour, minute, second);
        return date;
    } else {
        var date = new Date(year, month, day);
        return date;
    }
}

function showInfoTip(content){
    $.tips({
        content:content,
        stayTime:2000,
        type:"info"
    })
}

function showSuccessTip(content){
    $.tips({
        content:content,
        stayTime:2000,
        type:"success"
    })
}

function showWarnTip(content){
    $.tips({
        content:content,
        stayTime:2000,
        type:"warn"
    })
}

function showDialog(title,content,buttons,cb){
    var dia=$.dialog({
        title:title,
        content:content,
        button:buttons
    });
    dia.on("dialog:action",function(e){
        e.stopPropagation();
        cb(e.index);
    });
}

function showSelectDialog(title,content,cb){
    showDialog(title,content,["确认","取消"],function(index){
        if(index==0){
            if(cb){
                cb(index);
            }
        }
    });
}

function showConfirmDialog(title,content,cb){
    showDialog(title,content,["确认"],function(index){
        if(index==0){
            if(cb){
                cb(index);
            }
        }
    });
}

function convertUrl(url){
    var sa=url.split("?");
    var pureUrl=sa[0];
    var isFirstParameter=true;
    var parameterStr=sa[1];
    var parameters=parameterStr.split("&");
    for(var i=0;i<parameters.length;i++){
        var couple=parameters[i].split("=");
        var name=couple[0];
        var value=couple[1];
        if(name!="code" && name!="wechat_card_js" && name!="state"){
            if(isFirstParameter){
                isFirstParameter=false;
                pureUrl=pureUrl+"?"+name+"="+value;
            }else{
                pureUrl=pureUrl+"&"+name+"="+value;
            }
        }
    }
    return pureUrl;
}

var fromDateToStr = function (date, fmt) {
    var o = {
        "M+": date.getMonth() + 1,                 //月份
        "d+": date.getDate(),                    //日
        "h+": date.getHours(),                   //小时
        "m+": date.getMinutes(),                 //分
        "s+": date.getSeconds(),                 //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

function createModel(name,cb){
    var model=avalon.vmodels[name];
    if(!model){
        model=cb(name);
        model.init();
    }else{
        if(model.onFocus){
            model.onFocus();
        }
    }
    if(model.initValidation){
        model.initValidation();
    }else{
        //gValidationHandle(null,null,null,null);
    }
    avalon.scan(document.body, model);
    if(model.afterScreenBind){
        model.afterScreenBind();
    }
    return model;
}

function dynamicImageHandler(id){
    var screenWidth = $(window).width();
    $("#"+id+" img").each(function(){
        if(this.complete){
            var width = $(this).width();
            if(width>screenWidth || width==0){
                $(this).css("width","100%");
            }
        }else{
            this.onload=function(){
                var width = $(this).width();
                if(width>screenWidth){
                    $(this).css("width","100%");
                }
            }
        }
    })
}

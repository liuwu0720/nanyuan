/**
 * Created by gxk on 2014/9/23
 * 通用工具类.
 */

/**
 * 字符串转换为日期
 * @param str
 * @returns {Date}
 */
exports.fromStrToDate = function (str) {  //如:fromStrToDate("2014-12-12 18:00:00")
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

/**
 * 如期转换为字符串
 * @param date
 * @param fmt
 * @returns {*}
 */
exports.fromDateToStr = function (date, fmt) {
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


exports.createUUID = function () {
    var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
    var dc = new Date();
    var t = dc.getTime() - dg.getTime();
    var tl = getIntegerBits(t, 0, 31);
    var tm = getIntegerBits(t, 32, 47);
    var thv = getIntegerBits(t, 48, 59) + '1';
    var csar = getIntegerBits(rand(4095), 0, 7);
    var csl = getIntegerBits(rand(4095), 0, 7);

    var n = getIntegerBits(rand(8191), 0, 7) +
        getIntegerBits(rand(8191), 8, 15) +
        getIntegerBits(rand(8191), 0, 7) +
        getIntegerBits(rand(8191), 8, 15) +
        getIntegerBits(rand(8191), 0, 15);
    return tl + tm + thv + csar + csl + n;
};

function getIntegerBits(val, start, end) {
    var base16 = returnBase(val, 16);
    var quadArray = new Array();
    var quadString = '';
    var i = 0;
    for (i = 0; i < base16.length; i++) {
        quadArray.push(base16.substring(i, i + 1));
    }
    for (i = Math.floor(start / 4); i <= Math.floor(end / 4); i++) {
        if (!quadArray[i] || quadArray[i] == '') quadString += '0';
        else quadString += quadArray[i];
    }
    return quadString;
};

function returnBase(number, base) {
    return (number).toString(base).toUpperCase();
};

function rand(max) {
    return Math.floor(Math.random() * (max + 1));
};


exports.getWeekend=function(index){
    var thisDate=new Date();
    var nextDay=0;
    if(thisDate.getDay()==0){
        nextDay=6;
    }else if(thisDate.getDay()==1){
        nextDay=5;
    }else if(thisDate.getDay()==2){
        nextDay=4;
    }else if(thisDate.getDay()==3){
        nextDay=3;
    }else if(thisDate.getDay()==4){
        nextDay=2;
    }else if(thisDate.getDay()==5){
        nextDay=1;
    }else if(thisDate.getDay()==6){
        nextDay=1;
    }
    if(index>0){
        nextDay=nextDay+index;
    }
    thisDate=thisDate.getTime()+nextDay * 24 * 60 * 60 * 1000;
    var str=this.fromDateToStr(new Date(thisDate),"yyyy-MM-dd");
    return str;
}

exports.isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}
/**
 * 查找数组或{}中是否存在val
 * @param arr
 * @param val
 * @returns {*}
 */
exports.indexOf = function (arr, val) {
    for (var i in arr) {
        var value = arr[i];
        if (value == val) {
            return i;
        }
    }
    return -1;
}

exports.encodeUtf8 = function (s1) {
    var s = escape(s1);
    var sa = s.split("%");
    var retV = "";
    if (sa[0] != "") {
        retV = sa[0];
    }
    for (var i = 1; i < sa.length; i++) {
        if (sa[i].substring(0, 1) == "u") {
            retV += Hex2Utf8(Str2Hex(sa[i].substring(1, 5)));

        }
        else retV += "%" + sa[i];
    }
    return retV;
}
function Str2Hex(s) {
    var c = "";
    var n;
    var ss = "0123456789ABCDEF";
    var digS = "";
    for (var i = 0; i < s.length; i++) {
        c = s.charAt(i);
        n = ss.indexOf(c);
        digS += Dec2Dig(eval(n));

    }
    return digS;
}
function Dec2Dig(n1) {
    var s = "";
    var n2 = 0;
    for (var i = 0; i < 4; i++) {
        n2 = Math.pow(2, 3 - i);
        if (n1 >= n2) {
            s += '1';
            n1 = n1 - n2;
        }
        else
            s += '0';
    }
    return s;

}
function Dig2Dec(s) {
    var retV = 0;
    if (s.length == 4) {
        for (var i = 0; i < 4; i++) {
            retV += eval(s.charAt(i)) * Math.pow(2, 3 - i);
        }
        return retV;
    }
    return -1;
}
function Hex2Utf8(s) {
    var retS = "";
    var tempS = "";
    var ss = "";
    if (s.length == 16) {
        tempS = "1110" + s.substring(0, 4);
        tempS += "10" + s.substring(4, 10);
        tempS += "10" + s.substring(10, 16);
        var sss = "0123456789ABCDEF";
        for (var i = 0; i < 3; i++) {
            retS += "%";
            ss = tempS.substring(i * 8, (eval(i) + 1) * 8);
            retS += sss.charAt(Dig2Dec(ss.substring(0, 4)));
            retS += sss.charAt(Dig2Dec(ss.substring(4, 8)));
        }
        return retS;
    }
    return "";
}

exports.retrieveFromSerialNo=function(serialNo){
    var index=serialNo.indexOf("0");
    index++;
    return parseInt(serialNo.substring(index));
}

exports.generateSerialNo=function(rid) {
    var currentStr = 0 + "" + rid + "";
    var len = 12;
    var currentLen = currentStr.length;
    var addStr = "";
    if (currentLen <= 12) {
        var leftLen = 12 - currentLen;
        //产生随机1到9的随机数
        for (var i = 0; i < leftLen; i++) {
            addStr = addStr + getRandomNum(1, 9);
        }
        return  addStr + currentStr;
    }
}

function getRandomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    return(Min + Math.round(Rand * Range));
}

exports.dateAddMonth=function(date,num)
{
    var tempDate=date.getDate();
    date.setMonth(date.getMonth()+num);
    if(tempDate!=date.getDate())
        date.setDate(0);
    return date;
}
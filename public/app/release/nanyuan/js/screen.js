var lastscreen='#frameMain';
window.onhashchange = function() {
    if (location.hash == '#no-back') {

    }else{
        var newscreen=location.hash;
        if(!newscreen || newscreen==''){
            newscreen='#frameMain';
        }
        $(lastscreen).css('display','none');
//        if(newscreen=="#frameContentDetail"){
//            $(newscreen).html("");
//        }
        $(newscreen).css('display','block');
        if(shareManager){
            //shareManager.shareSwitchCheck(newscreen,lastscreen);
        }
        lastscreen=newscreen;
        newscreen=newscreen.substring(6);
        clientInfoModel.screen=newscreen;
        clientInfoModel.onScreenChange(newscreen);
    }
}

function isAndroidDevice(){
    var u = navigator.userAgent, app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
    return isAndroid;
}
function isIOSDevice(){
    var u = navigator.userAgent, app = navigator.appVersion;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    return isiOS;
}
var weixinUtil = require('./util/weixinUtil.js');
var menuDao = require('./model/menuDao.js');
var server = require('./init');
exports.createMenu=function(domainId){
    console.log('CCC');
    menuDao.getMenuData(domainId,function (menuData) {
        weixinUtil.createMenu(menuData,function(data){
            console.log(JSON.stringify(menuData));
            console.log(JSON.stringify(data));
        });
    });
}
server.start();
this.createMenu(1);
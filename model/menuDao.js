

exports.getMenuData=function(domainId,cb){
    var sql="select * from wg_menu where domainId= ? order by parentId";
    excute(sql,[domainId],function(err,rows){
        var menuData={button:null};
        menuData.button=findSubMenuList(0,rows);
        cb(menuData);
    });
}

function findSubMenuList(menuId,list){
    var menuList=[];
    for(var i=0;i<list.length;i++){
        if(list[i].parentId==menuId){
            var submenu=findSubMenuList(list[i].rid,list);
            var menu={name:list[i].menu};
            if(submenu && submenu.length>0){
                menu.sub_button=submenu;
            }else{
                menu.type="view";
                menu.url= list[i].url;
            }
            menuList.push(menu);
        }
    }
    return menuList;
}





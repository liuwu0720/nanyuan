
exports.queryMenus = function(roleId,cb){
    var sql="select m.* from wg_role_menu rm inner join wg_sysmenu m on(m.rid = rm.menu_id) where rm.role_id = ? order by rank asc";
    excute(sql,[roleId],function(err,menus){
        cb(err,menus);
    });
}







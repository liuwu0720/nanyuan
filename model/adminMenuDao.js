
exports.queryMenus = function(roleId,cb){
    var sql="select m.*,rm.is_active from base_role_menu rm inner join base_menu m on(m.rid = rm.menu_id) where rm.role_id = ? order by rank asc";
    excute(sql,[roleId],function(err,menus){
        cb(err,menus);
    });
}







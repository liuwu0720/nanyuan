var messageUtil = require('../util/messageUtil');
var async = require("async");

var EmergencyDao = function () {

};

EmergencyDao.prototype.retrieveCategoryList=function(domainId,cb){
    var sql="SELECT * from wg_emergencycategory where domainId=?";
    excute(sql,[domainId],function(err,rows){
        cb(err,rows);
    });
}

EmergencyDao.prototype.sendEmergencyTemplateMessage=function(domainId,reporterId,departmentId,emergencyNumber,type,contactMan){
    sql="SELECT u.username,c.openid FROM wg_user AS u LEFT JOIN wg_client AS c ON(u.clientId=c.rid) WHERE u.departmentId=?";
    excute(sql,[departmentId],function(err,relatedRows){
        for(var i=0;i<relatedRows.length;i++){
            var to=relatedRows[i].username;
            var toOpenid=relatedRows[i].openid;
            messageUtil.sendEmergencyTemplateMessage(domainId,contactMan,to,toOpenid,emergencyNumber,type);
        }
    });
}

EmergencyDao.prototype.addEmergency=function(domainId,emergency,departmentId,cb){
    var _this=this;
    var sql="insert into wg_emergency set ?";
    excute(sql,[emergency],function(err,rows) {
        emergency.rid = rows.insertId;
        var report = {reportDate: new Date(), reporterId: emergency.clientId, receiverId: departmentId, emergencyId: rows.insertId, delayHour: 0, status: 'N'};
        sql = "insert into wg_emergencyreport set ?";
        excute(sql, [report], function (err, relatedRows) {
            report.rid = relatedRows.insertId;
            _this.sendEmergencyTemplateMessage(domainId, emergency.clientId, departmentId, 1,emergency.type,emergency.contactMan);
            cb(err, rows);
        });
    });
}

EmergencyDao.prototype.updateEmergency=function(emergency,cb){
    var sql="update wg_emergency set ? where rid=?";
    excute(sql,[emergency,emergency.rid],function(err,rows){
        cb(err,rows);
    });
}

EmergencyDao.prototype.retrieveMyHistoryList=function(clientId,arrayLength,cb){
    var sql="SELECT * FROM wg_emergency WHERE clientId=? ORDER BY rid DESC LIMIT "+arrayLength+","+MAX_LIST_LENGTH;
    excute(sql,[clientId],function(err,rows){
        var rowsCount=arrayLength+rows.length;
        cb(err,rows,rowsCount);
    });
}

EmergencyDao.prototype.retrieveEmergencyList=function(clientId,cb){
    var sql="SELECT e.*,u.username,u.politics,u.mobile,d.department,r.rid AS emergencyReportId,r.delayHour,r.reportDate,r.status AS reportStatus,r.reportDetail FROM wg_emergencyreport AS r LEFT JOIN wg_emergency AS e ON(e.rid=r.emergencyId) LEFT JOIN wg_user AS u ON(u.clientId=r.reporterId) LEFT JOIN wg_department AS d ON(u.departmentId=d.rid) WHERE (r.receiverId IN (SELECT departmentId FROM wg_user WHERE clientId=?)) AND e.type>=0 AND e.creDate BETWEEN DATE_ADD(NOW(), INTERVAL -24 HOUR ) AND NOW() ORDER BY r.rid DESC";
    excute(sql,[clientId,clientId],function(err,rows){
        cb(err,rows);
    });
}

EmergencyDao.prototype.updateEmergencyReport=function(emergency,cb){
    var rids=emergency.rids;
    delete emergency.rids;
    var sql="update wg_emergencyreport set ? WHERE rid in("+rids+")";
    excute(sql,[emergency],function(err,rows){
        cb(err,rows);
    });
}

EmergencyDao.prototype.queryByPage=function(domainId,currentPage,pageSize,cb){
    var sql="select *  from wg_emergency where domainId = ? order by rid desc  limit ?,?";
    var count_sql = "select count(0) as count from wg_emergency where domainId = ? ";
    var start = (currentPage-1)*pageSize;
    async.waterfall([function(next){
        excute(count_sql,[domainId],function(err,rows){
            next(err,err || rows[0].count);
        });
    },function(r,next){
        if(r){
            return excute(sql,[domainId,start,pageSize],function(err,rows){
                next(err,{totalItems:r,list:rows});
            });
        }
        next(null,{totalItems:0});
    }],function(err,r){
        cb(err,r);
    });
}

EmergencyDao.prototype.queryById=function(rid,domainId,cb){
    var sql="select * from wg_emergency where rid = ? and domainId = ?";
    excute(sql,[rid,domainId],function(err,rows){
        cb(err,err ||(rows.length&&rows[0]));
    });
}


EmergencyDao.prototype.delById=function(rid,domainId,cb){
    var sql="delete from wg_emergency where rid = ? and domainId = ?";
    excute(sql,[rid,domainId],function(err,rows){
        cb(err,rows);
    });
}

module.exports = EmergencyDao;





var async = require('async');
var commUtil=require('../util/commUtil.js');

exports.registerClient = function (data,domainId,cb) {
    var checkSql="select * from wg_client where openid=? and domainId=?";
    var insertSql="insert into wg_client set ?";
    var updateSql="update wg_client set ? where rid=?";
    var client={username:data.nickname,nickname:data.nickname,openid:data.openid,sex:data.sex,province:data.province,city:data.city,country:data.country,headimgurl:data.headimgurl,status:'R'};
    excute(checkSql,[data.openid,domainId], function (err, clientRows) {
        if(clientRows && clientRows.length>0){
            excute(updateSql,[client,clientRows[0].rid], function (err, rows) {
                client.rid=clientRows[0].rid;
                client.domainId=clientRows[0].domainId;
                client.creDate=clientRows[0].creDate;
                cb(err,client);
            });
        }else{
            client.domainId=domainId;
            client.creDate=new Date();
            excute(insertSql,client, function (err, rows) {
                client.rid=rows.insertId;
                cb(err,client);
            });
        }
    });
}

exports.retrieveClientInfo = function (openid,domainId,cb) {
    excute("select * from wg_domain where rid=?",[domainId], function (err, domains) {
        var sql="select c.*,u.username as dusername,u.departmentId,u.role,u.politics,d.department from wg_client as c left join wg_user as u on(c.rid=u.clientId) left join wg_department as d on(u.departmentId=d.rid) where c.openid=? and c.domainId=? ";
        excute(sql,[openid,domainId], function (err, rows) {
            if(rows && rows.length>0){
                cb(err,rows[0],domains[0]);
            }else{
                var client={openid:openid,domainId:domainId,creDate:new Date(),status:'T'};
                excute("insert into wg_client set ?",[client], function (err, rows) {
                    client.rid=rows.insertId;
                    cb(err,client,domains[0]);
                });
            }
        });
    });

}

exports.retrieveClient = function (rid,cb) {
    var sql="select * from wg_client where rid=?";
    excute(sql,rid, function (err, rows) {
        if(rows && rows.length>0){
            cb(err,rows[0]);
        }else{
            cb(err,null);
        }
    });
}

exports.updateClient = function (client,cb) {
    var sql="update wg_client set ? where rid=?";
    excute(sql,[client,client.rid], function (err, rows) {
        cb(err,rows);
    });
}

exports.userBind = function (clientId,userInfo,domainId,cb) {
    var sql="select * from wg_user where mobile=? and domainId=?";
    excute(sql,[userInfo.username,domainId], function (err, rows) {
        if(rows && rows.length>0){
            if(rows[0].password==userInfo.password){
                var ids="";
                for(var i=0;i<rows.length;i++){
                    if(ids==""){
                        ids=rows[i].rid+"";
                    }else{
                        ids=ids+","+rows[i].rid;
                    }
                }
                excute("update wg_user set clientId=? where rid in("+ids+")",[clientId],function (err, urows) {
                    excute("update wg_client set status='V' where rid=?",[clientId],function (err, urows) {
                        if(rows[0].clientId>0){
                            //目前绑定新用户会清掉之前绑定的老用户
                            excute("update wg_client set status='R' where rid=?",[rows[0].clientId],function (err, urows) {
                                cb(0);
                            });
                            //return cb(3);
                        }else{
                            cb(0);
                        }
                    });
                });
            }else{
                cb(2);
            }
        }else{
            cb(1);
        }
    });
}

exports.addTraceLocation = function (traceLocation,cb) {
    var sql="insert into wg_tracelocation set ?";
    excute(sql,[traceLocation], function (err, rows) {
        cb(err,rows);
    });
}

exports.retrieveUserTraceList=function(clientId,creDate,cb){
    var startTime=commUtil.fromStrToDate(creDate+" 00:00:00");
    var endTime= commUtil.fromStrToDate(creDate+" 23:59:59");
    var sql="SELECT rid,lng,lat,bLng,bLat,address,DATE_FORMAT(creDate,'%Y-%m-%d %H:%i')as creDate FROM wg_tracelocation WHERE clientId=? AND creDate>=? AND creDate<=? order by rid";
    excute(sql,[clientId,startTime,endTime],function(err,rows){
        cb(err,rows);
    });
}





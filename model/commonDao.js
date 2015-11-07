var db = require('./db.js');

var CommonDao = function () {

}

CommonDao.prototype.run = function (sql, cb) {
    db.getConnection(function (err, connection) {
        connection.query(sql,function (err, rows) {
            connection.release();
            cb(err,rows);
        });
    });
};

/**
 *  根据传送过来的数据，构建查询语句
 *  {
 *   table:wl_shopinfo,
 *   rid:rid
 *   where:[{field:"fieldColumn1",value:value1},{field:"fieldColumn2",value:value2}]
 *  }
 * */

CommonDao.prototype.uniqueValidate = function (data, cb) {
    var sql="SELECT rid FROM "+data.table+" WHERE domainId = ? and  ";
    var whereSql=null;
    var valueArray=[];
    for(var i=0;i<data.where.length;i++){
        if(whereSql){
            whereSql=whereSql+" AND "+ data.where[i].field+" = ?";
        }else{
            whereSql=data.where[i].field+" = ?";
        }
        valueArray.push(data.where[i].value);
    }
    if(data.rid && data.rid>0){
        whereSql=whereSql+" AND rid<>"+data.rid;
    }
    sql=sql+whereSql+" LIMIT 0,1";
    valueArray.unshift(data.domainId);
    db.getConnection(function (err, connection) {
        connection.query(sql,valueArray,function (err, rows) {
            var result=false;
            if(!err){
                if(rows.length==0){
                    result=true;
                }
            }
            connection.release();
            cb(result);
        });
    });
};

module.exports = CommonDao;


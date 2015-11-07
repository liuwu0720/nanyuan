var db = require('./db.js');

var PhotosDao = function () {

};

PhotosDao.prototype.getPhoto = function (clientId,localId,cb) {
    var sql="select url from wp_photos WHERE clientId=? AND localId=?";
    db.getConnection(function (err, connection) {
        connection.query(sql,[clientId,localId], function (err, rows) {
            connection.release();
            var url=null;
            console.log(JSON.stringify(rows));
            if(rows.length>0){
                url=rows[0].url;
            }
            cb(url);
        });
    });
}

PhotosDao.prototype.addPhoto = function (data,cb) {
    var sql="UPDATE wp_photos SET url=? WHERE clientId=? AND localId=?";
    db.getConnection(function (err, connection) {
        connection.query(sql,[data.url,data.clientId,data.localId], function (err, rows) {
            if(rows.affectedRows<1){
                sql="insert into wp_photos set ?";
                connection.query(sql,data, function (err, rows) {
                    connection.release();
                    cb(err,rows);
                });
            }else{
                connection.release();
                cb(err,rows);
            }
        });
    });
}

module.exports = PhotosDao;





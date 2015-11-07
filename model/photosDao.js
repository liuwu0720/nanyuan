exports.getPhoto = function (clientId, localId, cb) {
    var sql = "select url from wp_photos WHERE clientId=? AND localId=?";
    excute(sql, [clientId, localId], function (err, rows) {
        var url = null;
        if (rows.length > 0) {
            url = rows[0].url;
        }
        cb(url);
    });
}

exports.addPhoto = function (data, cb) {
    var sql = "UPDATE wp_photos SET url=? WHERE clientId=? AND localId=?";
    excute(sql, [data.url, data.clientId, data.localId], function (err, rows) {
        if (rows.affectedRows < 1) {
            sql = "insert into wp_photos set ?";
            excute(sql, data, function (err, rows) {
                cb(err, rows);
            });
        } else {
            cb(err, rows);
        }
    });
}






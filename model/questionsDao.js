var async = require("async");
var MAX_GROUP_LIST_NUMBER = 10;

exports.retrieveGroupList = function (clientId, domainId, arrayLength, cb) {
    var sql = "SELECT g.*,c.rid AS answerId,COUNT(q.groupId) AS questionsCount FROM wg_questiongroup AS g LEFT JOIN wg_questionclient AS c ON(g.rid=c.questionGroupId AND c.clientId=?) LEFT JOIN wg_questions AS q ON(g.rid = q.groupId) WHERE g.state=1 AND g.domainId = ? GROUP BY q.groupId ORDER BY g.rid DESC LIMIT " + arrayLength + "," + MAX_GROUP_LIST_NUMBER;
    excute(sql, [clientId, domainId], function (err, rows) {
        cb(err, rows);
    });
}

exports.retrieveQuestionList = function (groupId, cb) {
    var sql = "SELECT q.rid,q.title,q.labelA,q.labelB,q.labelC,q.labelD,q.labelE,q.labelF,q.choice FROM wg_questions AS q WHERE groupId=? ORDER BY q.rid";
    excute(sql, [groupId], function (err, rows) {
        cb(err, rows);
    });
}

exports.queryList = function (domainId, cb) {
    var sql = "select * from wg_questiongroup where domainId = ?";
    excute(sql, [domainId], function (err, datas) {
        cb(err, datas);
    });
}

exports.queryByPage = function (domainId, groupId, currentPage, pageSize, cb) {
    var sql = "select q.*,g.title as groupTitle from wg_questions q inner join wg_questiongroup g on (q.groupId = g.rid) where q.domainId = ? and (q.groupId = ? or -1 = ?) order by  q.rid desc  limit ?,?";
    var count_sql = "select count(0) as count from wg_questions q where domainId = ? and (q.groupId = ? or -1 = ?) ";
    var start = (currentPage - 1) * pageSize;
    async.waterfall([function (next) {
        excute(count_sql, [domainId, groupId, groupId], function (err, rows) {
            next(err, err || rows[0].count);
        });
    }, function (r, next) {
        if (r) {
            return excute(sql, [domainId, groupId, groupId, start, pageSize], function (err, rows) {
                next(err, {totalItems: r, list: rows});
            });
        }
        next(null, {totalItems: 0});
    }], function (err, r) {
        cb(err, r);
    });
}


exports.delById = function (rid, domainId, cb) {
    var sql = "delete from wg_questiongroup  where rid = ? and domainId = ? ";
    var delQuestion = "delete from wg_questions where groupId = ? and domainId = ?";
    async.parallel([function (next) {
        excute(sql, [rid, domainId], function (err, rows) {
            next(err, rows);
        });
    }, function (next) {
        excute(delQuestion, [rid, domainId], function (err, rows) {
            next(err, rows);
        });
    }], function (err, result) {
        cb(err, result);
    });
}

exports.delQuestionById = function (rid, domainId, cb) {
    var sql ="delete from wg_questions where rid = ? and domainId = ? ";
    excute(sql, [rid, domainId], function (err, result) {
        cb(err,result);
    });
}

exports.saveGroup = function (obj, cb) {
    var add_sql = "insert into wg_questiongroup  set ? ";
    var update_sql = "update wg_questiongroup set ?  where  rid = ? and domainId = ? ";
    if (obj.rid) {
        excute(update_sql, [obj, obj.rid, obj.domainId], function (err, result) {
            cb(err, result);
        });
    } else {
        excute(add_sql, [obj], function (err, result) {
            cb(err, result);
        });
    }
}

exports.queryById = function (rid, domainId, cb) {
    var sql = "select * from wg_questions where rid = ? and domainId = ?";
    excute(sql, [rid, domainId], function (err, rows) {
        cb(err, err || (rows.length && rows[0]));
    });
}

exports.save = function (obj, cb) {
    var add_sql = "insert into wg_questions  set ? ";
    var update_sql = "update wg_questions set ?  where  rid = ? and domainId = ? ";
    if (obj.rid) {
        excute(update_sql, [obj, obj.rid, obj.domainId], function (err, result) {
            cb(err, result);
        });
    } else {
        excute(add_sql, [obj], function (err, result) {
            cb(err, result);
        });
    }
}

exports.questionCalc = function (groupId,domainId,currentPage, pageSize, cb) {
    var sql = "select q.*,g.title as groupTitle," +
        "(select count(0) from wg_answer where  questionId = q.rid and choice = 'A' ) as A," +
        "(select count(0) from wg_answer where  questionId = q.rid and choice = 'B') as B," +
        "(select count(0) from wg_answer where  questionId = q.rid and choice = 'C') as C," +
        "(select count(0) from wg_answer where  questionId = q.rid and choice = 'D') as D," +
        "(select count(0) from wg_answer where  questionId = q.rid and choice = 'E') as E," +
        "(select count(0) from wg_answer where  questionId = q.rid and choice = 'F') as F " +
        " from wg_questions q inner join wg_questiongroup g on (q.groupId = g.rid) where q.domainId = ? and (q.groupId = ? or -1 = ?) order by  q.rid desc  limit ?,?";
    var count_sql = "select count(0) as count from wg_questions q where domainId = ? and (q.groupId = ? or -1 = ?) ";
    var start = (currentPage - 1) * pageSize;
    async.waterfall([function (next) {
        excute(count_sql, [domainId, groupId, groupId], function (err, rows) {
            next(err, err || rows[0].count);
        });
    }, function (r, next) {
        if (r) {
            return excute(sql, [domainId, groupId, groupId, start, pageSize], function (err, rows) {
                next(err, {totalItems: r, list: rows});
            });
        }
        next(null, {totalItems: 0});
    }], function (err, r) {
        cb(err, r);
    });
}








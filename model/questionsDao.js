var MAX_GROUP_LIST_NUMBER=10;

exports.retrieveGroupList = function (clientId,domainId,arrayLength,cb) {
    var sql="SELECT g.*,c.rid AS answerId,COUNT(q.groupId) AS questionsCount FROM wg_questiongroup AS g LEFT JOIN wg_questionclient AS c ON(g.rid=c.questionGroupId AND c.clientId=?) LEFT JOIN wg_questions AS q ON(g.rid = q.groupId) WHERE g.state=1 AND g.domainId = ? GROUP BY q.groupId ORDER BY g.rid DESC LIMIT "+arrayLength+","+MAX_GROUP_LIST_NUMBER;
    excute(sql,[clientId,domainId],function (err, rows) {
        cb(err,rows);
    });
}

exports.retrieveQuestionList = function (groupId,cb) {
    var sql="SELECT q.rid,q.title,q.labelA,q.labelB,q.labelC,q.labelD,q.labelE,q.labelF,q.choice FROM wg_questions AS q WHERE groupId=? ORDER BY q.rid";
    excute(sql,[groupId],function (err, rows) {
        cb(err,rows);
    });
}







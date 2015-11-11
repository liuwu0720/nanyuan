var EventProxy = require('eventproxy');
var async = require('async');

exports.completeQuestion = function (domainId, clientId, groupId, cb) {
    var questionSql = 'insert into wg_questionclient set ?';
    excute(questionSql, {clientId: clientId, questionGroupId: groupId, creDate: new Date()}, function (err, rows) {
        cb(err, rows);
    });
}

exports.addAnswer = function (answers) {
    var sql = 'insert into wg_answer set ? ';
    answers.forEach(function (answer) {
        excute(sql, answer, function (err, result) {
        });
    });
}

exports.add = function (domainId, clientId, groupId, answers,cb) {
    this.completeQuestion(domainId, clientId, groupId, function (err, rows) {
        cb(err, rows.insertId);
    });
    this.addAnswer(answers);
}





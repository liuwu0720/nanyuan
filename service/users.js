var express = require('express');
var router = express.Router();
var usersDao = require('../model/usersDao.js');

router.get("/retrieveList", function (req, res) {
    var domainId=req.session.passport.user.domainId;
    var rids=req.param("rids");
    var result = {code: 0};
    usersDao.retrieveList(domainId,rids,function (err, rows) {
        if(err){
            result.code=1;
        }else{
            result.data=rows;
        }
        res.send(result);
    });
});

router.get("/retrieveDetail",function(req, res){
    var rid = req.param("rid");
    var result = {code: 0};
    usersDao.retrieveDetail(rid,function (err, rows) {
        if(err){
            result.code=1;
        }else if(rows.length>0){
            result.data=rows[0];
        }else{
            result.data={};
        }
        res.send(result);
    });
});

router.get("/retrieveListByParentDepartment", function (req, res) {
    var domainId=req.session.passport.user.domainId;
    var departmentId=req.param("departmentId");
    var result = {code: 0};
    usersDao.retrieveListByParentDepartment(domainId,departmentId,function (err, rows) {
        if(err){
            result.code=1;
        }else{
            result.data=rows;
        }
        res.send(result);
    });
});

router.get("/changePassword", function (req, res) {
    var clientId=req.session.passport.user.rid;
    var oldPassword=req.param("oldPassword");
    var newPassword=req.param("newPassword");
    var result = {code: 0};
    usersDao.changePassword(clientId,oldPassword,newPassword,function (code, rows) {
        result.code=code;
        res.send(result);
    });
});

router.get("/clearBind", function (req, res) {
    var clientId=req.session.passport.user.rid;
    var result = {code: 0};
    usersDao.clearBind(clientId,function (err, rows) {
        if(err){
            result.code=1;
        }
        res.send(result);
    });
});

router.get("/retrieveDepartmentList", function (req, res) {
    var domainId=req.session.passport.user.domainId;
    var result = {code: 0};
    usersDao.retrieveDepartmentList(domainId,function (err, rows) {
        if(err){
            result.code=1;
        }else{
            var list=[];
            var findAllSubdepartments=function(parentId,list,rows){
                for(var i=0;i<rows.length;i++){
                    if(rows[i].parentId==parentId){
                        rows[i].children=[];
                        findAllSubdepartments(rows[i].rid,rows[i].children,rows);
                        list.push(rows[i]);
                    }
                }
            }
            for(var i=0;i<rows.length;i++){
                if(rows[i].starLevel==2){
                    rows[i].children=[];
                    findAllSubdepartments(rows[i].rid,rows[i].children,rows);
                    list.push(rows[i]);
                }
            }
            result.data=list;
        }
        res.send(result);
    });
});

module.exports = router;

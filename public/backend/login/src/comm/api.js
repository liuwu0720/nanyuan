/*****************************************************
 * User: Becky
 * Date: 15-8-10
 * Time: 下午12:37
 ******************************************************/
var $ = require("jquery");
var baseUrl = "/backend";
function ajax(type, url, data, success, error) {
    $.ajax({
        type: type || "get",
        url: baseUrl + url,
        data: data,
        success: success,
        error: error
    })
};
function Get(url, data, success, error) {
    if (typeof data === 'function') {
        success = data;
        data = undefined;
    }
    ajax("get", url, data, success, function (err) {
        if (typeof error === 'function') {
            error();
        } else {
            if (err.status == 401) {
                window.location.href = "/backend/login.html";
            } else if (err.status == 500) {
                alert("server err");
            }
        }
    });
};
function Post(url, data, success, error) {
    if (typeof data === 'function') {
        success = data;
        data = undefined;
    }
    ajax("post", url, data, success, function (err) {
        if (typeof error === 'function') {
            error();
        } else {
            if (err.status == 401) {
                window.location.href = "/backend/login.html";
            } else if (err.status == 500) {
                alert("server err");
            }
        }
    });
};
var API = {
    login: function (data, success, error) {
        Post("/login", {username: data.username, password: data.password}, success, error);
    },
    userinfo: function (success, error) {
        Get("/userinfo", success, error);
    },
    queryIntro: function (type, success, error) {
        Get("/introduction", {type: type}, success, error);
    },
    saveIntro: function (obj, success, error) {
        Post("/saveintro", {rid: obj.rid, introduction: obj.introduction, type: obj.type}, success, error);
    },
    newsByType: function (params, success, error) {
        Get("/newByType", {
            type: params.type,
            currentPage: params.currentPage,
            pageSize: params.pageSize
        }, success, error);
    },
    delNews: function (rid, success, error) {
        Post("/delNews", {rid: rid}, success, error);
    },
    newById: function (rid, success, error) {
        Get("/newById", {rid: rid}, success, error);
    },
    saveNews: function (news, success, error) {
        Post("/saveNews", news, success, error);
    },
    docByType: function (params, success, error) {
        Get("/docByType", {
            type: params.type,
            currentPage: params.currentPage,
            pageSize: params.pageSize
        }, success, error);
    },
    delDoc: function (rid, success, error) {
        Post("/delDoc", {rid: rid}, success, error);
    },
    docById: function (rid, success, error) {
        Get("/docById", {rid: rid}, success, error);
    },
    saveDoc: function (doc, success, error) {
        Post("/saveDoc", doc, success, error);
    },
    cutPic: function (url, cropData, success, error) {
        Post("/upload/coverCutting", {url: url, select: cropData}, success, error);
    },
    queryConsult: function (params, success, error) {
        Get("/consult", {
            status: params.status,
            currentPage: params.currentPage,
            pageSize: params.pageSize
        }, success, error);
    },
    delConsult: function (rid, success, error) {
        Post("/delConsult", {rid: rid}, success, error);
    },
    saveConsult: function (rid, answer, status, success, error) {
        Post("/saveConsult", {rid: rid, answer: answer, status: status}, success, error);
    },
    querySuggest: function (params, success, error) {
        Get("/suggest", {
            currentPage: params.currentPage,
            pageSize: params.pageSize
        }, success, error);
    },
    delSuggest: function (rid, success, error) {
        Post("/delSuggest", {rid: rid}, success, error);
    },
    agencyByType: function (params, success, error) {
        Get("/agencyByType", {
            type: params.type,
            currentPage: params.currentPage,
            pageSize: params.pageSize
        }, success, error);
    },
    contact: function (params, success, error) {
        Get("/contact", {
            types: params.types,
            currentPage: params.currentPage,
            pageSize: params.pageSize
        }, success, error);
    },
    delAgency: function (rid, success, error) {
        Post("/delAgency", {rid: rid}, success, error);
    },
    agencyById: function (rid, success, error) {
        Get("/agencyById", {rid: rid}, success, error);
    },
    saveAgency: function (obj, success, error) {
        Post("/saveAgency", obj, success, error);
    },
    saveContact: function (obj, success, error) {
        Post("/saveContact", obj, success, error);
    },
    departmentList: function (success, error) {
        Get("/departmentList", success, error);
    },
    saveDepartment: function (obj, success, error) {
        Post("/saveDepartment", obj, success, error);
    },
    delDepartment: function (rid, success, error) {
        Post("/delDepartment", {rid: rid}, success, error);
    },
    staffList: function (param, success, error) {
        Get("/staffList", param, success, error);
    },
    delStaff: function (rid, success, error) {
        Post("/delStaff", {rid: rid}, success, error);
    },
    staffById: function (rid, success, error) {
        Get("/staffById", {rid: rid}, success, error);
    },
    saveStaff: function (obj, success, error) {
        Post("/saveStaff", obj, success, error);
    },
    elegantList: function (params, success, error) {
        Get("/elegantList", {
            type: params.type,
            currentPage: params.currentPage,
            pageSize: params.pageSize
        }, success, error);
    },
    elegantById: function (rid, success, error) {
        Get("/elegantById", {rid: rid}, success, error);
    },
    saveElegant: function (obj, success, error) {
        Post("/saveElegant", obj, success, error);
    },
    delElegant: function (rid, success, error) {
        Post("/delElegant", {rid: rid}, success, error);
    },
    specificList: function (params, success, error) {
        Get("/specificList", {
            currentPage: params.currentPage,
            pageSize: params.pageSize
        }, success, error);
    },
    delSpecific: function (rid, success, error) {
        Post("/delSpecific", {rid: rid}, success, error);
    },
    saveSpecific: function (obj, success, error) {
        Post("/saveSpecific", obj, success, error);
    },
    specificById: function (rid, success, error) {
        Get("/specificById", {rid: rid}, success, error);
    },
    setting: function (success, error) {
        Get("/setting",success, error);
    },
    saveSetting: function (obj, success, error) {
        Post("/saveSetting", {setting:obj}, success, error);
    },
    adminList: function (params, success, error) {
        Get("List", {
            currentPage: params.currentPage,
            pageSize: params.pageSize
        }, success, error);
    },
    delAdmin: function (rid, success, error) {
        Post("/delAdmin", {rid: rid}, success, error);
    },
    saveAdmin: function (obj, success, error) {
        Post("/saveAdmin", obj, success, error);
    },
    saveAdminPassword: function (obj, success, error) {
        Post("/saveAdminPassword", obj, success, error);
    },
    adminById: function (rid, success, error) {
        Get("ById", {rid: rid}, success, error);
    }
}
module.exports = API;

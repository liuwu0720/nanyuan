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
        Get("/admin/userinfo", success, error);
    },
    queryIntro: function (type, success, error) {
        Get("/admin/introduction", {type: type}, success, error);
    },
    saveIntro: function (obj, success, error) {
        Post("/admin/saveintro", {rid: obj.rid, introduction: obj.introduction, type: obj.type}, success, error);
    },
    newsByType: function (params, success, error) {
        Get("/admin/newByType", {
            type: params.type,
            currentPage: params.currentPage,
            pageSize: params.pageSize
        }, success, error);
    },
    delNews: function (rid, success, error) {
        Post("/admin/delNews", {rid: rid}, success, error);
    },
    newById: function (rid, success, error) {
        Get("/admin/newById", {rid: rid}, success, error);
    },
    saveNews: function (news, success, error) {
        Post("/admin/saveNews", news, success, error);
    },
    docByType: function (params, success, error) {
        Get("/admin/docByType", {
            type: params.type,
            currentPage: params.currentPage,
            pageSize: params.pageSize
        }, success, error);
    },
    delDoc: function (rid, success, error) {
        Post("/admin/delDoc", {rid: rid}, success, error);
    },
    docById: function (rid, success, error) {
        Get("/admin/docById", {rid: rid}, success, error);
    },
    saveDoc: function (doc, success, error) {
        Post("/admin/saveDoc", doc, success, error);
    },
    cutPic: function (url, cropData, success, error) {
        Post("/upload/coverCutting", {url: url, select: cropData}, success, error);
    },
    queryConsult: function (params, success, error) {
        Get("/admin/consult", {
            status: params.status,
            currentPage: params.currentPage,
            pageSize: params.pageSize
        }, success, error);
    },
    delConsult: function (rid, success, error) {
        Post("/admin/delConsult", {rid: rid}, success, error);
    },
    saveConsult: function (rid, answer, status, success, error) {
        Post("/admin/saveConsult", {rid: rid, answer: answer, status: status}, success, error);
    },
    querySuggest: function (params, success, error) {
        Get("/admin/suggest", {
            currentPage: params.currentPage,
            pageSize: params.pageSize
        }, success, error);
    },
    delSuggest: function (rid, success, error) {
        Post("/admin/delSuggest", {rid: rid}, success, error);
    },
    agencyByType: function (params, success, error) {
        Get("/admin/agencyByType", {
            type: params.type,
            currentPage: params.currentPage,
            pageSize: params.pageSize
        }, success, error);
    },
    contact: function (params, success, error) {
        Get("/admin/contact", {
            types: params.types,
            currentPage: params.currentPage,
            pageSize: params.pageSize
        }, success, error);
    },
    delAgency: function (rid, success, error) {
        Post("/admin/delAgency", {rid: rid}, success, error);
    },
    agencyById: function (rid, success, error) {
        Get("/admin/agencyById", {rid: rid}, success, error);
    },
    saveAgency: function (obj, success, error) {
        Post("/admin/saveAgency", obj, success, error);
    },
    saveContact: function (obj, success, error) {
        Post("/admin/saveContact", obj, success, error);
    },
    departmentList: function (success, error) {
        Get("/admin/departmentList", success, error);
    },
    saveDepartment: function (obj, success, error) {
        Post("/admin/saveDepartment", obj, success, error);
    },
    delDepartment: function (rid, success, error) {
        Post("/admin/delDepartment", {rid: rid}, success, error);
    },
    staffList: function (param, success, error) {
        Get("/admin/staffList", param, success, error);
    },
    delStaff: function (rid, success, error) {
        Post("/admin/delStaff", {rid: rid}, success, error);
    },
    staffById: function (rid, success, error) {
        Get("/admin/staffById", {rid: rid}, success, error);
    },
    saveStaff: function (obj, success, error) {
        Post("/admin/saveStaff", obj, success, error);
    },
    elegantList: function (params, success, error) {
        Get("/admin/elegantList", {
            type: params.type,
            currentPage: params.currentPage,
            pageSize: params.pageSize
        }, success, error);
    },
    elegantById: function (rid, success, error) {
        Get("/admin/elegantById", {rid: rid}, success, error);
    },
    saveElegant: function (obj, success, error) {
        Post("/admin/saveElegant", obj, success, error);
    },
    delElegant: function (rid, success, error) {
        Post("/admin/delElegant", {rid: rid}, success, error);
    },
    specificList: function (params, success, error) {
        Get("/admin/specificList", {
            currentPage: params.currentPage,
            pageSize: params.pageSize
        }, success, error);
    },
    delSpecific: function (rid, success, error) {
        Post("/admin/delSpecific", {rid: rid}, success, error);
    },
    saveSpecific: function (obj, success, error) {
        Post("/admin/saveSpecific", obj, success, error);
    },
    specificById: function (rid, success, error) {
        Get("/admin/specificById", {rid: rid}, success, error);
    },
    setting: function (success, error) {
        Get("/admin/setting",success, error);
    },
    saveSetting: function (obj, success, error) {
        Post("/admin/saveSetting", {setting:obj}, success, error);
    }

}
return API;
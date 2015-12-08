/*************************
 * 后台管理首页通用service
 * User: Becky
 * Date: 15-9-28
 * Time: 下午3:15
 ************************/
var express = require('express');
var router = express.Router();
var async = require("async");
var passport = require("passport");
var validate = require("./validate");
var menuDao = require("../model/adminMenuDao");
var newsDao = require("../model/newsDao");
var documentDao = require("../model/documentsDao");
var consultantDao = require("../model/consultantDao");
var adviceDao = require("../model/adviceDao");
var contactinfoDao = require("../model/contactinfoDao");
var departmentDao = require("../model/departmentDao");
var userDao = require("../model/usersDao");
var peoplesDao = require("../model/peoplesDao");
var activityDao = require("../model/activityDao");
var settingDao = require("../model/settingDao");
var opinionsDao = require("../model/opinionsDao");
var bookingDao = require("../model/bookingDao");
var adminDao = require("../model/adminDao");
var questionDao = require("../model/questionsDao");
var EmergencyDao = require("../model/emergencyDao");
var emergencyDao = new EmergencyDao();

router.get("/logout", function (req, res) {
    req.logOut();
    res.redirect("/backend/login.html");
});


/**********************************
 * 当前登录用户角色信息以及权限
 *********************************/
router.get("/userinfo", function (req, res) {
    var username = req.user.username;
    var nickname = req.user.nickname;
    var role_name = req.user.role_name;
    var roleId = req.user.roleId;
    var roleType = req.user.roleType;
    menuDao.queryMenus(roleId, function (err, menus) {
        if (err) return res.status(500).send("server error");
        res.send({
            code: 0,
            user: {username: username, nickname: nickname, role_name: role_name, roleType: roleType},
            menus: menus
        });
    });
});

router.get("/adminList", validate({
    pageSize: ["int", "required"],
    currentPage: ["int", "required"]
}), function (req, res) {
    var pageSize = req.pageSize;
    var currentPage = req.currentPage;
    adminDao.queryByPage(req.user.domainId, currentPage, pageSize, function (err, result) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, data: result});
    });
});

router.post("/delAdmin", validate({
        rid: ["int", "required"]
    }),
    function (req, res) {
        adminDao.delById(req.rid, req.user.domainId, function (err, result) {
            if (err) return res.status(500).send('server error');
            res.send({code: 0, data: result});
        });
    }
);

router.post("/saveAdmin", function (req, res) {
        var rid = req.param("rid");
        var nickname = req.param("nickname");
        var username = req.param("username");
        var password = req.param("password");
        var phone = req.param("phone");
        var role_id = req.param("role_id");
        var domainId = req.user.domainId;
        var obj = {
            rid: rid,
            username: username,
            phone: phone,
            nickname: nickname,
            role_id: role_id,
            domainId: domainId
        };

        async.waterfall([function (next) {
            adminDao.checkByName(obj.username, obj.domainId, function (err, rid) {
                next(err, rid);
            });
        }, function (rid, next) {
            if ((obj.rid && obj.rid == rid) || !rid) {       // 验证通过
                adminDao.save(obj, function (err, result) {
                    next(err, result);
                });
            } else {
                next(null, null);
            }
        }], function (err, result) {
            if (err) return res.status(500).send('server error');
            if (!result) {
                return res.send({code: 1});
            }
            res.send({code: 0, data: result});
        });

    }
);
router.post("/saveAdminPassword", function (req, res) {
        var rid = req.param("rid");
        var password = req.param("password");
        var domainId = req.user.domainId;
        var obj = {
            rid: rid,
            password: password,
            domainId: domainId
        };
        adminDao.savePassword(obj, function (err, result) {
            if (err) return res.status(500).send('server error');
            res.send({code: 0, data: result});
        });
    }
);

router.get("/adminById", validate({
    rid: ["int", "required"]
}), function (req, res) {
    adminDao.queryById(req.rid, req.user.domainId, function (err, obj) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, data: obj ? obj : null});
    });
});


/**********************************
 * 民意征集
 *********************************/
router.get("/opinion", validate({
    pageSize: ["int", "required"],
    currentPage: ["int", "required"]
}), function (req, res) {
    var type = req.param("type", 1);
    var pageSize = req.pageSize;
    var currentPage = req.currentPage;
    opinionsDao.queryByPage(type, req.user.domainId, currentPage, pageSize, function (err, result) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, data: result});
    });
});
router.post("/delOpinion", validate({
        rid: ["int", "required"]
    }),
    function (req, res) {
        opinionsDao.delById(req.rid, req.user.domainId, function (err, result) {
            if (err) return res.status(500).send('server error');
            res.send({code: 0, data: result});
        });
    }
);

router.get("/opinionById", validate({
    rid: ["int", "required"]
}), function (req, res) {
    opinionsDao.queryById(req.rid, req.user.domainId, function (err, obj) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, data: obj ? obj : null});
    });
});

router.post("/saveOpinion", function (req, res) {
        var rid = req.param("rid");
        var title = req.param("title");
        var type = req.param("type", 1);
        var cover = req.param("cover");
        var domainId = req.user.domainId;
        opinionsDao.save({
            rid: rid,
            domainId: domainId,
            publisher: req.user.username,
            title: title,
            type: type,
            cover: cover
        }, function (err, result) {
            if (err) return res.status(500).send('server error');
            res.send({code: 0, data: result});
        });
    }
);

router.post("/updateOpinion", function (req, res) {
        var opinion = req.param("opinion", {});
        opinion.domainId = req.user.domainId;
        opinionsDao.save(opinion, function (err, result) {
            if (err) return res.status(500).send('server error');
            res.send({code: 0, data: result});
        });
    }
);

/**********************************
 * 预约办事
 *********************************/
router.get("/book", validate({
    pageSize: ["int", "required"],
    currentPage: ["int", "required"]
}), function (req, res) {
    var pageSize = req.pageSize;
    var currentPage = req.currentPage;
    bookingDao.queryByPage(req.user.domainId, currentPage, pageSize, function (err, result) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, data: result});
    });
});

router.post("/updateBooking", function (req, res) {
        var book = req.param("book", {});
        book.domainId = req.user.domainId;
        bookingDao.save(book, function (err, result) {
            if (err) return res.status(500).send('server error');
            res.send({code: 0, data: result});
        });
    }
);
router.post("/delBook", validate({
        rid: ["int", "required"]
    }),
    function (req, res) {
        bookingDao.delById(req.rid, req.user.domainId, function (err, result) {
            if (err) return res.status(500).send('server error');
            res.send({code: 0, data: result});
        });
    }
);

// ======================= 随手拍 Start============================ //
router.get("/emergency", validate({
    pageSize: ["int", "required"],
    currentPage: ["int", "required"]
}), function (req, res) {
    var pageSize = req.pageSize;
    var currentPage = req.currentPage;
    emergencyDao.queryByPage(req.user.domainId, currentPage, pageSize, function (err, result) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, data: result});
    });
});

router.get("/emergencyById", validate({
    rid: ["int", "required"]
}), function (req, res) {
    emergencyDao.queryById(req.rid, req.user.domainId, function (err, obj) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, data: obj ? obj : null});
    });
});

router.post("/delEmergency", validate({
        rid: ["int", "required"]
    }),
    function (req, res) {
        emergencyDao.delById(req.rid, req.user.domainId, function (err, result) {
            if (err) return res.status(500).send('server error');
            res.send({code: 0, data: result});
        });
    }
);

router.get("/newByType", validate({
    type: ["int", "required"],
    pageSize: ["int", "required"],
    currentPage: ["int", "required"]
}), function (req, res) {
    var type = req.type;
    var pageSize = req.pageSize;
    var currentPage = req.currentPage;
    newsDao.queryByPage(type, req.user.domainId, currentPage, pageSize, function (err, result) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, data: result});
    });
});

router.post("/delNews", validate({
        rid: ["int", "required"]
    }),
    function (req, res) {
        newsDao.delById(req.rid, req.user.domainId, function (err, result) {
            if (err) return res.status(500).send('server error');
            res.send({code: 0, data: result});
        });
    }
);

router.post("/saveNews", function (req, res) {
        var rid = req.param("rid");
        var content = req.param("content");
        var title = req.param("title");
        var type = req.param("type");
        var newsImage = req.param("newsImage");
        var domainId = req.user.domainId;
        newsDao.save({
            rid: rid,
            domainId: domainId,
            content: content,
            title: title,
            type: type,
            publisher: req.user.nickname,
            newsImage: newsImage
        }, function (err, result) {
            if (err) return res.status(500).send('server error');
            res.send({code: 0, data: result});
        });
    }
);

router.get("/newById", validate({
    rid: ["int", "required"]
}), function (req, res) {
    newsDao.queryNewsById(req.rid, req.user.domainId, function (err, obj) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, data: obj ? obj : null});
    });
});


/******************
 *
 ****************/
router.get("/docByType", validate({
    type: ["int", "required"],
    pageSize: ["int", "required"],
    currentPage: ["int", "required"]
}), function (req, res) {
    var type = req.type;
    var pageSize = req.pageSize;
    var currentPage = req.currentPage;
    documentDao.queryByPage(type, req.user.domainId, currentPage, pageSize, function (err, result) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, data: result});
    });
});

router.post("/delDoc", validate({
        rid: ["int", "required"]
    }),
    function (req, res) {
        documentDao.delById(req.rid, req.user.domainId, function (err, result) {
            if (err) return res.status(500).send('server error');
            res.send({code: 0, data: result});
        });
    }
);

router.post("/saveDoc", function (req, res) {
        var rid = req.param("rid");
        var content = req.param("content");
        var title = req.param("title");
        var type = req.param("type");
        var domainId = req.user.domainId;
        documentDao.save({
            rid: rid,
            domainId: domainId,
            content: content,
            title: title,
            publisher: req.user.nickname,
            type: type
        }, function (err, result) {
            if (err) return res.status(500).send('server error');
            res.send({code: 0, data: result});
        });
    }
);

router.get("/docById", validate({
    rid: ["int", "required"]
}), function (req, res) {
    documentDao.queryById(req.rid, req.user.domainId, function (err, obj) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, data: obj ? obj : null});
    });
});

router.get("/consult", validate({
    status: ["required"],
    pageSize: ["int", "required"],
    currentPage: ["int", "required"]
}), function (req, res) {
    var domainId = req.user.domainId;
    consultantDao.queryByPage(req.status, domainId, req.currentPage, req.pageSize, function (err, data) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, data: data});
    });
});

router.post("/delConsult", validate({
        rid: ["int", "required"]
    }),
    function (req, res) {
        consultantDao.delById(req.rid, req.user.domainId, function (err, result) {
            if (err) return res.status(500).send('server error');
            res.send({code: 0, data: result});
        });
    }
);
router.post("/saveConsult", validate({
        rid: ["int", "required"],
        answer: ["required"],
        status: ["required"]
    }),
    function (req, res) {
        consultantDao.update({
            rid: req.rid,
            answer: req.answer,
            status: req.status,
            domainId: req.user.domainId,
            answerDate: new Date()
        }, function (err, result) {
            if (err) return res.status(500).send('server error');
            res.send({code: 0});
        });
    }
);

router.get("/suggest", validate({
    pageSize: ["int", "required"],
    currentPage: ["int", "required"]
}), function (req, res) {
    var pageSize = req.pageSize;
    var currentPage = req.currentPage;
    adviceDao.queryByPage(req.user.domainId, currentPage, pageSize, function (err, result) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, data: result});
    });
});
router.post("/delSuggest", validate({
        rid: ["int", "required"]
    }),
    function (req, res) {
        adviceDao.delById(req.rid, req.user.domainId, function (err, result) {
            if (err) return res.status(500).send('server error');
            res.send({code: 0, data: result});
        });
    }
);

router.get("/agencyByType", validate({
    type: ["int", "required"],
    pageSize: ["int", "required"],
    currentPage: ["int", "required"]
}), function (req, res) {
    var type = req.type;
    var pageSize = req.pageSize;
    var currentPage = req.currentPage;
    contactinfoDao.queryByPage(type, req.user.domainId, currentPage, pageSize, function (err, result) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, data: result});
    });
});

router.get("/contact", validate({
    pageSize: ["int", "required"],
    currentPage: ["int", "required"]
}), function (req, res) {
    var types = req.param("types");
    var pageSize = req.pageSize;
    var currentPage = req.currentPage;
    contactinfoDao.queryByContact(types, req.user.domainId, currentPage, pageSize, function (err, result) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, data: result});
    });
});

router.post("/delAgency", validate({
        rid: ["int", "required"]
    }),
    function (req, res) {
        contactinfoDao.delById(req.rid, req.user.domainId, function (err, result) {
            if (err) return res.status(500).send('server error');
            res.send({code: 0, data: result});
        });
    }
);

router.post("/saveAgency", validate({
        type: ["int", "required"],
        address: ["required"],
        department: ["required"],
        lat: ["required"],
        lng: ["required"]
    }), function (req, res) {
        var rid = req.param("rid");
        var tel = req.param("tel");
        var title = req.param("title");
        var contactMan = req.param("contactMan");
        var listOrder = req.param("listOrder");
        var domainId = req.user.domainId;
        contactinfoDao.save({
            rid: rid,
            domainId: domainId,
            title: title,
            contactMan: contactMan,
            address: req.address,
            tel: tel,
            type: req.type,
            department: req.department,
            lng: req.lng,
            lat: req.lat,
            listOrder: listOrder || undefined
        }, function (err, result) {
            if (err) return res.status(500).send('server error');
            res.send({code: 0, data: result});
        });
    }
);

router.post("/saveContact", validate({
        type: ["int", "required"],
        department: ["required"],
        tel: ["required"],
        title: ["required"],
        groupName: ["required"],
        contactMan: ["required"]
    }), function (req, res) {
        var rid = req.param("rid");
        var listOrder = req.param("listOrder");
        var domainId = req.user.domainId;
        contactinfoDao.save({
            rid: rid,
            domainId: domainId,
            title: req.title,
            tel: req.tel,
            type: req.type,
            department: req.department,
            contactMan: req.contactMan,
            groupName: req.groupName,
            listOrder: listOrder || undefined
        }, function (err, result) {
            if (err) return res.status(500).send('server error');
            res.send({code: 0, data: result});
        });
    }
);

router.get("/agencyById", validate({
    rid: ["int", "required"]
}), function (req, res) {
    contactinfoDao.queryById(req.rid, req.user.domainId, function (err, obj) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, data: obj ? obj : null});
    });
});

router.get("/departmentList", function (req, res) {
    departmentDao.queryList(req.user.domainId, function (err, departments) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, data: departments});
    });
});

router.get("/surveyGroup", function (req, res) {
    questionDao.queryList(req.user.domainId, function (err, departments) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, data: departments});
    });
});

router.post("/saveQuestionGroup", function (req, res) {
    var group = req.param("group");
    var domainId = req.user.domainId;
    group.domainId = domainId;
    questionDao.saveGroup(group, function (err, result) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, rid: result.insertId});
    });
});

router.post("/delQuestionGroup", function (req, res) {
    var groupId = req.param("groupId");
    questionDao.delById(groupId, req.user.domainId, function (err, departments) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0});
    });
});

router.post("/delQuestion", function (req, res) {
    var rid = req.param("questionId");
    questionDao.delQuestionById(rid, req.user.domainId, function (err, result) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0});
    });
});

router.get("/questionList", validate({
    pageSize: ["int", "required"],
    currentPage: ["int", "required"]
}), function (req, res) {
    var pageSize = req.pageSize;
    var currentPage = req.currentPage;
    var groupId = req.param("groupId", -1);
    questionDao.queryByPage(req.user.domainId, groupId, currentPage, pageSize, function (err, result) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, data: result});
    });
});
router.get("/questionCalc", validate({
    pageSize: ["int", "required"],
    currentPage: ["int", "required"]
}), function (req, res) {
    var pageSize = req.pageSize;
    var currentPage = req.currentPage;
    var groupId = req.param("groupId", -1);
    questionDao.questionCalc(groupId,req.user.domainId,currentPage, pageSize, function (err, result) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, data: result});
    });
});

router.get("/questionById", validate({
    rid: ["int", "required"]
}), function (req, res) {
    questionDao.queryById(req.rid, req.user.domainId, function (err, obj) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, data: obj ? obj : null});
    });
});

router.post("/saveQuestion",
    function (req, res) {
        var rid = req.param("rid", 0);
        var title = req.param("title");
        var groupId = req.param("groupId");
        var labelA = req.param("labelA", null);
        var labelB = req.param("labelB", null);
        var labelC = req.param("labelC", null);
        var labelD = req.param("labelD", null);
        var labelE = req.param("labelE", null);
        var labelF = req.param("labelF", null);
        var domainId = req.user.domainId;
        questionDao.save({
            rid: (rid == "0") ? 0 : rid,
            title: title,
            groupId: groupId,
            labelA: labelA,
            labelB: labelB,
            labelC: labelC,
            labelD: labelD,
            labelE: labelE,
            labelF: labelF,
            domainId: domainId
        }, function (err, result) {
            if (err) return res.status(500).send('server error');
            res.send({code: 0, rid: result.insertId});
        });
    }
)

router.post("/saveDepartment", validate({
        department: ["required"],
        starLevel: ["required"],
        managerLevel: ["required"]
    }),
    function (req, res) {
        var rid = req.param("rid", 0);
        var department = req.department;
        var starLevel = req.starLevel;
        var managerLevel = req.managerLevel;
        var departmentOrder = req.param("departmentOrder", 1);
        var parentId = req.param("parentId");
        var domainId = req.user.domainId;
        departmentDao.save({
            rid: (rid == "0") ? 0 : rid,
            department: department,
            starLevel: starLevel,
            managerLevel: managerLevel,
            departmentOrder: departmentOrder,
            parentId: parentId,
            domainId: domainId
        }, function (err, result) {
            if (err) return res.status(500).send('server error');
            res.send({code: 0, rid: result.insertId});
        });
    }
)

router.post("/delDepartment", validate({
        rid: ["int", "required"]
    }),
    function (req, res) {
        departmentDao.delById(req.rid, req.user.domainId, function (err, result) {
            if (err) return res.status(500).send('server error');
            res.send({code: 0, data: result});
        });
    }
);

router.get("/staffList", validate({
    pageSize: ["int", "required"],
    currentPage: ["int", "required"]
}), function (req, res) {
    var pageSize = req.pageSize || 10;
    var currentPage = req.currentPage || 1;
    var username = req.param("username", '');
    var departmentId = req.param("departmentId", '0');
    var domainId = req.user.domainId;
    userDao.queryByPage(domainId, departmentId, username, currentPage, pageSize, function (err, result) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, data: result});
    });
});

router.post("/delStaff", validate({
        rid: ["int", "required"]
    }),
    function (req, res) {
        userDao.delById(req.rid, req.user.domainId, function (err, result) {
            if (err) return res.status(500).send('server error');
            res.send({code: 0, data: result});
        });
    }
);

router.get("/staffById", validate({
    rid: ["int", "required"]
}), function (req, res) {
    userDao.queryById(req.rid, req.user.domainId, function (err, obj) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, data: obj});
    });
});

router.post("/saveStaff", validate({
        username: ["required"],
        password: ["required"],
        departmentId: ["required"],
        politics: ["required"],
        title: ["required"],
        role: ["required"],
        mobile: ["required"]
    }),
    function (req, res) {
        var rid = req.param("rid", 0);
        var photo = req.param("photo", "");
        var listOrder = req.param("listOrder", 0);
        userDao.save({
            rid: (rid == "0") ? 0 : rid,
            username: req.username,
            password: req.password,
            photo: photo,
            departmentId: req.departmentId,
            politics: req.politics,
            title: req.title,
            role: req.role,
            mobile: req.mobile,
            listOrder: listOrder,
            domainId: req.user.domainId
        }, function (err, result) {
            if (err) return res.status(500).send('server error');
            res.send({code: 0, rid: result.insertId});
        });
    }
)

router.get("/elegantList", validate({
    type: ["int", "required"],
    pageSize: ["int", "required"],
    currentPage: ["int", "required"]
}), function (req, res) {
    var type = req.type;
    var pageSize = req.pageSize;
    var currentPage = req.currentPage;
    peoplesDao.queryByPage(type, req.user.domainId, currentPage, pageSize, function (err, result) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, data: result});
    });
});

router.get("/elegantById", validate({
    rid: ["int", "required"]
}), function (req, res) {
    peoplesDao.queryById(req.rid, req.user.domainId, function (err, obj) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, data: obj});
    });
});

router.post("/saveElegant", validate({
        name: ["required"],
        photo: ["required"],
        department: ["required"],
        politics: ["required"],
        title: ["required"],
        sex: ["required"],
        content: ["required"]
    }),
    function (req, res) {
        var rid = req.param("rid", 0);
        var listOrder = req.param("listOrder", 1);
        peoplesDao.save({
            rid: (rid == "0") ? 0 : rid,
            name: req.name,
            sex: req.sex,
            photo: req.photo,
            department: req.department,
            politics: req.politics,
            title: req.title,
            content: req.content,
            listOrder: listOrder,
            domainId: req.user.domainId
        }, function (err, result) {
            if (err) return res.status(500).send('server error');
            res.send({code: 0, rid: result.insertId});
        });
    }
)

router.post("/delElegant", validate({
        rid: ["int", "required"]
    }),
    function (req, res) {
        peoplesDao.delById(req.rid, req.user.domainId, function (err, result) {
            if (err) return res.status(500).send('server error');
            res.send({code: 0, data: result});
        });
    }
);

router.get("/specificList", validate({
    pageSize: ["int", "required"],
    currentPage: ["int", "required"]
}), function (req, res) {
    var pageSize = req.pageSize || 10;
    var currentPage = req.currentPage || 1;
    var domainId = req.user.domainId;
    activityDao.queryByPage(domainId, currentPage, pageSize, function (err, result) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, data: result});
    });
});

router.post("/saveSpecific", validate({
        status: ["required"]
    }),
    function (req, res) {
        var rid = req.param("rid", 0);
        var activityName = req.param("activityName");
        var status = req.status;
        activityDao.save({
            rid: (rid == "0") ? 0 : rid,
            activityName: activityName,
            status: status,
            domainId: req.user.domainId
        }, function (err, result) {
            if (err) return res.status(500).send('server error');
            res.send({code: 0, rid: result.insertId});
        });
    }
)
router.post("/delSpecific", validate({
        rid: ["int", "required"]
    }),
    function (req, res) {
        activityDao.delById(req.rid, req.user.domainId, function (err, result) {
            if (err) return res.status(500).send('server error');
            res.send({code: 0, data: result});
        });
    }
);

router.get("/specificById", validate({
    rid: ["int", "required"]
}), function (req, res) {
    activityDao.queryById(req.rid, req.user.domainId, function (err, obj) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, data: obj});
    });
});

router.get("/setting", function (req, res) {
    settingDao.queryList(req.user.domainId, function (err, list) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, data: list});
    });
});
router.post("/saveSetting",
    function (req, res) {
        var obj = req.param("setting");
        obj.domainId = req.user.domainId;
        settingDao.save(obj, function (err, result) {
            if (err) return res.status(500).send('server error');
            res.send({code: 0, rid: result.insertId});
        });
    }
)

module.exports = router;




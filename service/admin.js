/*************************
 * 后台管理首页通用service
 * User: Becky
 * Date: 15-9-28
 * Time: 下午3:15
 ************************/
var express = require('express');
var router = express.Router();
var validate = require("./validate");
var AdminMenuDao = require("../model/adminMenuDao");
var menuDao = new AdminMenuDao();
var introductionDao = require("../model/introductionDao");
var NewsDao = require("../model/newsDao");
var newsDao = new NewsDao();
var DocumentDao = require("../model/documentsDao");
var documentDao = new DocumentDao();
var ConsultantDao = require("../model/consultantDao");
var consultantDao = new ConsultantDao();
var AdviceDao = require("../model/adviceDao");
var adviceDao = new AdviceDao();
var ContactinfoDao = require("../model/contactinfoDao");
var contactinfoDao = new ContactinfoDao();
var DepartmentDao = require("../model/departmentDao");
var departmentDao = new DepartmentDao();
var UserDao = require("../model/usersDao");
var userDao = new UserDao();
var PeoplesDao = require("../model/peoplesDao");
var peoplesDao = new PeoplesDao();
var ActivityDao = require("../model/activityDao");
var activityDao = new ActivityDao();
var SettingDao = require("../model/settingDao");
var settingDao = new SettingDao();

/**********************************
 * 当前登录用户角色信息以及权限
 *********************************/
router.get("/userinfo", function (req, res) {
    var username = req.user.username;
    var nickname = req.user.nickname;
    var role_name = req.user.role_name;
    var roleId = req.user.roleId;
    menuDao.queryMenus(roleId, function (err, menus) {
        if (err) return res.status(500).send("server error");
        res.send({code: 0, user: {username: username, nickname: nickname, role_name: role_name}, menus: menus});
    });
});

/**********************************
 * 机构简介
 *********************************/
router.get("/introduction", validate({
    type: ["int", "required"]
}), function (req, res) {
    var domainId = req.user.domainId;
    var type = req.type;
    introductionDao.queryUnique(type, domainId, function (err, intr) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, data: intr ? intr : null});
    });
});

/**********************************
 * 保存机构简介
 *********************************/
router.post("/saveintro", validate({
    type: ["int", "required"]
}), function (req, res) {
    var rid = req.param("rid");
    var type = req.param("type");
    var introduction = req.param("introduction");
    introductionDao.save({
        rid: rid,
        introduction: introduction,
        domainId: req.user.domainId,
        type: type
    }, function (err, result) {
        if (err) return res.status(500).send('server error');
        res.send({code: 0, rid: result.insertId});
    });
});

router.get("/logout", function (req, res) {
    req.logOut();
    res.redirect("/backend/login.html");
});

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
        var listOrder = req.param("listOrder");
        var domainId = req.user.domainId;
        contactinfoDao.save({
            rid: rid,
            domainId: domainId,
            title: req.title,
            address: req.address,
            tel: tel,
            type: req.type,
            department: req.department,
            contactMan: req.contactMan,
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
        var departmentOrder = req.param("departmentOrder",1);
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




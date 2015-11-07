var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var compression = require('compression');
var weixin = require('./service/weixin');
var wechat = require('./service/wechat');
var weixinUtil = require('./util/weixinUtil');
var ipService = require('./util/ipService');

var db = require('./model/db.js');
var cfg = require('./conf/serverConfig');

var app = express();
var redis = require("./model/redisDB");
var RedisStore = require('connect-redis')(session);

app.disable("x-powered-by");
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.query());
app.use("/app", session({
    secret: 'wegov_session',
    cookie: { maxAge: 30 * 24 * 3600 * 1000},
    key: "backend.sid",
    saveUninitialized: true,
    rolling: true,
    store: new RedisStore({
        host: cfg.redisCache.host,
        port: cfg.redisCache.port,
        db: cfg.redisCache.db,
        pass: cfg.redisCache.password
    })
}));
app.use(/^(\/backend|\/editor).*/, session({
    secret: 'wegov_session',
    cookie: { maxAge: 30*60 * 1000},
    key: "backend.sid",
    saveUninitialized: true,
    rolling: true,
    store: new RedisStore({
        host: cfg.redisCache.host,
        port: cfg.redisCache.port,
        db: cfg.redisCache.db,
        pass: cfg.redisCache.password
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
    if (req.user || !(/^(\/backend)+.*(index.html)$/.test(req.url))) {
        return  next();
    } else {
        res.redirect("/backend/login.html");
    }
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'pictures')));
app.use('/backend/login', function (req, res, next) {
    var remember = req.param("remember");
    passport.authenticate('local', function (err, user) {
        if (err) return res.send('server error').status(500);
        if (!user) return res.send({code: 1, message: "login fail"});        // 账号或密码错误
        req.logIn(user, function (err) {
            if (err) return res.send('server error').status(500);
            res.send({code: 0, message: "login success"});
        });
    })(req, res, next);
});

app.use('/wechat', wechat);

[ 'upload', 'lbs', 'common', 'clients', 'news',
    'documents','singlePage', 'peoples', 'users', 'contactinfo', 'advice',
    'menu', 'consultant', 'weixin'].forEach(function (module) {
        app.use('/app/' + module, require('./service/' + module));
    }
);

app.use("*", ensureAuthenticated, function (req, res, next) {
    next();
});
[ 'admin', 'editor','upload'].forEach(function (module) {
        app.use('/backend/' + module, require('./service/' + module));
    }
);
passport.use(new LocalStrategy(
    function (username, password, done) {
        process.nextTick(function () {
            var sql = "select u.rid,u.domainId,u.username,u.nickname,r.rid as roleId,r.role_name from wg_adminuser u inner join wg_role r on (r.rid = u.role_id) where username = ? and password = md5(?) ";
            excute(sql, [username, password], function (err, data) {
                return done(err, err || (data && data[0]));
            });
        });
    }
));

app.use(function (req, res, next) {
    var err = new Error('Not Found:' + req.path);
    res.status(404).send(err.message);
});
app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.send(err.message);
});

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.logOut();
        if (req.headers['x-requested-with'] && req.headers['x-requested-with'].toLowerCase() == 'xmlhttprequest') {
            res.status(401).send("没有访问授权!");
        } else {
            if (/.*(\.html|\.htm)$/.test(req.baseUrl)) {
                res.redirect("/backend/login.html");
            } else {
                res.status(404).send("not founded" + req.baseUrl);
            }
        }
    }
}
weixinUtil.createAccessTokenSchedule();

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});
app.listen(cfg.port, function () {
    console.info('http server started ' + cfg.port);
});

var MenuDao = require("./model/menuDao");
var menu = new MenuDao();

module.exports = app;

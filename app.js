var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var compression = require('compression');
var weixin = require('./service/weixin');
var wechat = require('./service/wechat');
var cfg = require('./conf/server');
var server = require('./init');
var log4js = require('log4js');
var logger = require('./util/logger').logger(__filename);

var express = require('express');
var app = express();

app.disable("x-powered-by");
app.use(log4js.connectLogger(logger, {level: log4js.levels.DEBUG, format: ':method :url'}));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.query());
app.use("/"+cfg.app_name+"/app", session({
    secret: 'wegov_session',
    cookie: { maxAge: 30 * 24 * 3600 * 1000},
    key: "backend.sid",
    saveUninitialized: true,
    rolling: true,
    store: new RedisStore({
        host: cfg.redis.host,
        port: cfg.redis.port,
        db: cfg.redis.session,
        pass: cfg.redis.password
    })
}));
app.use(/^\/nanyuan(\/backend|\/editor).*/, session({
    secret: 'wegov_session',
    cookie: { maxAge: 30*60 * 1000},
    key: "backend.sid",
    saveUninitialized: true,
    rolling: true,
    store: new RedisStore({
        host: cfg.redis.host,
        port: cfg.redis.port,
        db: cfg.redis.session,
        pass: cfg.redis.password
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
    if (req.user || !(/^\/nanyuan(\/backend)+.*(index.html)$/.test(req.url))) {
        return  next();
    } else {
        res.redirect("/"+cfg.app_name+"/backend/login.html");
    }
});
app.use("/"+cfg.app_name,express.static(path.join(__dirname, 'public')));
app.use("/"+cfg.app_name,express.static(path.join(__dirname, 'pictures')));
app.use("/"+cfg.app_name+'/backend/login', function (req, res, next) {
    passport.authenticate('local', function (err, user) {
        if (err) return res.status(500).send('server error');
        if (!user) return res.send({code: 1, message: "login fail"});        // 账号或密码错误
        req.logIn(user, function (err) {
            if (err) return res.status(500).send('server error');
            res.send({code: 0, message: "login success"});
        });
    })(req, res, next);
});
app.use("/"+cfg.app_name+'/wechat', wechat);
[ 'upload', 'lbs', 'common', 'clients', 'news',
    'documents','singlePage', 'peoples', 'users', 'contactinfo', 'advice',
    'menu', 'consultant','emergency','opinions','question', 'weixin'].forEach(function (module) {
        app.use("/"+cfg.app_name+'/app/' + module, require('./service/' + module));
    }
);
app.use("*", ensureAuthenticated, function (req, res, next) {
    next();
});
[ 'admin', 'editor','upload'].forEach(function (module) {
        app.use("/"+cfg.app_name+'/backend/' + module, require('./service/' + module));
    }
);
app.use(function (req, res, next) {
    var err = new Error('Not Found:' + req.path);
    res.status(404).send(err.message);
});
app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.send(err.message);
});
passport.use(new LocalStrategy(
    function (username, password, done) {
        process.nextTick(function () {
            var sql = "select u.rid,u.domainId,u.username,u.nickname,r.rid as roleId,r.role_name from wg_adminuser u inner join wg_role r on (r.rid = u.role_id) where username = ? and password = md5(?) ";
            excute(sql, [username, password], function (err, data) {
                console.log(err);
                return done(err, err || (data && data[0]));
            });
        });
    }
));
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
                res.redirect("/"+cfg.app_name+"/backend/login.html");
            } else {
                res.status(404).send("not founded" + req.baseUrl);
            }
        }
    }
}
process.on('uncaughtException', function (err) {
    logger.error('Caught exception: ' + err);
});
app.listen(cfg.port, function () {
    logger.info('http server started ' + cfg.port);
});
server.start();


module.exports = app;

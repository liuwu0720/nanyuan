var express = require('express');
var router = express.Router();
var util = require('util');
var formidable = require('formidable');
var gm = require('gm');
var commUtil = require('../util/commUtil');
var weixinUtil = require('../util/weixinUtil.js');
var fs = require('fs');
var ffmpeg = require('ffmpeg-node');
var photosDao = require('../model/photosDao.js');
var MAX_SIZE = 1137;
var TITLE_IMAGE_SIZE = 300;

router.post('/image', function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.uploadDir = 'public/repository/';
    form.keepExtensions = true;
    var isCover = req.param('isCover');
    var isLogo = req.param('isLogo');
    res.setHeader("Content-Type","text/json;charset=UTF-8");           // 兼容IE8
    form.parse(req, function (err, fields, files) {
        if ((!files.Filedata) || (!files.Filedata.name)) {
            res.send({errorCode: 10});
            return;
        }
        var result = {};
        var subDir = commUtil.fromDateToStr(new Date(), 'yyyyMMdd');
        result.originalFileName = files.Filedata.name;
        result.fileName = files.Filedata.path.substring(18);
        result.path = 'public/repository/' + subDir + '/';
        result.filePath = result.path + result.fileName;
        result.fileUrl = '/repository/' + subDir + '/' + result.fileName;

        function convert() {
            var gmFile = gm(files.Filedata.path);
            gmFile.size(function (err, value) {
                if (err) {
                    fs.unlink(files.Filedata.path);
                    res.send({errorCode: 1});
                    return;
                }
                var varSize = value.width > value.height ? value.width : value.height;
                if (isCover || isLogo) {
                    gmFile.thumb(TITLE_IMAGE_SIZE, TITLE_IMAGE_SIZE, result.filePath, 50, function (err) {
                        if (err) {
                            fs.unlink(files.Filedata.path);
                            res.send({errorCode: 2});
                        }
                        else {
                            fs.unlink(files.Filedata.path);
                            res.send(result);
                        }
                    });
                } else {
                    if (varSize > MAX_SIZE) {
                        gmFile = gmFile.resize(MAX_SIZE, MAX_SIZE);
                    } else {
                        gmFile = gmFile.compress('None');
                        gmFile.autoOrient();
                    }
                    gmFile.write(result.filePath, function (err) {
                        if (err) {
                            fs.unlink(files.Filedata.path);
                            res.send({errorCode: 3});
                        }
                        else {
                            fs.unlink(files.Filedata.path);
                            res.send(result);
                        }
                    });
                }
            });
        }

        fs.exists(result.path, function (exists) {
            if (exists) {
                convert();
            }
            else {
                fs.mkdir(result.path, function () {
                    convert();
                });
            }
        });
    });
});

router.post('/miusic', function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.uploadDir = 'public/repository/';
    form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {
        if ((!files.Filedata) || (!files.Filedata.name)) {
            res.send({errorCode: 10});
            return;
        }
        var result = {};
        var subDir = null;
        if (fields.rid) {
            subDir = fields.rid + '';
        }
        else {
            subDir = commUtil.fromDateToStr(new Date(), 'yyyyMMdd');//请与贵网站订单系统中的唯一订单号匹配
        }
        result.originalFileName = files.Filedata.name;
        result.fileName = files.Filedata.path.substring(12);
        result.path = 'public/repository/' + subDir + '/';
        result.filePath = result.path + result.fileName;
        result.fileUrl = '/repository/' + subDir + '/' + result.fileName;

        function convertMusic() {
            ffmpeg.exec(
                // -y -i song1.mp3 -ab 24000 -ar 22050 song001.wma
                ['-y', '-i', files.Filedata.path, '-ab', '24000', '-ar', '22050', '-fs', '1024K', result.filePath],                 // array of ffmpeg flags
                function onCompleted() {
                    fs.unlink(files.Filedata.path);
                    fs.exists(result.filePath, function (exists) {
                        if (exists) {
                            res.send(result);
                        } else {
                            res.send({errorCode: 1});
                        }
                    });
                }
            );
        }

        fs.exists(result.path, function (exists) {
            if (exists) {
                convertMusic();
            }
            else {
                fs.mkdir(result.path, function () {
                    convertMusic();
                })
            }
        });
    });
});
function getNewUrl(url) {
    var findex = url.indexOf('_');
    var index = url.indexOf('.');
    var newUrl = null;
    if (findex > 0) {
        var count = 0;
        if (index - findex > 1) {
            count = parseInt(url.substring((findex + 1), index));
            count++;
        }
        var newUrl = url.substring(0, findex) + '_' + count + url.substring(index);
    } else {
        var newUrl = url.substring(0, index) + '_' + url.substring(index);
    }
    return newUrl;
}

router.post('/coverCutting', function (req, res, next) {
    var url = req.param("url");
    var newUrl = getNewUrl(url);
    var url = 'public' + url;
    var selectData = req.param("select");
    var gmFile = gm(url);
    gmFile.crop(selectData.w, selectData.h, selectData.x, selectData.y);
    gmFile.write(('public' + newUrl), function (err) {
        if (err) {
            res.send({code: 1});
        }
        else {
            res.send({code: 0, url: newUrl});
        }
    });
});

router.post('/coverRotate', function (req, res, next) {
    var url = req.param("url");
    var newUrl = getNewUrl(url);
    var url = 'public' + url;
    var gmFile = gm(url);
    gmFile.rotate('#000000', 90);
    gmFile.write(('public' + newUrl), function (err) {
        if (err) {
            console.log(err);
            res.send({code: 1});
        }
        else {
            res.send({code: 0, url: newUrl});
        }
    });
});

router.post('/getImageFromWeixin', function (req, res) {
    var serverIds = req.param("serverIds");
    var localIds = req.param("localIds");
    var data = req.param("data");
    var result={code:0};
    weixinUtil.retrieveImagesFromWeixin(serverIds,compressImageFile,function(urls){
        result.urls=urls;
        res.send(result);
        var fileHistory={clientId:data.clientId,localId:localIds[0],url:urls[0],creDate:new Date()};
        photosDao.addPhoto(fileHistory,function(){});
    });
});

function compressImageFile(filePath,newFilePath,cb) {
    var gmFile = gm(filePath);
    gmFile = gmFile.resize(MAX_SIZE, MAX_SIZE);
    gmFile = gmFile.compress('None');
    gmFile.write(newFilePath,function (err) {
        fs.unlink(filePath);
        if (err) {
            cb(false);
        }
        else {
            cb(true);
        }
    });
}

module.exports = router;

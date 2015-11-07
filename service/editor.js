/**
 *
 * User: becky
 * Date: 15-1-2
 * Time: 下午10:21
 *
 */
var express = require('express');
var router = express.Router();
var path = require("path");
var fs = require("fs");
var ueditor = require("ueditor");

router.all("/upload", ueditor(path.join(__dirname, '../pictures/editor/'), function (req, res) {
    var action = req.param("action");
    if (action == "config") {
        fs.readFile("./conf/ueditor.json", "utf-8", function (err, data) {
            res.send(data);
        })
    } else if (action == "uploadimage") {
        var foo = req.ueditor;
        var date = new Date();
        var imgname = req.ueditor.filename;
        var img_url = '';
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    }
}));

module.exports = router;




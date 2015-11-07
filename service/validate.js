/*****************
 * 参数验证中间件
 * User: Becky
 * Date: 2015/10/2
 * Time: 11:15
 *****************/

var validators = {
    int: /^[1-9][0-9]*$/,
    required: /^\S(.|\n)*\S?$/
};
module.exports = function (opts) {
    var options = {};
    opts && (options = _.extend(options, opts));
    return function (req, res, next) {
        var pageSize = req.param("pageSize");
        var currentPage = req.param("currentPage");
        var rid = req.param("rid");
        for (var key in options) {
            var val = req.param(key,"");
            var validator_list = options[key]
            if (typeof validator_list == "string") {
                validator_list = [validator_list];
            }
            for(var i=0;i<validator_list.length;i++){
                val =val.replace( /^\s+|\s+$/g,"");
                if (!val || !validators[validator_list[i]].test(val)) {
                    console.log(validators[validator_list[i]]+",val:"+val+",result:"+validators[validator_list[i]].test(val));
                    return res.status(400).send(key+"参数错误:"+val);
                }
                val = req[key] || val;
                if (validator_list[i] == "int") {
                    req[key] = parseInt(val);
                } else {
                    req[key] = val;
                }
            }
        }
        next();
    }
};

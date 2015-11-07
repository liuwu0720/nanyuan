/**
 * log4js 日志输出配置文件
 * @type {exports}
 */
var log4js = require('log4js');

log4js.configure({
    appenders: [
        {
            type: 'console',
            "level": "DEBUG"
        },
        {
            type: 'dateFile',
            "level": "INFO",
            filename: 'log/out',
            pattern: "_yyyy-MM-dd",
            maxLogSize: 1024,
            alwaysIncludePattern: false,
            backups: 4
        }
    ],
    replaceConsole: false
});

exports.logger = function (name) {
    var logger = log4js.getLogger(name);
    logger.setLevel(log4js.levels.INFO);
    return logger;
}

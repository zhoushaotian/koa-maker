// 系统日志
const log4js = require('log4js');
const fs = require('fs');
const defaultLogConfig = {
    ignoreConsole: false
}


module.exports = function (config) {
    
    return new Promise((resolve, reject) => {
        fs.exists(config.logDir, function(exists) {
            if(exists) {
                return resolve();
            }else {
                fs.mkdir(config.logDir, function(err) {
                    if(err) {
                        return reject(err);
                    }
                    resolve();
                })
            }
        })
    }).then(function() {
        return new Promise(function(resolve, reject) {
            const logger = log4js.configure(Object.assign({}, {
                appenders: { info: { type: 'file', filename: config.logDir + config.appName + 'info.log' }, debug: { type: 'file', filename: config.logDir + config.appName + 'debug.log'}, console: {type: 'console'}},
                categories: { default: { appenders: ['info', 'console'], level: 'info' }, debug: {appenders: ['debug', 'console'], level: 'debug'} }
            }, config.logConfig));
            const getLogger = function() {
                let logger = log4js.getLogger('default');
                logger.debug = log4js.getLogger('debug').debug;
                return logger;
            }
            resolve(getLogger());
        })
    })
}
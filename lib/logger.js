// 系统日志
const log4js = require('log4js');
const defaultLogConfig = {
    ignoreConsole: false
}


module.exports = function (config) {
    return new Promise((resolve, reject) => {
        const logger = log4js.configure(Object.assign({}, {
            appenders: { info: { type: 'file', filename: this.appDir + '/log/' + config.appName + 'info.log' }, debug: { type: 'file', filename: this.appDir + '/log/' + config.appName + 'debug.log'}},
            categories: { default: { appenders: ['info'], level: 'info' }, debug: {appenders: ['debug'], level: 'debug'} }
        }, config.logConfig));
        const getLogger = function() {
            let logger = log4js.getLogger('default');
            logger.debug = log4js.getLogger('debug').debug;
            return logger;
        }
        resolve(getLogger());
    })
}
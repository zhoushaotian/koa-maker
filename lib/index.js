const koa = require('koa');
const fs = require('fs');
const path = require('path');
const views = require('koa-views');
const koaStatic = require('koa-static');
const koaBody = require('koa-body');
const koaRouter = require('koa-better-router');

const log = require('./common/log');
const logger = require('./logger');
const moduleLoad = require('./common/load_module');
const bootServer = require('./boot');
const routes = require('./routes');



class KoaMaker {
    init(options) {
        this.appDir = '' || options.appDir;
        // 初始化框架模块
        return new Promise((resolve, reject) => {
            log.info('开始读取配置');
            // 拉取配置
            fs.exists(path.join(this.appDir, './config.json'), (exist) => {
                if(exist) {
                    fs.readFile(path.join(this.appDir, './config.json'), function(err, json) {
                        if(err) {
                            return reject(err);
                        }
                        let config = JSON.parse(json);
                        resolve(config);
                    })
                }else {
                    reject('没有配置文件');
                }
            });
        }).then((config) => {
            this.config = config;
            this.config.logDir = config.logDir ? config.logDir : '/logs/'
            log.success('读取配置成功');
            this.appName = this.config.appName || 'koa-app';
            log.info('开始初始化app');
            return this._initKoaApp();
        }).then(() => {
            log.success('初始化app成功');
            // 初始化日志
            return logger.call(this, this.config);
        }).then((logger) => {
            this.logger = logger;
            log.success('初始化log成功');
            log.info('开始初始化内置模块');
            // 初始化内置模块
        }).then(() => {
            // 初始化路由前过滤器
            log.info('初始化路由前过滤器');
            return moduleLoad(path.join(this.appDir, '/filters/preappend.js'));
        }).then(() => {
            log.success('初始化路由前过滤器成功');
            log.info('开始扫描路由');
            return routes.call(this, path.join(this.appDir, '/routes'));
        }).then(() => {
            log.success('路由挂载成功');
            log.info('开始初始化路由后过滤器');
            return moduleLoad(path.join(this.appDir, 'filters/append.js'));
        }).then(() => {
            log.success('初始化路由后过滤器成功');
            log.success('初始化成功');
        }).catch((err) => {
            log.error('初始化错误' + err);
        });
    }
    boot() {
        // 应用启动
        if(!this.app) {
            throw new Error('未执行初始化方法,请先进行应用初始化');
        }
        log.info('开始启动应用');
        return bootServer(this.app, {
            port: this.config.port
        });
    }
    _initKoaApp() {
        // 初始化koa应用的相关操作
        const app = new koa();
        const appDir = this.appDir; // app根目录
        const viewDir = path.join(this.appDir, 'views/'); // 模板目录
        this.getRouter = function(prefix) {
            return koaRouter({
                prefix
            }).loadMethods();
        }; // 挂载获取路由的方法
        log.info('路由方法挂载成功');
        // 模板引擎注册
        app.use(views(viewDir, {
            map: {
                hbs: 'handlebars'
            }
        }));
        // 静态文件目录
        app.use(koaStatic(path.join(appDir, 'static/')));
        // 公共中间件
        app.use(koaBody());
        this.app = app;
        return Promise.resolve();
    }
}

module.exports = KoaMaker;



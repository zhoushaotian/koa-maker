const fs = require('fs');
const recursive = require('recursive-readdir');

module.exports = function(path) {
    const app = this.app;
    return new Promise(function(resolve, reject) {
        fs.exists(path, function(exists) {
            if(exists) {
                recursive(path, function(err, files) {
                    if(err) {
                        return reject(err);
                    }
                    files.forEach(function(file) {
                        const route = require(file);
                        app.use(route.middleware());
                    });
                    resolve();
                })
            }else {
                resolve('未查询到路由，跳过该步骤');
            }
        })
    })
}


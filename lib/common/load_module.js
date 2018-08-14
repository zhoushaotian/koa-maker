const fs = require('fs');

module.exports = function(path) {
    return new Promise(function (resolve, reject) {
        fs.exists(path, function(exists) {
            if(exists) {
                require(path);
                resolve();
            }else{
                resolve('无目录，跳过该步骤');
            }
        })
    });
}
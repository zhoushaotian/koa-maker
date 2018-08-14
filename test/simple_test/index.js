const path = require('path');
const assert = require('power-assert');
const reload = require('require-reload');

module.exports = function(server) {
    let newServer = null;
    describe('new server instance', function() {
        it('new server', function() {
            newServer = reload('../../');
        });
        it('confirm new server', function() {
            assert(!newServer.app);
            assert(server);
            assert(server !== newServer);
        });
        it('init server', function() {
            return server.init({
                appDir: path.join(__dirname, '../init_test/simple')
            })
                .then(function() {
                    assert(server.app);
                    assert(server.appName === 'simple');
                    assert(server.logger);
                });
            
        })
    })
}
const path = require('path');
const assert = require('power-assert');
const reload = require('require-reload');
const request = require('supertest');

module.exports = function(server) {
    let newServer = null;
    describe('new server instance', function() {
        it('new server', function() {
            newServer = reload('../../');
            assert(newServer);
        });
        it('confirm new server', function() {
            assert(!newServer.app);
            assert(server);
            assert(server !== newServer);
        });
        it('init server', function(done) {
            newServer.init({
                appDir: path.join(__dirname, '../init_test/full_test/')
            })
                .then(function() {
                    assert(newServer.getRouter);
                    assert(newServer.app);
                    assert(newServer.appName === 'full-test');
                    assert(newServer.logger);
                    done();
                }).catch(function(err) {
                    done(err);
                });
        })
        it('routes', function() {
            assert(typeof newServer.getRouter === 'function');
            assert(newServer.getRouter().get && newServer.getRouter().post);
            assert(newServer.getRouter().getRoutes().length === 0);
        })
        it('app boot', function (done) {
            newServer.boot().then(function() {
                assert(newServer.app.listenBack);
                done();
            })
        })
        it('GET /api/', function(done) {
            request(newServer.app.listenBack)
                .get('/api/')
                .expect('content-type', 'application/json; charset=utf-8')
                .expect(200)
                .end(done)
        })
        it('POST /api/post', function(done) {
            let sendData = {
                name: 'koa',
                des: 'ok'
            }
            request(newServer.app.listenBack)
                .post('/api/post/')
                .send(sendData)
                .expect('content-type', 'application/json; charset=utf-8')
                .expect(function(res) {
                    assert(res.body.name === sendData.name);
                    assert(res.body.des === sendData.des); 
                })
                .expect(200)
                .end(done)
        })
    });
    
}
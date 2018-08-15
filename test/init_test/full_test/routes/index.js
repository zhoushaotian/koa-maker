const server = require('../../../../');
const routes = server.getRouter('/api');

routes.get('/', (ctx, next) => {
    ctx.body = {
        msg: 'hello world！'
    };
});

routes.post('/post', (ctx, next) => {
    ctx.body = ctx.request.body;
})
module.exports = routes;
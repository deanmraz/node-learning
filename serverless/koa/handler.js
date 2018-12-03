'use strict';

const serverless = require('serverless-http');
const koa = require('koa');
const app = new koa();
const Router = require('koa-router');


const logger = async (ctx, next) => {
  console.log('logging goes here')
  await next();
}

const after = async (ctx, next) => {
  await next();
  console.log('doing something after')
}
// application middlewares
app.use(logger);
app.use(after);


class Crud {
  async middleware (ctx, next) {
    console.log('do some controller middleware')
    await next();
  }
  async get (ctx, next) {
    console.log('get request');
    ctx.body = {
      data: {
        id: '1',
        type: 'cruds',
        attributes: {
          name: 'Crud One',
        }
      }
    }
  }
}

class User {
  async get (ctx, next) {
    console.log('get user');
    ctx.body = {
      data: {
        id: '1',
        type: 'users',
        attributes: {
          name: 'user One',
        }
      }
    }
  }
}

const CrudRoute = new Router({
  prefix: '/cruds'
});
const CurdController = new Crud;
CrudRoute.use(CurdController.middleware);
CrudRoute.get('/', CurdController.get);
app.use(CrudRoute.routes());
app.use(CrudRoute.allowedMethods());

const UserRoute = new Router({
  prefix: '/users'
});
UserRoute.get('/', (new User).get);
app.use(UserRoute.routes());


module.exports.hello = serverless(app);

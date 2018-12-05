'use strict';

const serverless = require('serverless-http');
const express = require('express');
const app = express();

// const logger = async (ctx, next) => {
//   console.log('logging goes here')
//   await next();
// }
//
// const after = async (ctx, next) => {
//   await next();
//   console.log('doing something after')
// }
// // application middlewares
// app.use(logger);
// app.use(after);


class Crud {
  // middleware (ctx, next) {
  //   console.log('do some controller middleware')
  //   await next();
  // }

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

const CrudRoute = express.Router();

CrudRoute.use(function (req, res, next) {
  console.log('do some controller middleware')
  next()
});

CrudRoute.get('/', function(req, res) {
  console.log('get request');
  res.send(JSON.stringify({
    data: {
      id: '1',
      type: 'cruds',
      attributes: {
        name: 'Crud One',
      }
    }
  }))
})

app.use('/cruds', CrudRoute);
// app.use(CrudRoute.allowedMethods());
//
// const UserRoute = new Router({
//   prefix: '/users'
// });
// UserRoute.get('/', (new User).get);
// app.use(UserRoute.routes());




module.exports.hello = serverless(app);

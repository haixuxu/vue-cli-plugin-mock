# vue-cli-plugin-mock

![Build Status](https://img.shields.io/github/workflow/status/xuxihai123/vue-cli-plugin-mock/test/master)
![Npm Version](https://img.shields.io/npm/v/vue-cli-plugin-mock)
![License](https://img.shields.io/npm/l/vue-cli-plugin-mock)

A package for local mock data functionality

- Simple writing(Express.js style)
- watch file change
- auto reload mock server
- support esm/cjs style Module

## Install

```bash
yarn add vue-cli-plugin-mock
```

## Install with vue-cli3

```bash
vue add vue-cli-plugin-mock
```

## example app

https://github.com/xuxihai123/vue-cli-mock-example

## Usage

1. writing a entry file. for examples ./mock/index.js

- mock code example one

```js
const mockMap = {
  'GET /api/user': {
    // obj
    id: 1,
    username: 'kenny',
    sex: 6,
  },
  'GET /api/user/list': [
    // array
    {
      id: 1,
      username: 'kenny',
      sex: 6,
    },
    {
      id: 2,
      username: 'kenny',
      sex: 6,
    },
  ],
  'POST /api/login/account': (req, res) => {
    // express router style
    const { password, username } = req.body;
    if (password === '888888' && username === 'admin') {
      return res.json({
        status: 'ok',
        code: 0,
        token: 'sdfsdfsdfdsf',
        data: {
          id: 1,
          username: 'kenny',
          sex: 6,
        },
      });
    } else {
      return res.json({
        status: 'error',
        code: 403,
      });
    }
  },
  'DELETE /api/user/:id': (req, res) => {
    console.log('---->', req.body);
    console.log('---->', req.params.id); // request params
    res.send({ status: 'ok', message: 'delete success!' });
  },
};
module.exports = mockMap;
```

- mock code example two

```js
module.exports = [
  {
    path: '/api/user',
    handler: (req, res) => {
      return res.json({ username: 'admin', sex: 5 });
    },
  },
  {
    path: '/api/list',
    handler: function (req, res) {
      let query = req.query || {};
      return res.json({
        limit: query.limit,
        offset: query.offset,
        list: [
          { username: 'admin1', sex: 1 },
          { username: 'admin2', sex: 0 },
        ],
      });
    },
  },
  {
    path: '/repos/hello',
    handler: (req, res) => {
      return res.json({ text: 'this is from mock server' });
    },
  },
  {
    path: '/api/userinfo/:id',
    handler: (req, res) => {
      return res.json({
        id: req.params.id,
        username: 'kenny',
      });
    },
  },
  {
    path: '/api/user/list/:id/:type',
    handler: (req, res) => {
      return res.json({
        id: req.params.id,
        type: req.params.type,
      });
    },
  },
  {
    path: '/api/login/account',
    method: 'post',
    handler: (req, res) => {
      const { password, username } = req.body;
      if (password === '888888' && username === 'admin') {
        return res.json({
          status: 'ok',
          code: 0,
          token: 'sdfsdfsdfdsf',
          data: {
            id: 1,
            username: 'kenny',
            sex: 6,
          },
        });
      } else {
        return res.json({ status: 'error', code: 403 });
      }
    },
  },
  {
    method: 'delete',
    path: '/api/user/:id',
    handler: (req, res) => {
      res.send({ status: 'ok', message: '删除成功！' });
    },
  },
];
```

2. Add configuration options in vue.config.js for vue-cli

```js
module.exports = {
  pluginOptions: {
    mock: { entry: './test/mock.js', debug: true },
  },
};
```

3. test mock with curl

```bash
➜  ~ curl -X GET http://127.0.0.1:4000/api/user
{"id":1,"username":"kenny","sex":6}
➜  ~ curl -X GET http://127.0.0.1:4000/api/user/list
[{"id":1,"username":"kenny","sex":6},{"id":2,"username":"kenny","sex":6}]
➜  ~ curl -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"username":"admin","password":"888888"}' http://127.0.0.1:4000/api/login/account
{"status":"ok","code":0,"token":"sdfsdfsdfdsf","data":{"id":1,"username":"kenny","sex":6}}
➜  ~ curl -X DELETE http://127.0.0.1:4000/api/user/88
{"status":"ok","message":"delete success!"}
```

## Options

### entry

mock config entry，The default value is./mock/index.js. The file is compiled according to the project's Babel configuration

### debug

Whether to turn on local debugging information，The default value is false

### disable

The plugin will only work in a development environment , if you want to disable it, set disable to true, The default value is false

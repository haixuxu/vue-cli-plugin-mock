# vue-cli-plugin-mock
提供本地 mock 数据功能
* 简单书写
* 自动重载 mock 数据
* 可以调用项目模块

## Install

```bash
yarn add vue-cli-plugin-mock
```

## Usage

1. 编写 mock 数据文件，比如 ./mock/index.js
```js
const mockMap = { 
  'GET /api/user': {
    id: 1,
    username: 'kenny',
    sex: 6
  },
  'GET /api/user/list': [
    {
      id: 1,
      username: 'kenny',
      sex: 6
    }, {
      id: 2,
      username: 'kenny',
      sex: 6
    }
  ],
  // value 也可以是函数，接收 express 传递过来的 request 和 response
  'POST /api/login/account': (req, res) => {
    const { password, username } = req.body;
    if (password === '888888' && username === 'admin') {
      return res.json({
        status: 'ok',
        code: 0,
        token: "sdfsdfsdfdsf",
        data: {
          id: 1,
          username: 'kenny',
          sex: 6
        }
      });
    } else {
      return res.json({
        status: 'error',
        code: 403
      });
    }
  },
  'DELETE /api/user/:id': (req, res) => {
    console.log('---->', req.body)
    console.log('---->', req.params.id)
    res.send({ status: 'ok', message: '删除成功！' });
  }
}
module.exports = mockMap;
```

2. 在 vue.config.js 中添加 preset

```js
module.exports = {
  pluginOptions:{
    mock:{entry:'./test/mock.js',debug:true}
  }
}
```
3. test mock
```bash
➜  ~ curl -X GET http://127.0.0.1:4000/api/user
{"id":1,"username":"kenny","sex":6}
➜  ~ curl -X GET http://127.0.0.1:4000/api/user/list
[{"id":1,"username":"kenny","sex":6},{"id":2,"username":"kenny","sex":6}]
➜  ~ curl -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"username":"admin","password":"888888"}' http://127.0.0.1:4000/api/login/account
{"status":"ok","code":0,"token":"sdfsdfsdfdsf","data":{"id":1,"username":"kenny","sex":6}}
➜  ~ curl -X DELETE http://127.0.0.1:4000/api/user/88
{"status":"ok","message":"删除成功！"}
```

## Options

### entry
mock 数据入口，默认为./mock/index.js.该文件会根据项目的 babel 配置编译

### debug
是否开启本地调试信息，默认 false

### disable
是否禁用mock中间件，默认 false, 相当于是否启用插件vue-cli-plugin-mock
module.exports = {
  'GET /api/user': {
    username: 'admin',
    sex: 5,
  },
  'GET /api/list': function(req, res) {
    let query=req.query||{};
    return res.json({
      limit:query.limit,
      offset:query.offset,
      list:[{
        username: 'admin1',
        sex: 1,
      },{
        username: 'admin2',
        sex: 0,
      }]
    })
  },
  'GET /repos/hello': (req, res) => {
    return res.json({
      text: 'this is from mock server',
    });
  },
  'GET /api/userinfo/:id': (req, res) => {
    return res.json({
      id: req.params.id,
      username: 'kenny',
    });
  },
  'GET /api/user/list/:id/:type': (req, res) => {
    return res.json({
      id: req.params.id,
      type: req.params.type,
    });
  },

  'POST /api/login/account': (req, res) => {
    const {password, username} = req.body;
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
    res.send({status: 'ok', message: '删除成功！'});
  },
};

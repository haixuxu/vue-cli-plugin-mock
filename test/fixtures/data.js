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
      return res.json({
        text: 'this is from mock server',
      });
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
        return res.json({
          status: 'error',
          code: 403,
        });
      }
    },
  },
  {
    method: 'delete',
    path: '/api/user/:id',
    handler: (req, res) => {
      res.send({ status: 'ok', message: 'delete success!' });
    },
  },
];

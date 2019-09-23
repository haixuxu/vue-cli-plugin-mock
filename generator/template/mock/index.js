export default {
    'GET /api/user': {
        username: 'admin',
        sex: 5,
    },
    'GET /api/list': function (req, res) {
        let query = req.query || {};
        return res.json({
            limit: query.limit,
            offset: query.offset,
            list: [{
                username: 'admin1',
                sex: 1,
            }, {
                username: 'admin2',
                sex: 0,
            }]
        })
    },
    'GET /api/userinfo/:id': (req, res) => {
        return res.json({
            id: req.params.id,
            username: 'kenny',
        });
    },
    'POST /api/login/account': (req, res) => {
        const { password, username } = req.body;
        if (password === '888888' && username === 'admin') {
            return res.json({
                status: 'ok',
                token: 'sdfsdfsdfdsf',
            });
        } else {
            return res.json({
                status: 'error',
                code: 403,
            });
        }
    },
    'DELETE /api/user/:id': (req, res) => {
        // console.log(req.params.id);
        res.send({ status: 'ok', message: 'delete success!' });
    },
    'PUT /api/user/:id': (req, res) => {
        // console.log(req.params.id);
        // console.log(req.body);
        res.send({ status: 'ok', message: 'update success！' });
    },
}

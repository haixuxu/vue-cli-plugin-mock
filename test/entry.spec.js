var path = require('path');
var assert = require('assert');
var express = require('express');
var request = require('supertest');
var expressMock = require('../mock/index');

var entry = path.resolve(__dirname, './fixtures/entry.js');

var min = 60 * 1000;

describe('mock mock config object', function () {
  before(function () {
    process.chdir(path.resolve(__dirname, '..', './test'));
  });

  it('should skip not match', function (done) {
    var app = express()
      .use(expressMock({ entry: entry }))
      .use(function (req, res, next) {
        res.end('is skiped');
      });
    request(app).get('/noapi/user').expect(200, 'is skiped', done);
  });

  it('should can mock object vlaue', function (done) {
    var app = express().use(expressMock({ entry: entry }));

    request(app).get('/api/user').expect(200, { username: 'admin', sex: 5 }, done);
  });
  it('should can mock with query params', function (done) {
    var app = express().use(expressMock({ entry: entry }));
    var obj = {
      limit: 10,
      offset: 0,
      list: [
        { username: 'admin1', sex: 1 },
        { username: 'admin2', sex: 0 },
      ],
    };
    request(app).get('/api/list?limit=10&offset=0').expect(200, obj, done);
  });
  it('should can mock function', function (done) {
    var app = express().use(expressMock({ entry: entry }));

    request(app).get('/repos/hello').expect(200, { text: 'this is from mock server' }, done);
  });

  it('should can mock with params', function (done) {
    var app = express().use(expressMock({ entry: entry }));
    let id = Math.random().toString(36).substr(3);
    request(app)
      .get('/api/userinfo/' + id)
      .expect(200, { id: id, username: 'kenny' }, done);
  });
  it('should can mock with multiple params', function (done) {
    var app = express().use(expressMock({ entry: entry }));
    let id = Math.random().toString(36).substr(4);
    let type = Math.random().toString(36).substr(5);
    request(app)
      .get('/api/user/list/' + id + '/' + type)
      .expect(200, { id: id, type: type }, done);
  });
  it('should can accept POST params', function (done) {
    var app = express().use(expressMock({ entry: entry }));
    var obj = {
      status: 'ok',
      code: 0,
      token: 'sdfsdfsdfdsf',
      data: {
        id: 1,
        username: 'kenny',
        sex: 6,
      },
    };
    request(app).post('/api/login/account').send({ username: 'admin', password: '888888' }).expect(200, obj, done);
  });
  it('should can accept DELETE params', function (done) {
    var app = express().use(expressMock({ entry: entry }));
    request(app).delete('/api/user/122').expect(200, { status: 'ok', message: 'delete success!' }, done);
  });
});

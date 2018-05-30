const express = require('express');

const router = express.Router();
const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];

const viewPath = config.path;
const path = require('path');
const models = require('../models');
const wrap = require('express-async-wrap');

/* GET home page. */
router.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}../..`, viewPath.index, 'index.html'));
});

//  login
router.post('/login', wrap(async (req, res) => {
  try {
    const user = await models.user.findOne({
      where: {
        uid: req.body.uid,
        pw: req.body.pw
      }
    });
    if (user !== null) {
      req.session.user = user.dataValues; // 세션 생성
      req.session.user.time = new Date();
      req.session.user.ip = req.connection.remoteAddress;
      delete req.session.user.pw;
      req.session.user.result = true; // 로그인 성공 시 true
      res.send(req.session.user);
    } else {
      res.send({ result: false });
    }
  } catch (e) {
    res.send({
      result: false
    });
  }
}));

// load session
router.get('/session', wrap(async (req, res) => {
  try {
    const session = await req.session.user;
    if (session) {
      res.send(session);
    }
  } catch (e) {
    res.send({
      result: false
    });
  }
}));

module.exports = router;

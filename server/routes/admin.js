const express = require('express');

const router = express.Router();
// const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];

// const viewPath = config.path;
// const path = require('path');
const models = require('../models');
const wrap = require('express-async-wrap');

// get project list
router.get('/project', wrap(async (req, res) => {
  if (req.session.user.auth === 1) {
    const projects = await models.project.findAll();
    if (projects) {
      res.send(projects);
    }
  }
  res.status(500).send('error');
}));

// add project
router.post('/project', wrap(async (req, res) => {
  if (req.session.user.auth === 1) {
    const create = await models.project.create(req.body);
    if (create) {
      res.send({
        result: true
      });
    }
  }
  res.status(500).send('error');
}));

// 유저 이메일, 전화번호, 역할 정보 수정
router.put('/user/:uid', wrap(async (req, res) => {
  if (req.session.user.auth === 1) {
    const update = await models.user.update(req.body, {
      where: {
        uid: req.params.uid
      }
    });
    if (update) {
      res.send({
        result: true
      });
    }
  }
  res.status(500).send('error');
}));

module.exports = router;

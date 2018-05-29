const express = require('express');

const router = express.Router();
// const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];

// const viewPath = config.path;
// const path = require('path');
const models = require('../models');
const wrap = require('express-async-wrap');

// get project list
router.get('/project', wrap(async (req, res) => {
  try {
    const projects = await models.project.findAll();
    if (projects) {
      res.send(projects);
    }
  } catch (e) {
    res.send({
      result: false
    });
  }
}));

// add project
router.post('/project', wrap(async (req, res) => {
  try {
    const create = await models.project.create(req.body);
    if (create) {
      res.send({
        result: true
      });
    }
  } catch (e) {
    res.send({
      result: false
    });
  }
}));

// 유저 이메일, 전화번호, 역할 정보 수정
router.put('/user/:uid', wrap(async (req, res) => {
  try {
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
  } catch (e) {
    res.send({
      result: false
    });
  }
}));

module.exports = router;

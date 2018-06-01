const express = require('express');

const router = express.Router();

const models = require('../models');
const wrap = require('express-async-wrap');

// 본인 소속 프로젝트 리스트 불러옴 get방식
router.get('/:uid', wrap(async (req, res) => {
  const assign_r = await models.assign_r.findAll({
    where: {
      uid: req.params.uid
    },
    include: ['project']
  });
  res.send(assign_r);
}));

// 프로젝트 수행원 추가, 역할 부여(PM과 ADMIN만 가능)
router.post('/:uid/:pid', wrap(async (req, res) => {
  if (req.session.user.auth === 1) {
    const create = await models.assign_r.create({
      uid: req.params.uid,
      pid: req.params.pid,
      role: req.body.role
    });
    if (create) {
      res.send({
        result: true
      });
    }
  } else if (req.session.user.auth === 2) {
    const project = await models.project.findOne({
      where: {
        pid: req.params.pid
      }
    });
    if (req.session.user.uid === project.uid) {
      const create = await models.assign_r.create({
        uid: req.params.uid,
        pid: req.params.pid,
        role: req.body.role
      });
      if (create) {
        res.send({
          result: true
        });
      }
    } else {
      res.send({
        result: false
      });
    }
  } else {
    res.send({
      result: false
    });
  }
}));

// 해당 프로젝트 제거(PM과 ADMIN만 가능)
router.delete('/:uid/:pid', wrap(async (req, res) => {
  if (req.session.user.auth === 1) {
    const destroy = await models.project.destroy({
      where: { pid: req.params.pid }
    });
    if (destroy) {
      res.send({
        result: true
      });
    }
  } else if (req.session.user.auth === 2) {
    const project = await models.project.findOne({
      where: {
        pid: req.params.pid
      }
    });
    if (req.session.user.uid === project.uid) {
      const destroy = await models.project.destroy({
        where: { pid: req.params.pid }
      });
      if (destroy) {
        res.send({
          result: true
        });
      }
    } else {
      res.send({
        result: false
      });
    }
  } else {
    res.send({
      result: false
    });
  }
}));

module.exports = router;

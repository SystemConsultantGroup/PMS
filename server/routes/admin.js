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
}));

// 전체 수행원의 이름, auth 정보 불러옴
router.get('/users', wrap(async (req, res) => {
  if (req.session.user.auth === 1) {
    const users = await models.user.findAll({
      attributes: ['uid', 'name', 'auth']
    });
    if (users) {
      res.send(users);
    }
  }
}));

// auth 정보 수정
router.put('/users', wrap(async (req, res) => {
  if (req.session.user.auth === 1) {
    const update = await models.user.update({ auth: req.body.auth }, {
      where: {
        uid: req.body.uid
      }
    });
    if (update) {
      res.send({
        result: true
      });
    }
  }
}));

// 선택한 수행원의 정보 전체 및 소속 프로젝트 이름과 pid 리스트
router.get('/user/:uid', wrap(async (req, res) => {
  if (req.session.user.auth === 1) {
    const user = await models.user.findOne({
      where: { uid: req.params.uid },
      attributes: ['uid', 'name', 'auth', 'email', 'ph']
    });
    const project = await models.assign_r.findAll({
      where: { uid: req.params.uid },
      attributes: ['pid'],
      include: [{ model: models.project, attributes: ['name'] }]
    });
    if (user && project) {
      res.send({ user, project });
    }
  }
}));

// 선택한 유저 삭제
router.delete('/user/:uid', wrap(async (req, res) => {
  const destroy = await models.user.destroy({
    where: { uid: req.params.uid }
  });
  if (destroy) {
    res.send({
      result: true
    });
  }
}));

// 선택한 프로젝트의 (해당 유저 소속) To Do list 불러옴
router.get('/user/:uid/:pid', wrap(async (req, res) => {
  if (req.session.user.auth === 1) {
    const assign_r = await models.assign_r.findAll({
      where: {
        uid: req.params.uid,
        pid: req.params.pid
      }
    });
    if (assign_r) {
      const todo = await models.todo.findAll({
        where: {
          pid: req.params.pid
        }
      });
      if (todo) {
        res.send(todo);
      }
    }
  }
}));

// 회원가입 승인 auth를 0에서 9로 바꿈
router.post('/register', wrap(async (req, res) => {
  if (req.session.user.auth === 0) {
    const userAuth = await models.user.update(
      { auth: req.body.auth = 9 },
      { where: { uid: req.body.uid } }
    );
    res.send(userAuth);
  }
}));

module.exports = router;

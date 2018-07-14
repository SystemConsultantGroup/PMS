const express = require('express');

const router = express.Router();
// const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];

// const viewPath = config.path;
// const path = require('path');

const wrap = require('express-async-wrap');
const sequelize = require('sequelize');
const models = require('../models');

const Op = sequelize.Op;

// get project list
router.get('/project', wrap(async (req, res) => {
  if (req.session.user.auth === 1) {
    const projects = await models.project.findAll();
    if (projects) {
      res.send(projects);
    } else {
      res.send({
        result: false
      });
    }
  }
}));

// add project
router.post('/project', wrap(async (req, res) => {
  const create = await models.project.create(req.body);
  const update = await models.user.update({ auth: 2 }, {
    where: {
      uid: req.body.uid
    }
  });
  if (create && update) {
    res.send({
      result: true
    });
  } else {
    res.send({
      result: false
    });
  }
}));

// get (선택한) 프로젝트 이름, startdate, duedate, done 리스트 불러옴
router.get('/project/:pid', wrap(async (req, res) => {
  if (req.session.user.auth === 1 || req.session.user.auth === 2) {
    const projects = await models.project.findOne({
      where: {
        pid: req.params.pid
      },
      attributes: [
        'pid', 'uid', 'name', 'startdate', 'duedate', 'done'
      ]
    });
    if (projects) {
      res.send(projects);
    } else {
      res.send({
        result: false
      });
    }
  }
}));

// put (선택한) 프로젝트 이름, startdate, duedate, done 정보 수정
router.put('/project/:pid', wrap(async (req, res) => {
  if (req.session.user.auth === 1 || req.session.user.auth === 2) {
    const update = await models.project.update(req.body, {
      where: {
        pid: req.params.pid
      }
    });
    const updateAuth = await models.user.update({ auth: 2 }, {
      where: {
        uid: req.body.uid
      }
    });
    if (update && updateAuth) {
      res.send({
        result: true
      });
    } else {
      res.send({
        result: false
      });
    }
  }
}));

// delete (선택한) 프로젝트 정보 삭제
router.delete('/project/:pid', wrap(async (req, res) => {
  if (req.session.user.auth === 1) {
    const destroy = await models.project.destroy({
      where: {
        pid: req.params.pid
      }
    });
    if (destroy) {
      res.send({
        result: true
      });
    } else {
      res.send({
        result: false
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
    } else {
      res.send({
        result: false
      });
    }
  }
}));

// 전체 수행원의 이름, auth 정보 불러옴
// auth가 0이 아닌 유저들을 불러온다
router.get('/users', wrap(async (req, res) => {
  const users = await models.user.findAll({
    where: {
      auth: {
        [Op.ne]: 0
      }
    },
    attributes: ['uid', 'name', 'auth']
  });
  if (users) {
    res.send(users);
  } else {
    res.send({
      result: false
    });
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
    } else {
      res.send({
        result: false
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

// 선택한 유저 삭제
router.delete('/user/:uid', wrap(async (req, res) => {
  const destroy = await models.user.destroy({
    where: { uid: req.params.uid }
  });
  if (destroy) {
    res.send({
      result: true
    });
  } else {
    res.send({
      result: false
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
  } else {
    res.send({
      result: false
    });
  }
}));

// auth가 0인 사람들만 불러옴(전체 수행원의 이름, auth 정보)
router.get('/users/default', wrap(async (req, res) => {
  if (req.session.user.auth === 1) {
    const users = await models.user.findAll({
      where: {
        auth: 0
      },
      attributes: ['uid', 'name', 'auth']
    });
    if (users) {
      res.send(users);
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

// put 회원가입 승인 auth를 0에서 9로 바꿈
router.put('/users/approve/:uid', wrap(async (req, res) => {
  if (req.session.user.auth === 1) {
    const userAuth = await models.user.update(
      { auth: req.params.auth = 9 },
      { where: { uid: req.params.uid } }
    );
    res.send(userAuth);
  } else {
    res.send({
      result: false
    });

  }
}));

module.exports = router;

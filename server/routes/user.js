const express = require('express');

const router = express.Router();
// const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];

// const viewPath = config.path;
// const path = require('path');
const wrap = require('express-async-wrap');
const models = require('../models');

// add user
router.post('/', wrap(async (req, res) => {
  const create = await models.user.create(req.body);
  if (create) {
    res.send({
      result: true
    });
  } else {
    res.send({
      result: false
    });
  }
}));

// 유저 삭제
router.delete('/', wrap(async (req, res) => {
  if (req.session.user.auth === 1) {
    const dest = await models.user.destroy({
      where: { uid: req.body.uid }
    });
    if (dest) {
      res.send({
        result: true
      });
    }
  } else if (req.session.user.uid === req.body.uid) {
    const dest = await models.user.destroy({
      where: { uid: req.body.uid }
    });
    if (dest) {
      res.send({
        result: true
      });
    }
  } else {
    res.send({
      result: false
    });
  }
}));


// 유저  정보 수정
router.put('/:uid', wrap(async (req, res) => {
  const update = await models.user.update(req.body, {
    where: {
      uid: req.session.user.uid
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
}));


// 유저 정보 읽기
router.get('/:uid', wrap(async (req, res) => {
  const inform = await models.user.findOne({
    where: {
      uid: req.params.uid
    }
  });
  if (inform) {
    res.send(inform);
  } else {
    res.send({
      result: false
    });
  }
}));

module.exports = router;

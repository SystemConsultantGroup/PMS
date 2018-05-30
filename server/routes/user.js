const express = require('express');

const router = express.Router();
// const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];

// const viewPath = config.path;
// const path = require('path');
const models = require('../models');
const wrap = require('express-async-wrap');

// add user
router.post('/', wrap(async (req, res) => {
  try {
    const create = await models.user.create(req.body);
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

// 유저 삭제
router.delete('/', wrap(async (req, res) => {
  try {
    const dest = await models.user.destroy({
      where: { uid: req.body.uid }
    });
    if (dest) {
      res.send({
        result: true
      });
    } else {
      res.send({
        result: false
      });
    }
  } catch (e) {
    res.send({
      result: false
    });
  }
}));

module.exports = router;


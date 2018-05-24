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

// add user
router.post('/user', wrap(async (req, res) => {
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

module.exports = router;

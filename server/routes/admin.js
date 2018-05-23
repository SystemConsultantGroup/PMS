const express = require('express');
const models = require('../models');
const wrap = require('express-async-wrap');

const router = express.Router();

router.get('/project', wrap(async (req, res) => {
  const projects = await models.project.findAll();
  res.send(projects);
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

module.exports = router;

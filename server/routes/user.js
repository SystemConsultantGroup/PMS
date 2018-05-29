const express = require('express');
const router = express.Router();
// const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];

// const viewPath = config.path;
// const path = require('path');
const models = require('../models');
const wrap = require('express-async-wrap');


// 유저  정보 수정
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

//유저 삭제 
router.delete('/user', wrap(async (req, res) => {
  try {
  	const dest = await models.user.destroy({
  		where : { uid : req.body.uid}
  	})
    if (dest) {
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




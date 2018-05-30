const express = require('express');
const router = express.Router();
// const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];

// const viewPath = config.path;
// const path = require('path');
const models = require('../models');
const wrap = require('express-async-wrap');

//본인 소속 프로젝트 가져오기 
//18번
//1. get 방식으로 할때 user 의 uid가 필수적으로 필요?
//본인 소속 인것을 제한시켜야 하지 않을까...

router.get('/:uid', wrap(async (req, res) => {
	const assign_r = await models.assign_r.findAll({
		where:{
			uid: req.params.uid
		},
		include: ["project"]
	});
	res.send(assign_r);
}));

module.exports = router;

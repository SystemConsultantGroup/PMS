const express = require('express');
const router = express.Router();

const models = require('../models');
const wrap = require('express-async-wrap');

//본인 소속 프로젝트 리스트 불러옴 get방식
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
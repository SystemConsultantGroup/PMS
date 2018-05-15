const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/project', async (req, res, next) => {
	const projects = await models.project.findAll();
	res.send(projects);
});

module.exports = router;

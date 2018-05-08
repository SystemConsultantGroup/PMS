const express = require('express');
const router = express.Router();
const config = require('../config/config.json')[process.env.NODE_ENV || "development"];
const viewPath = config.path;
const path = require('path');
/* GET home page. */
router.get('/', function(req, res, next){
    res.sendFile(path.join(__dirname+'../..', viewPath.index, 'index.html'));
});

module.exports = router;
	
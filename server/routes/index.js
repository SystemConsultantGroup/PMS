var express = require('express');
var router = express.Router();
var config = require('../config/config.json')[process.env.NODE_ENV || "development"];
var viewPath = config.path;
/* GET home page. */
router.get('/', function(req, res, next){
    res.sendFile(path.join(__dirname+'../..', viewPath.index, 'index.html'));
});

module.exports = router;

var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const mainController = require("../controllers/mainController")

/* GET home page. */
router.get('/', mainController.index);

module.exports = router;

const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home_controllers.js');

console.log(`routes have be successfull established`);

router.get('/',homeController.home);

module.exports = router;
const express = require('express');
const router = express.Router();

const tras_Controller = require('../controller/tras/trasController/trasController');
const middleware = require('../middleware/check-auth')

router.get('/',middleware,tras_Controller.GetTrass);

module.exports = router;
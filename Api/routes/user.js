const express = require('express');
const router = express.Router();

const user_Controller = require('../controller/user/user controller/user_controllers');

router.get('/',user_Controller.login);

router.post('/',user_Controller.createUser);

router.put('/:Id',user_Controller.updatePassword);

module.exports = router;
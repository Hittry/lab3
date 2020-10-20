var express = require('express');
var router = express.Router();
var auth = require("./AuthController.js");
//Используется для машуртизации, при переходе на люой из этих путей происходит проверка из authcntrol и выполнение его содержимого

// restrict index for logged in user only
router.get('/', auth.home);

// route to register page
router.get('/register', auth.register);

// route for register action
router.post('/register', auth.doRegister);

// route to login page
router.get('/login', auth.login);

// route for login action
router.post('/login', auth.doLogin);

// route for logout action
router.get('/logout', auth.logout);

module.exports = router;
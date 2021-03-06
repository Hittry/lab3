var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/user");



var userController = {};

// Restrict access to root page
userController.home = function(req, res) {
    res.render('index', {user : req.user});
};

// Go to registration page
userController.register = function(req, res) {
    res.render('register');
};

// Post registration
userController.doRegister = function(req, res) {
    User.register(new User({ username : req.body.username, name: req.body.name }), req.body.password, function(err, user) {
        if (err) {
            return res.render('register', { user : user }); //Берем параметры имя пользователя, ник и пароль, если ошибка отправляем на реигстрацию иначе в меню
        }

        passport.authenticate('local')(req, res, function () { //функция для провекри авторизации
            res.redirect('/api/ShuvalovSasha/lab1/lab3/views/menu');
        });
    });
};

// Go to login page
userController.login = function(req, res) {
    res.render('login');
};

// Post login
userController.doLogin = function(req, res) {
    passport.authenticate('local')(req, res, function() {
        res.redirect('/api/ShuvalovSasha/lab1/lab3/views/menu');
    });
};

// logout
userController.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

module.exports = userController;

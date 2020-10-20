var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose'); //Passport-Local Mongoose use the pbkdf2 algorithm of the node crypto library.

var UserSchema = new Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose);
//Преобразует пароль в хэш и соль и записывает в бд в таком виде

module.exports = mongoose.model('User', UserSchema);
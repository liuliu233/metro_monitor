var mongoose = require('../common/db') ;

let user = new mongoose.Schema({
    username: String,
    password: String,
    userPhone: String,
    department: String,
    role: [],
    state: String
});

user.statics.findUserLogin = function(name, password, callBack){
    this.find({username:name, password:password}, callBack);
};

user.statics.findByUsername = function(name, callBack){
    this.find({username:name}, callBack);
};

var userModel = mongoose.model('user', user);
module.exports = userModel;
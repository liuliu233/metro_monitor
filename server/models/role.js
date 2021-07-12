var mongoose = require('../common/db') ;

let role = new mongoose.Schema({
    roleName: String,
    roleType: String,
    roleNote: String,
    roleOperation: [],
});

var roleModel = mongoose.model('role', role);
module.exports = roleModel;
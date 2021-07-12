let mongoose = require('mongoose');
let url = 'mongodb://localhost/sz_metro';
mongoose.connect(url);
module.exports = mongoose;
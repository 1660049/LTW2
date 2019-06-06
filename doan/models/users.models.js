var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var schema = mongoose.Schema;

var UsersSchema = mongoose.Schema({
    userName : String,
    email: String,
    password: String,
    name:  String,
    role: String,
});

var User = module.exports = mongoose.model('Users',UsersSchema);

module.exports.getUserByUserName = function(userName, callback){
    var query = {
        userName: userName
    }
    User.findOne(query,callback);
}

module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(newUser.password, salt,(err,hash)=>{
            if(err) return err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}



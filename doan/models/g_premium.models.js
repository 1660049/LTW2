var mongoose = require('mongoose');

var expPreSchema = mongoose.Schema({
    user: String,
    expPremium: Date
})
var expPre = module.exports = mongoose.model('exppres',expPreSchema);

module.exports.updatePremium = function(userName,expdate){
    return new Promise((resolve,reject)=>{
        expPre.findOneAndUpdate({user: userName},{$set: {expPremium: expdate}},(err,docs)=>{
            if(err) reject(err);
            resolve(docs);
        })
    })
}
module.exports.addNewSub = function(userName,expDate,callback){
    var newExpPre = new expPre({
        user: userName,
        expPremium: expDate
    })
    newExpPre.save(callback);
}
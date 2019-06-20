var mongoose = require('mongoose');
var tagSchema = mongoose.Schema({
    catParentName: String,
    tagName: String
})
var e = module.exports = mongoose.model('tags',tagSchema);

module.exports.getTag = ()=>{
    return new Promise((resolve,reject)=>{
        e.find((err,docs)=>{
            if(err) reject(err);
            resolve(docs);
        })
    })
}
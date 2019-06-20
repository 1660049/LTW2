var mongoose = require('mongoose');
var catSchema = mongoose.Schema({
    catName: String,
})
var e = module.exports = mongoose.model('categories',catSchema);

module.exports.getCat = ()=>{
    return new Promise((resolve,reject)=>{
        e.find((err,docs)=>{
            if(err) reject(err);
            resolve(docs);
        })
    })
}
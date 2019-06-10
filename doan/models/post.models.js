var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.Promise = Promise;

var postSchema = mongoose.Schema({
    img: String,
    tieuDe: String,
    chuyenMuc: String,
    tag: String,
    ngayDang: Date,
    abtract: String,
    content: String,
    idAuther: String,
    duyet: Boolean,
    views: Number,
})


var post = module.exports = mongoose.model('post', postSchema);

module.exports.addPost = function (newPost, callback) {
    newPost.save(callback);
}


module.exports.getRecentPost = function (date) {
    return new Promise((resolve, reject) => {
        post.find({ "ngayDang": { $lte: date }, "duyet": true }, (err, docs) => {
            if (err) reject(err);
            //console.log(docs);
            resolve(docs);
        }).sort({ ngayDang: -1 }).limit(10);
    })

}
module.exports.getMostViewsPost = function (date) {
    return new Promise((resolve, reject) => {
        post.find({ "ngayDang": { $lte: date }, "duyet": true }, (err, docs) => {
            if (err) reject(err);
            resolve(docs);
        }).sort({ views: -1 }).limit(10);
    })
}

module.exports.updateViews = function(id){
    return new Promise((resolve,reject)=>{
        post.findByIdAndUpdate(id,{$set:{views: views + 1}},(err,docs)=>{
            if(err) reject(err);
            resolve(docs);
        })
    })
}
module.exports.SingleID = function(id){
    return new Promise((resolve,reject)=>{
        post.findById(id,(err,docs)=>{
            if(err) reject(err);
            resolve(docs);
        })
    })
}
module.exports.singleCategories = function(date, catName){
    return new Promise((resolve,reject)=>{
        post.find({"ngayDang": { $lte: date },"chuyenMuc": catName, "duyet": true},(err,docs)=>{
            if(err) reject(err);
            resolve(docs);
        }).limit(2).sort({ ngayDang: -1 });
    })
}
module.exports.countCat = function(date, catName){
    return new Promise((resolve,reject)=>{
        post.count ({"ngayDang": { $lte: date },"chuyenMuc": catName, "duyet": true},(err,docs)=>{
            if(err) reject(err);
            resolve(docs);
        })
    })
}  
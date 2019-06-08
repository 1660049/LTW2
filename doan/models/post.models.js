var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
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

module.exports.addPost = function(newPost, callback) {
    newPost.save(callback);
}
module.exports.getRecentPost = function(date, callback){
    post.find({"ngayDang":{$lte : date},"duyet": false},callback).limit(10).sort({ngayDang: -1});
}
module.exports.getMostViewsPost = function(date,callback) {
    post.find({"ngayDang":{$lte : date},"duyet": false},callback).limit(10).sort({views: -1});
}
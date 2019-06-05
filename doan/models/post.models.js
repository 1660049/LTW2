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

module.exports.addPost = function (newPost, callback) {
    newPost.save(callback);
}
module.exports.loadPost = function (callback) {
    post.findOne(callback);
}
module.exports.getPostBy = function (categories, callback) {
    var query = {
        chuyenMuc: categories,
        duyet: true,
    };
    post.find(query, callback).limit(10);
}
module.exports.getMostViewPost = function () {

}
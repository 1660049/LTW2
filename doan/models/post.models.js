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
            if (err) reject (err);
            //console.log(docs);
            resolve(docs);
        }).limit(10).sort({ ngayDang: -1 });
    })

}
module.exports.getMostViewsPost = function (date) {
    return new Promise((resolve, reject) => {
        post.find({ "ngayDang": { $lte: date }, "duyet": false }, (err, docs) => {
            if (err) reject (err);
           resolve(docs);
        }).limit(10).sort({ views: -1 });
    })

}

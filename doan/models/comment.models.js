var mongoose = require('mongoose');
mongoose.Promise = Promise;

var commentSchema = mongoose.Schema({
    idPost: String,
    name: String,
    email: String,
    comment: String,
    time: Date,
})

var comment = module.exports = mongoose.model('comments',commentSchema);

module.exports.getComment = (id)=>{
    return new Promise((resolve,reject)=>{
        comment.find({idPost: id},(err,docs)=>{
            if(err) reject(err);
            resolve(docs);
        });
    })
}
module.exports.getCountComment = (id)=>{
    return new Promise((resolve,reject)=>{
        comment.count({idPost: id},(err,docs)=>{
            if(err) reject(err);
            resolve(docs);
        });
    })
}
module.exports.addComment = function (newComment, callback) {
    newComment.save(callback);
}
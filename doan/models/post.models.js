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
    ngayXuatBan: Date,
    editor: String,
    premium: Boolean
})


var post = module.exports = mongoose.model('post', postSchema);
//thêm post mới
module.exports.addPost = function (newPost, callback) {
    newPost.save(callback);
}
//dashboard
//Lấy post mới nhất
module.exports.getRecentPost = function (date) {
    return new Promise((resolve, reject) => {
        post.find({ ngayXuatBan: { $lte: date }, duyet: true }, (err, docs) => {
            if (err) reject(err);
            resolve(docs);
        }).sort({ ngayDang: -1 }).limit(10);
    })
}


module.exports.getPremiumPost = function(date){
    return new Promise((resolve,reject)=>{
        post.find({ngayXuatBan: {$lte: date}, duyet: true, premium: true},(err,docs)=>{
            if(err) reject(err);
            resolve(docs);
        }).sort({ngayDang: -1}).limit(9);
    })
}


module.exports.getRecentPostHeader1 = function (date) {
    return new Promise((resolve, reject) => {
        post.findOne({ "ngayXuatBan": { $lte: date }, "duyet": true }, (err, docs) => {
            if (err) reject(err);
            
            resolve(docs);
        }).sort({ views: -1 }).skip(0);
    })
}
module.exports.getRecentPostHeader2 = function (date) {
    return new Promise((resolve, reject) => {
        post.findOne({ "ngayXuatBan": { $lte: date }, "duyet": true }, (err, docs) => {
            if (err) reject(err);
            
            resolve(docs);
        }).sort({   views: -1 }).skip(1);
    })
}
module.exports.getRecentPostHeader3 = function (date) {
    return new Promise((resolve, reject) => {
        post.findOne({ "ngayXuatBan": { $lte: date }, "duyet": true }, (err, docs) => {
            if (err) reject(err);
            
            resolve(docs);
        }).sort({ views: -1}).skip(2);
    })
}
//lấy post nhiều view nhất
module.exports.getMostViewsPost = function (date) {
    return new Promise((resolve, reject) => {
        post.find({ "ngayXuatBan": { $lte: date }, "duyet": true }, (err, docs) => {
            if (err) reject(err);
            resolve(docs);
        }).sort({ views: -1 }).limit(10);
    })
}
//đếm số lượng views
module.exports.updateViews = function (id) {
    return new Promise((resolve, reject) => {
        post.findByIdAndUpdate(id, { $set: { views: views + 1 } }, (err, docs) => {
            if (err) reject(err);
            resolve(docs);
        })
    })
}
//Tìm bài viết theo id
module.exports.SingleID = function (id) {
    return new Promise((resolve, reject) => {
        post.findById(id, (err, docs) => {
            if (err) reject(err);
            resolve(docs);
        })
    })
}
//load theo categories cho dashboard
module.exports.findCategories = function (date, catName) {
    return new Promise((resolve, reject) => {
        post.find({ "ngayXuatBan": { $lte: date }, "chuyenMuc": catName, "duyet": true }, (err, docs) => {
            if (err) reject(err);
            resolve(docs);
        }).limit(2).sort({ ngayDang: -1 });
    })
}
//Load all categories
module.exports.findAllCategories = function (date, catName, start_offset) {
    return new Promise((resolve, reject) => {
        post.find({ "ngayXuatBan": { $lte: date }, "chuyenMuc": catName, "duyet": true }, (err, docs) => {
            if (err) reject(err);
            resolve(docs);
        }).sort({ ngayDang: -1 }).limit(6).skip(start_offset);
    })
}
//Count all categories
module.exports.countCat = function (date, catName) {
    return new Promise((resolve, reject) => {
        post.count({ "ngayXuatBan": { $lte: date }, "chuyenMuc": catName, "duyet": true }, (err, docs) => {
            if (err) reject(err);
            resolve(docs);
        })
    })
}
//tag
module.exports.findAllWithTagName = function (date, tagName, start_offset) {
    return new Promise((resolve, reject) => {
        post.find({ "ngayXuatBan": { $lte: date }, "tag": tagName, "duyet": true }, (err, docs) => {
            if (err) reject(err);
            resolve(docs);
        }).sort({ ngayDang: -1 }).limit(6).skip(start_offset);
    })
}
module.exports.GetPostWithTagName = function (date, tagName) {
    return new Promise((resolve, reject) => {
        post.find({ "ngayXuatBan": { $lte: date }, "tag": tagName, "duyet": true }, (err, docs) => {
            if (err) reject(err);
            resolve(docs);
        }).sort({ ngayDang: -1 }).limit(10);
    })
}
//
module.exports.countTag = function (date, tagName) {
    return new Promise((resolve, reject) => {
        post.count({ "ngayXuatBan": { $lte: date }, "tag": tagName, "duyet": true }, (err, docs) => {
            if (err) reject(err);
            resolve(docs);
        })
    })
}
//writer
module.exports.GetPostByUser = function (start_offset, idUser) {
    return new Promise((resolve, reject) => {
        post.find({ "idAuther": idUser }, (err, docs) => {
            if (err) reject(err);
            resolve(docs);
        }).limit(6).skip(start_offset);
    })
}
module.exports.countGetPostByUser = function (idUser) {
    return new Promise((resolve, reject) => {
        post.count({ "idAuther": idUser }, (err, total) => {
            if (err) reject(err);
            if (total) resolve(total);
        })
    })
}

//editor
module.exports.getAllNotApprovedEd = (start_offset, categories) => {
    return new Promise((resolve, reject) => {
        post.find({ duyet: false,chuyenMuc: categories }, (err, docs) => {
            if (err) reject(err);
            resolve(docs);
        }).limit(6).skip(start_offset);
    })
}
module.exports.countGetNotApprovedEd = (categories) => {
    return new Promise((resolve, reject) => {
        post.count({ duyet: false,chuyenMuc: categories }, (err, docs) => {
            if (err) reject(err);
            resolve(docs);
        })
    })
}
module.exports.approvedPost = (id,userEditor) => {
    return new Promise((resolve, reject) => {
        post.findByIdAndUpdate(id, { $set: { "duyet": true, "editor": userEditor } }, (err, docs) => {
            if (err) reject(err);
            resolve(docs);
        })
    })
}
module.exports.approvedPostDate = (id,userEditor,date)=>{
    return new Promise((resolve,reject)=>{
        post.findByIdAndUpdate(id, {$set: {"duyet": true, "ngayXuatBan": date, "editor": userEditor}},(err,docs)=>{
            if(err) reject(err);
            resolve(docs);
        })
    })
}

module.exports.getAllApprovedEd = (userEditor)=>{
    return new Promise((resolve,reject)=>{
        post.find({editor: userEditor, duyet: true},(err,docs)=>{
            if(err) reject(err);
            resolve(docs);
        })
    })
}

//admin 
module.exports.getAllNotApproved = (start_offset) => {
    return new Promise((resolve, reject) => {
        post.find({ duyet: false }, (err, docs) => {
            if (err) reject(err);
            resolve(docs);
        }).limit(6).skip(start_offset);
    })
}
module.exports.countGetNotApproved = () => {
    return new Promise((resolve, reject) => {
        post.count({ duyet: false }, (err, docs) => {
            if (err) reject(err);
            resolve(docs);
        })
    })
}
module.exports.getAllApprovedAd = () => {
    return new Promise((resolve, reject) => {
        post.find({ duyet: true }, (err, docs) => {
            if (err) reject(err);
            resolve(docs);
        });
    })
}
module.exports.countGetApprovedAd = () => {
    return new Promise((resolve, reject) => {
        post.count({ duyet: true }, (err, docs) => {
            if (err) reject(err);
            resolve(docs);
        })
    })
}

module.exports.getAllByCatName = (catName) => {
    return new Promise((resolve, reject) => {
        post.find({ chuyenMuc: catName }, (err, docs) => {
            if (err) reject(err);
            resolve(docs);
        })
    })
}
module.exports.countGetAllByCatName = (catName) => {
    return new Promise((resolve, reject) => {
        post.count({ chuyenMuc: catName }, (err, docs) => {
            if (err) reject(err);
            resolve(docs);
        })
    })
}




//fulltextsreach
module.exports.SreachByKey = (key)=>{
    return new Promise((resolve,reject)=>{
        post.find({ $text: { $search: key} },(err,docs)=>{
            if(err) reject(err);
            resolve(docs);
        });
    })
}
module.exports.countSreachByKey = (key)=>{
    return new Promise((resolve,reject)=>{
        post.count({$text: {$search: key }},(err,docs)=>{
            if(err) reject(err);
            resolve(docs);
        })
    })
}


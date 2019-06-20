var mongoose = require('mongoose');
var editorDetail = mongoose.Schema({
    userNameEditor: String,
    chuyenMucPTrach: String,
})

var e = module.exports = mongoose.model('editorDetail',editorDetail);

module.exports.addEditor = (newEditor,callback)=>{
    newEditor.save(callback);
}
module.exports.updateEditor = (userName, chuyenMucPTrach)=>{
    return new Promise((resolve,reject)=>{
        e.findOneAndUpdate({userNameEditor: userName},{$set: {chuyenMucPTrach: chuyenMucPTrach}},(err,docs)=>{
            if(err) reject (err);
            resolve(docs);
        })
    })
}
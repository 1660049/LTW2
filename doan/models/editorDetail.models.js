var mongoose = require('mongoose');
var editorDetail = mongoose.Schema({
    userNameEditor: String,
    chuyenMucPTrach: String,
})

module.exports = mongoose.model('editorDetail',editorDetail);

module.exports.addEditor = (newEditor,callback)=>{
    newEditor.save(callback);
}
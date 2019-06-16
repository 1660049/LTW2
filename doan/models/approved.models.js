var mongoose = require('mongoose');

mongoose.Promise = Promise;

var approvedSchema = mongoose.Schema({
    idPost: mongoose.Types.ObjectId,
    idEditorApproved: mongoose.Types.ObjectId,
})

var approved = module.exports = mongoose.model('approved', approvedSchema);

module.exports.addApproved = (newApproved,callback)=>{
    newApproved.save(callback);
}


var express = require('express');
var routes = express.Router();
var userModel = require('../models/users.models');
var post = require('../models/post.models');
var adminRetricted = require('../middlewares/adminRetricted');
var editorDetail = require('../models/editorDetail.models');
var expPre = require('../models/g_premium.models');
var limit = new Number();
limit = 10;

routes.get('/adminControl/editCategoriesTinGame/:userName', (req, res, next) => {
    var userName = req.params.userName;
    editorDetail.findByIdAndUpdate({ "userNameEditor": userName }, { $set: { "chuyenMucPTrach": "Tin game" } }, (err, callback) => {
        res.redirect('/admin/adminControl/qleditor');
    })
})



routes.get('/adminControl/editCategoriesTinEsport/:userName', (req, res, next) => {
    var userName = req.params.userName;
    editorDetail.findByIdAndUpdate({ "userNameEditor": userName }, { $set: { "chuyenMucPTrach": "Tin esport" } }, (err, callback) => {
        res.redirect('/admin/adminControl/qleditor');
    })
})

routes.get('/adminControl/editCategoriesCamNang/:userName', (req, res, next) => {
    var userName = req.params.userName;
    editorDetail.findByIdAndUpdate({ "userNameEditor": userName }, { $set: { "chuyenMucPTrach": "Cẩm nang" } }, (err, callback) => {
        res.redirect('/admin/adminControl/qleditor');
    })
})

routes.get('/adminControl/editCategoriesCongDong/:userName', (req, res, next) => {
    var userName = req.params.userName;
    editorDetail.findByIdAndUpdate({ "userNameEditor": userName }, { $set: { "chuyenMucPTrach": "Cộng đồng" } }, (err, callback) => {
        res.redirect('/admin/adminControl/qleditor');
    })
})

routes.get('/adminControl', adminRetricted, (req, res, next) => {
    res.render('viewAdmin/admin');
})

routes.get('/adminControl/qltk', adminRetricted, (req, res, next) => {
    userModel.find({ "role": { $ne: 'admin' } }, (err, docs) => {
        res.render('viewAdmin/qltkadmin', { user: docs });
    })
})

routes.get('/adminControl/editRoleWriter/:id', adminRetricted, (req, res, next) => {
    var idUser = req.params.id;
    userModel.findByIdAndUpdate(idUser, { $set: { "role": "writer" } }, (err, docs) => {
        res.redirect('/admin/adminControl/qltk');
    })
})
routes.get('/adminControl/editRoleG_premium/:id', adminRetricted, (req, res, next) => {
    var idUser = req.params.id;
    var now = new Date();
    var expDate = new Date(now.getFullYear(),now.getMonth(),now.getDate()+ 7);
    userModel.findByIdAndUpdate(idUser, { $set: { "role": "g_premium" } }, (err, docs) => {
        expPre.addNewSub(docs.userName,expDate,(err,docs)=>{
            res.redirect('/admin/adminControl/renewed');
        })
    })
})
routes.get('/adminControl/renewed', adminRetricted,(req,res,next)=>{
    var date = new Date();
    userModel.aggregate([
        {
           $lookup:
              {
                 from: "exppres",
                 localField: "userName",
                 foreignField: "user",
                 as: "exp"
             }
        },{
                 $match:
                     {
                         "exp.expPremium": {$lt: date}
                     }
             }
     ],(err,docs)=>{
        res.render('viewAdmin/renewed',{user: docs});
     })
})
routes.get('/adminControl/admin/renews/:userName', adminRetricted, (req,res,next)=>{
    var userName = req.params.userName;
    var now = new Date();
    var expDate = new Date(now.getFullYear(),now.getMonth(),now.getDate()+ 7);
    expPre.updatePremium(userName,expDate).then(docs=>{
        console.log(docs);
    }).catch(err=>{res.json(err)});
})

routes.get('/adminControl/editRoleEditor/:id', adminRetricted, (req, res, next) => {
    var idUser = req.params.id;

    userModel.findByIdAndUpdate(idUser, { $set: { "role": "editor" } }, (err, docs) => {
        var string = "chưa được ủy quyền";
        var newEditor = new editorDetail({
            userNameEditor: docs.userName,
            chuyenMucPTrach: string,
        });
        editorDetail.addEditor(newEditor, (err, callback) => {

        });
        res.redirect('/admin/adminControl/qlEditor');
    })
})


routes.get('/adminControl/qlbv', adminRetricted, (req, res, next) => {
    var page = req.query.page || 1;
    if (page < 1) page = 1;
    var start_offset = (page - 1) * limit;
    Promise.all([post.getAllNotApproved(start_offset), post.countGetNotApproved()]).then(([post, Ctotal]) => {
        var postchunks = [];
        var size = 1;
        for (var i = 0; i < post.length; i += size) {
            postchunks.push(post.slice(i, i + size));
        }
        var total = new Number();
        total = Ctotal;
        var nPage = new Number();
        nPage = Math.floor(total / limit);
        if (total % limit >= 0)
            nPages = nPage + 1;
        var page_numbers = [];
        for (var i = 1; i <= nPages; i++) {
            page_numbers.push({
                value: i,
                active: i === +page
            })
        }
        res.render('viewAdmin/adminAppro', {
            post: postchunks,
            page_numbers
        });
    }).catch((err) => next(err))
})

routes.get('/adminControl/qlpost', adminRetricted, (req, res, next) => {
    Promise.all([post.getAllApprovedAd(), post.countGetApprovedAd()]).then(([post, Ctotal]) => {
        res.render('viewAdmin/qlpost', {
            post
        });
    }).catch((err) => next(err))
})

routes.get('/viewDetail/:id', adminRetricted, (req, res, next) => {
    var id = req.params.id;
    post.SingleID(id).then((docs) => {
        res.render('viewAdmin/adminviewpost', { post: docs });
    }).catch((err) => { res.end(err) });
})

routes.get('/approved/:id', adminRetricted, (req, res, next) => {
    var idPost = req.params.id;
    var name = req.user.userName
    post.approvedPost(idPost, name).then((docs) => {
    }).catch(err => { throw err });
    res.redirect('/admin/adminControl/qlbv');
})
routes.get('/adminControl/qleditor', adminRetricted, (req, res, next) => {
    editorDetail.find((err, docs) => {
        res.render('viewAdmin/qlEditor', { user: docs });
    })
})
module.exports = routes;
var express = require('express');
var routes = express.Router();
var userModel = require('../models/users.models');
var post = require('../models/post.models');
var adminRetricted = require('../middlewares/adminRetricted');
var editorDetail = require('../models/editorDetail.models');
var tag = require('../models/tags.models');
var cat = require('../models/categories.models');
var expPre = require('../models/g_premium.models');
var limit = new Number();
limit = 10;

routes.get('/adminControl/editCategoriesTinGame/:userName', (req, res, next) => {
    var chuyenMucPTrach = 'Tin game'
    var userName = req.params.userName;
    editorDetail.updateEditor(userName,chuyenMucPTrach).then(docs=>{
        res.redirect('/admin/adminControl/qleditor');
    }).catch((err)=>{next(err)})
})

routes.get('/tagManager',adminRetricted,(req,res,next)=>{
    tag.find((err,docs)=>{
        cat.find((err,cat)=>{
            res.render('viewAdmin/tagmanager',{
                tag: docs,
                cat
            })
        })
    })
})
routes.get('/catManager',adminRetricted,(req,res,next)=>{
    cat.find((err,docs)=>{
        res.render('viewAdmin/catmanager',{
            cat: docs
        })
    })
})

routes.post('/tag/add',adminRetricted,(req,res,next)=>{
    console.log(req.body);
    var newtag = new tag({
        catParentName: req.body.cat,
        tagName: req.body.tagName
    })
    newtag.save((err,docs)=>{
        res.redirect('/admin/tagManager')
    })
})
routes.post('/tag/edit/:id',adminRetricted,(req,res,next)=>{
    var idTag = req.params.id;
    tag.findByIdAndUpdate(idTag,{$set: {catParentName: req.body.catParentName,tagName: req.body.tagName}},(err,docs)=>{
        res.redirect('/admin/tagManager')
    })
})
routes.get('/tag/delete/:id',adminRetricted,(req,res,next)=>{
    var idTag = req.params.id;
    tag.findByIdAndDelete(idTag,(err,docs)=>{
        res.redirect('/admin/tagManager')
    })
})

routes.post('/cat/add',adminRetricted,(req,res,next)=>{
    console.log(req.body);
    var newCat = new cat({
        catName: req.body.catName
    })
    newCat.save((err,docs)=>{
        res.redirect('/admin/catManager')
    })
})
routes.post('/cat/edit/:id',adminRetricted,(req,res,next)=>{
    var idCat = req.params.id;
    cat.findByIdAndUpdate(idCat,{$set: {catName: req.body.catName}},(err,docs)=>{
        res.redirect('/admin/catManager')
    })
})
routes.get('/cat/delete/:id',adminRetricted,(req,res,next)=>{
    var idCat = req.params.id;
    cat.findByIdAndDelete(idCat,(err,docs)=>{
        res.redirect('/admin/catManager')
    })
})

routes.get('/adminControl/editCategoriesTinEsport/:userName', (req, res, next) => {
    var chuyenMucPTrach = 'Tin esport'
    var userName = req.params.userName;
    editorDetail.updateEditor(userName,chuyenMucPTrach).then(docs=>{
        res.redirect('/admin/adminControl/qleditor');
    }).catch((err)=>{next(err)})
})

routes.get('/adminControl/editCategoriesCamNang/:userName', (req, res, next) => {
    var chuyenMucPTrach = 'Cẩm nang'
    var userName = req.params.userName;
    editorDetail.updateEditor(userName,chuyenMucPTrach).then(docs=>{
        res.redirect('/admin/adminControl/qleditor');
    }).catch((err)=>{next(err)})
})

routes.get('/adminControl/editCategoriesCongDong/:userName', (req, res, next) => {
    var chuyenMucPTrach = 'Cộng đồng'
    var userName = req.params.userName;
    editorDetail.updateEditor(userName,chuyenMucPTrach).then(docs=>{
        res.redirect('/admin/adminControl/qleditor');
    }).catch((err)=>{next(err)})
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
    var date = new Date();
    post.approvedPostDate(idPost, name, date).then((docs) => {
    }).catch(err => { throw err });
    res.redirect('/admin/adminControl/qlbv');
})
routes.get('/adminControl/qleditor', adminRetricted, (req, res, next) => {
    editorDetail.find((err, docs) => {
        res.render('viewAdmin/qlEditor', { user: docs });
    })
})
module.exports = routes;
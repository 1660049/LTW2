var express = require('express');
var routes = express.Router();
var mongoose = require('mongoose');
var Users = require('../models/users.models');
var post = require('../models/post.models');
var approved = require('../models/approved.models');
var passport = require('passport');
var editorDetail = require('../models/editorDetail.models');
var editorRestricted = require('../middlewares/editorRetricted');
var limit = new Number();
limit = 6;

routes.use(require('../middlewares/auth.mdw'));

routes.get('/approved/:id', editorRestricted, (req, res, next) => {
    var idPost = req.params.id;
    var userEditor = req.user.userName;
    post.approvedPost(idPost,userEditor).then((docs) => {
    }).catch(err => { throw err });
    res.redirect('/editor/listapproved');
})
routes.post('/approved/:id', editorRestricted, (req,res,next)=>{
    var idPost = req.params.id;
    var userEditor = req.user.userName;
    var date = req.body.ngayXuatBan;
    post.approvedPostDate(idPost,userEditor,date).then((docs)=>{
        res.redirect('/editor/listapproved');
    }).catch(err=>{res.json(err)});
})
routes.get('/listapproved', editorRestricted,(req,res,next)=>{
    var userEditor = req.user.userName;
    post.getAllApprovedEd(userEditor).then((docs)=>{
        res.render('editor/listPost',{post: docs});
    }).catch(err=>{res.json(err)});
})

routes.get('/updatePrePost/:id', editorRestricted,(req,res,next)=>{
    var idPost = req.params.id;
    post.findByIdAndUpdate(idPost,{$set: {premium: true}},(err,docs)=>{
        res.redirect('/editor/listapproved');
    });
})

routes.get('/updatePost/:id', editorRestricted,(req,res,next)=>{
    var idPost = req.params.id;
    post.findByIdAndUpdate(idPost,{$set: {premium: false}},(err,docs)=>{
        res.redirect('/editor/browsepost');
    });
})
routes.get('/draft/:id', editorRestricted, (req, res, next) => {
    var idPost = req.params.id;
    post.findByIdAndUpdate(idPost, {$set: {duyet: null}},(callback)=>{
        res.redirect('/editor/listapproved');
    })
})
routes.get('/browsepost', editorRestricted, (req, res, next) => {
    var userName = req.user.userName;
    var page = req.query.page || 1;
    if (page >= 0) page = 1;
    var start_offset = (page - 1) * limit;
    editorDetail.findOne({ "userNameEditor": userName }, (err, docs) => {
        var chuyenMuc = docs.chuyenMucPTrach;
        Promise.all([post.getAllNotApprovedEd(start_offset, chuyenMuc), post.countGetNotApprovedEd(chuyenMuc)]).then(([post, Ctotal]) => {
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
                console.log(nPages);
            var page_numbers = [];
            for (var i = 1; i <= nPages; i++) {
                page_numbers.push({
                    value: i,
                    active: i === +page
                })
            }
            res.render('editor/browsepost', {
                post: postchunks,
                page_numbers
            });
        }).catch((err) => next(err))
    })

})
routes.get('/viewDetail/:id', editorRestricted, (req, res, next) => {
    var id = req.params.id;
    post.SingleID(id).then((docs) => {
        res.render('editor/editorVPost', { post: docs });
    }).catch((err) => { res.end(err) });
})

module.exports = routes;


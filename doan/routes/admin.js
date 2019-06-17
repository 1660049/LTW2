var express = require('express');
var routes = express.Router();
var userModel = require('../models/users.models');
var post = require('../models/post.models');
var adminRetricted = require('../middlewares/adminRetricted');
var limit = new Number();
limit = 10;

routes.get('/adminControl', adminRetricted, (req, res, next) => {
    res.render('viewAdmin/admin');
})

routes.get('/adminControl/qltk', adminRetricted, (req, res, next) => {
    userModel.find({"role": {$ne: 'admin'}}, (err, docs) => {
        res.render('viewAdmin/qltkadmin', { user: docs });
    })
})

routes.get('/adminControl/editRoleWriter/:id', adminRetricted, (req, res, next) => {
    var idUser = req.params.id;
    userModel.findByIdAndUpdate(idUser, { $set: { "role": "writer" } }, (err, docs) => {
        res.redirect('/admin/adminControl/qltk');
    })
})

routes.get('/adminControl/editRoleEditor/:id', adminRetricted, (req, res, next) => {
    var idUser = req.params.id;
    userModel.findByIdAndUpdate(idUser, { $set: { "role": "editor" } }, (err, docs) => {
        res.redirect('/admin/adminControl/qltk');
    })
})
routes.get('/adminControl/editRoleAdmin/:id', adminRetricted, (req, res, next) => {
    var idUser = req.params.id;
    userModel.findByIdAndUpdate(idUser, { $set: { "role": "admin" } }, (err, docs) => {
        res.redirect('/admin/adminControl/qltk');
    })
})


routes.get('/adminControl/qlbv', adminRetricted, (req, res, next) => {
    var page = req.query.page || 1;
    if (page < 1) page = 1;
    var start_offset = (page - 1) * limit;
    Promise.all([post.getAllNotApproved(start_offset), post.countGetNotApproved()]).then(([post, Ctotal]) => {
        if (post) {
            var postchunks = [];
            var size = 1;
            for (var i = 0; i < post.length; i += size) {
                postchunks.push(post.slice(i, i + size));
            }
        };
        var total = new Number();
        total = Ctotal;
        var nPage = new Number();
        console.log(Math.floor(total / limit));
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
        if (postchunks)
            res.render('viewAdmin/adminAppro', {
                post: postchunks,
                page_numbers
            });
        else res.render('viewAdmin/adminAppro');
    }).catch((err) => next(err))
})

routes.get('/adminControl/qlpost', adminRetricted, (req, res, next) => {
    var page = req.query.page || 1;
    if (page < 1) page = 1;
    var start_offset = (page - 1) * limit;
    Promise.all([post.getAllApprovedAd(start_offset), post.countGetApprovedAd()]).then(([post, Ctotal]) => {
        if (post) {
            var postchunks = [];
            var size = 1;
            for (var i = 0; i < post.length; i += size) {
                postchunks.push(post.slice(i, i + size));
            }
        };
        var total = new Number();
        total = Ctotal;
        var nPage = new Number();
        console.log(Math.floor(total / limit));
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
            res.render('viewAdmin/qlpost', {
                post: postchunks,
                page_numbers
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
    post.approvedPost(idPost).then((docs) => {
    }).catch(err => { throw err });
    res.redirect('/admin/adminControl/qlbv');
})

routes.get('/adminControl/qleditor', adminRetricted, (req, res, next) => {
    res.render('viewAdmin/qlEditor');
})
module.exports = routes;
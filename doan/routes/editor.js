var express = require('express');
var routes = express.Router();
var mongoose = require('mongoose');
var Users = require('../models/users.models');
var post = require('../models/post.models');
var approved = require('../models/approved.models');
var passport = require('passport');
var editorRestricted = require('../middlewares/editorRetricted');
var limit = new Number();
limit = 10;

routes.use(require('../middlewares/auth.mdw'));

routes.get('/approved/:id', editorRestricted, (req, res, next) => {
    var idPost = req.params.id;
    post.approvedPost(idPost).then((docs)=>{
    }).catch(err=>{throw err});
    res.redirect('/editor/browsepost');
})
routes.get('/browsepost', editorRestricted, (req, res, next) => {
    var page = req.query.page || 1;
    if (page < 1) page = 1;
    var start_offset = (page - 1) * limit;
    Promise.all([post.getAllNotApproved(), post.countGetNotApproved()]).then(([post, Ctotal]) => {
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
        if (total % limit > 0)
            nPages = nPage + 1;
        var page_numbers = [];
        for (var i = 1; i <= nPages; i++) {
            page_numbers.push({
                value: i,
                active: i === +page
            })
        }
        if(postchunks)
        res.render('browsepost', {
            post: postchunks,
            page_numbers
        });
        else res.render('browserpost');
    }).catch((err) => next(err))
})
routes.get('/viewDetail/:id', editorRestricted, (req, res, next) => {
    var id = req.params.id;
    post.SingleID(id).then((docs) => {
        res.render('editorVPost', { post: docs });
    }).catch((err) => { res.end(err) });
})

module.exports = routes;


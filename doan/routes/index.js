var express = require('express');
var routes = express.Router();
var restricted = require('../middlewares/restricted');
var postModel = require('../models/post.models');
var moment = require('moment');
var mongoose = require('mongoose');

routes.get('/', (req, res, next) => {
    var date = new Date();
    var date = date.toISOString();

    Promise.all([postModel.getRecentPost(date), postModel.getMostViewsPost(date)]).then(([postN, postM]) => {
        if (postN) {
            var postNchunks = [];
            var Nsize = 2;
            for (var i = 0; i < postN.length; i += Nsize) {
                postNchunks.push(postN.slice(i, i + Nsize));
            }
        }

        if(postM){
            var postMchunks =[];
            var Msize = 1;
            for (var i = 0; i < postM.length; i += Msize) {
                postMchunks.push(postM.slice(i, i + Msize));
            }
        }

        res.render('dashboard', {
            post: postNchunks,
            postM: postMchunks
        });
    }).catch(err => { next(err) });

    // postModel.getRecentPost(date).then(docs => {
    //     console.log(docs);
    //     var postChunks = [];
    //     var chunkSize = 2;
    //     for (var i = 0; i < docs.length; i += chunkSize) {
    //         postChunks.push(docs.slice(i, i + chunkSize));
    //     }
    // res.render('dashboard', {
    //     post: postChunks,
    // })
    // }).catch(err=> {next(err)});
})

routes.get('/post/:id', (req, res, next) => {
    var id = req.params.id;
    postModel.findById(id, (err, docs) => {
        if (err) return res.json({ error: err.message });
        res.render('post', { post: docs });
    });
})

routes.get('/demo', (req, res, next) => {
    res.render('demo');
})


routes.get('/roleError', (req, res, next) => {
    res.render('roleError');
})
module.exports = routes;
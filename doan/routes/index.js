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
        res.render('dashboard',{
            post: postN,
            postM: postM
        });
    }).catch(err=>{next(err)});
    
    // postModel.getRecentPost(date).then(docs => {
    //     var postChunks = [];
    //     var chunkSize = 2;
    //     for (var i = 0; i < docs.length; i += chunkSize) {
    //         postChunks.push(docs.slice(i, i + chunkSize));
    //     }
    // res.render('dashboard', {
    //     post: postChunks,
    // })
    // }).catch(next())
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
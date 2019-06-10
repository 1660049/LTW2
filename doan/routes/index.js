var express = require('express');
var routes = express.Router();
var restricted = require('../middlewares/restricted');
var postModel = require('../models/post.models');
var moment = require('moment');
var mongoose = require('mongoose');

routes.get('/', (req, res, next) => {
    var date = new Date();
    var date = date.toISOString();
    var tinGame = "Tin game";
    var tinEsport = "Tin esport";
    var camNang = "Cẩm nang";
    var congDong = "Cộng đồng";
    Promise.all([postModel.getRecentPost(date),
    postModel.getMostViewsPost(date),
    postModel.singleCategories(date,tinGame),
    postModel.singleCategories(date,tinEsport),
    postModel.singleCategories(date,camNang),
    postModel.singleCategories(date,congDong),
    postModel.countCat(date,tinGame),
    postModel.countCat(date,tinEsport),
    postModel.countCat(date,camNang),
    postModel.countCat(date,congDong),
    ]).then(([postN, postM,nPostTG,nPostTE,nPostCN,nPostCD,countTG,countTE,countCN,countCD]) => {
        if (postN) {
            var postNchunks = [];
            var Nsize = 2;
            for (var i = 0; i < postN.length; i += Nsize) {
                postNchunks.push(postN.slice(i, i + Nsize));
            }
        }

        if (postM) {
            var postMchunks = [];
            var Msize = 1;
            for (var i = 0; i < postM.length; i += Msize) {
                postMchunks.push(postM.slice(i, i + Msize));
            }
        }
        if(nPostTG){
            var arrTG = [];
            var arrsize = 1;
            for (var i = 0; i < nPostTG.length; i += arrsize) {
                arrTG.push(nPostTG.slice(i, i + arrsize));
            }
        }
        if(nPostTE){
            var arrTE = [];
            var arrsize = 1;
            for (var i = 0; i < nPostTE.length; i += arrsize) {
                arrTE.push(nPostTE.slice(i, i + arrsize));
            }
        }
        if(nPostCN){
            var arrCN = [];
            var arrsize = 1;
            for (var i = 0; i < nPostCN.length; i += arrsize) {
                arrCN.push(nPostCN.slice(i, i + arrsize));
            }
        }
        if(nPostCD){
            var arrCD = [];
            var arrsize = 1;
            for (var i = 0; i < nPostCD.length; i += arrsize) {
                arrCD.push(nPostCD.slice(i, i + arrsize));
            }
        }
        console.log(countTG);
        res.render('dashboard', {
            post: postNchunks,
            postM: postMchunks,
            postTG: arrTG,
            postTE: arrTE,
            postCN: arrCN,
            postCD: arrCD,
            countTG,countTE,countCN,countCD
        });
    }).catch(err => { next(err) });
})

routes.get('/post/:id', (req, res, next) => {
    var id = req.params.id;
    postModel.SingleID(id).then((docs) => {
        var slviews = Number;
        slviews = docs.views + 1;
        postModel.findByIdAndUpdate(id, { $set: { views: slviews } }, (err, docs) => {
            res.render('post', { post: docs });
        })
    }).catch((err) => { res.end(err) });
})

routes.get('/demo', (req, res, next) => {
    res.render('demo');
})


routes.get('/roleError', (req, res, next) => {
    res.render('roleError');
})

module.exports = routes;
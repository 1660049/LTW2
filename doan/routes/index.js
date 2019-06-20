var express = require('express');
var routes = express.Router();
var restricted = require('../middlewares/restricted');
var postModel = require('../models/post.models');
var commentModel = require('../models/comment.models');
var userModel = require('../models/users.models');
var catModel = require('../models/categories.models');
var tagModel = require('../models/tags.models');
var g_premiumRetricted = require('../middlewares/g_premiumRetricted');
var date = new Date();
var date = date.toISOString();
var tinGame = "Tin game";
var tinEsport = "Tin Esport";
var camNang = "Cẩm nang";
var congDong = "Cộng đồng";
var limit = new Number();
limit = 6;
var date = new Date();
var date = date.toISOString();

routes.get('/demo',(req,res,next)=>{
    Promise.all([catModel.getCat(),tagModel.getTag()]).then(([cat,tag])=>{
        console.log(tag);
        res.render('demo',{
            cat, 
            tag
        });
    }).catch(err=>{next(err)});
})

routes.get('/', (req, res, next) => {
    Promise.all([postModel.getRecentPost(date),
    postModel.getPremiumPost(date),
    postModel.getMostViewsPost(date),
    postModel.findCategories(date, tinGame),
    postModel.findCategories(date, tinEsport),
    postModel.findCategories(date, camNang),
    postModel.findCategories(date, congDong),
    postModel.countCat(date, tinGame),
    postModel.countCat(date, tinEsport),
    postModel.countCat(date, camNang),
    postModel.countCat(date, congDong),
    postModel.getRecentPostHeader1(date),
    postModel.getRecentPostHeader2(date),
    postModel.getRecentPostHeader3(date),
    ]).then(([postN, premiumPost,postM, nPostTG, nPostTE, nPostCN, nPostCD, countTG, countTE, countCN, countCD,postHeader1,postHeader2,postHeader3]) => {
        console.log(date);
        res.render('dashboard', {
            premiumPost,
            post: postN,
            postM: postM,
            postTG: nPostTG,
            postTE: nPostTE,
            postCN: nPostCN,
            postCD: nPostCD,
            countTG, countTE, countCN, countCD,
            postHeader1,postHeader2,postHeader3
        });
    }).catch(err => { next(err) });
})

routes.get('/post/:id', (req, res, next) => {
    var date = new Date();
    var date = date.toISOString();
    var id = req.params.id;
    Promise.all([
        commentModel.getComment(id),
        commentModel.getCountComment(id),
        postModel.SingleID(id),
    ]).then(([comment, countcm, post]) => {
        var slviews = Number;
        slviews = post.views + 1;
        postModel.findByIdAndUpdate(id, { $set: { views: slviews } }, (callback) => { });
        var iduser = post.idAuther;
        var tagpost = post.tag;
        Promise.all([userModel.getUserById(iduser), postModel.GetPostWithTagName(date, tagpost)]).then(([user, postlq]) => {
            res.render('post', {
                postlq,
                post: post,
                nameAuther: user.name,
                commentsPost: comment,
                totalComment: countcm
            })
        }).catch(error => res.json(error));
    }).catch((err) => { res.json(err) });
})
routes.get('/premium', g_premiumRetricted,(req,res,next)=>{
    postModel.find({ngayXuatBan: {$lte: {date}},duyet: true, premium: true},(err,post)=>{
        res.render('premium',post);
    }).sort({ngayDang: -1});
})
routes.get('/postPremium/:id',g_premiumRetricted, (req, res, next) => {
    var date = new Date();
    var date = date.toISOString();
    var id = req.params.id;
    Promise.all([
        commentModel.getComment(id),
        commentModel.getCountComment(id),
        postModel.SingleID(id),
    ]).then(([comment, countcm, post]) => {
        var slviews = Number;
        slviews = post.views + 1;
        postModel.findByIdAndUpdate(id, { $set: { views: slviews } }, (callback) => { });
        var iduser = post.idAuther;
        var tagpost = post.tag;
        Promise.all([userModel.getUserById(iduser), postModel.GetPostWithTagName(date, tagpost)]).then(([user, postlq]) => {
            res.render('post', {
                postlq,
                post: post,
                nameAuther: user.name,
                commentsPost: comment,
                totalComment: countcm
            })
        }).catch(error => res.json(error));
    }).catch((err) => { res.json(err) });
})

routes.get('/categories/:catName', (req, res, next) => {
    var catName = req.params.catName;
    var page = req.query.page || 1;
    if (page <= 1) page = 1;
    var start_offset = (page - 1) * limit;
    Promise.all([
        postModel.findAllCategories(date, catName, start_offset),
        postModel.countCat(date, catName),
        postModel.countCat(date, tinGame),
        postModel.countCat(date, tinEsport),
        postModel.countCat(date, camNang),
        postModel.countCat(date, congDong),
    ]).then(([postN, countCat, countTG, countTE, countCN, countCD]) => {
        var total = new Number();
        total = countCat;
        var nPage = new Number();
        nPage = Math.floor(total / limit);
        if (total % limit >= 0)
            nPages = nPage + 1;
        var page_numbers = [];
        for (var i = 1; i < nPages; i++) {
            page_numbers.push({
                value: i,
                active: i === +page
            })
        }
        if (postN) {
            var postNchunks = [];
            var Nsize = 2;
            for (var i = 0; i < postN.length; i += Nsize) {
                postNchunks.push(postN.slice(i, i + Nsize));
            }
        }
        res.render('categories', {
            post: postNchunks,
            page_numbers,
            countTG,
            countTE,
            countCN,
            countCD,
            catName
        })
    }).catch(err => { next(err); });
})

routes.get('/tags/:tagName', (req, res, next) => {
    var tagName = req.params.tagName;
    var page = req.query.page || 1;
    if (page <= 1) page = 1;
    var start_offset = (page - 1) * limit;
    Promise.all([
        postModel.findAllWithTagName(date, tagName),
        postModel.countTag(date, tagName)
    ]).then(([postN, countTag]) => {
        var total = new Number();
        total = countTag;
        var nPage = new Number();
        nPage = Math.floor(total / limit);
        if (total % limit >= 0)
            nPages = nPage + 1;
        var page_numbers = [];
        for (var i = 1; i < nPages; i++) {
            page_numbers.push({
                value: i,
                active: i === +page
            })
        }
        res.render('tag', {
            post: postN,
            page_numbers,
            tagName
        })
    }).catch()
})

routes.get('/roleError', (req, res, next) => {
    res.render('roleError');
})
routes.get('/roleSubcrise', (req, res, next) => {
    res.render('roleSubcrise');
})
routes.post('/comment', (req, res, next) => {
    var newComment = commentModel({
        idPost: req.body.id,
        name: req.body.name,
        email: req.body.email,
        comment: req.body.message,
        time: new Date()
    });
    commentModel.addComment(newComment, (err, docs) => {
        res.redirect(`/post/${req.body.id}`);
    })
})

routes.post('/resreach', (req, res, next) => {
    
    var keyword = req.body.key;
    Promise.all([postModel.SreachByKey(keyword), postModel.countSreachByKey(keyword)]).then(([resultForKey, countResult]) => {
        res.render('result',{
            resultForKey,
            countResult,
        })
    }).catch(err => {next(err)});
})


module.exports = routes;
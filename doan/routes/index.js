var express = require('express');
var routes = express.Router();
var restricted = require('../middlewares/restricted');
var postModel = require('../models/post.models');
var moment = require('moment');

routes.get('/', (req, res, next) => {
   postModel.find((err,docs)=>{
        var postChunks = [];
        var chunkSize = 2;
        for(var i = 0; i < docs.length; i+= chunkSize){
            docs.ngayDang = moment(docs.ngayDang).format("MMM Do YY");
            postChunks.push(docs.slice(i, i+chunkSize));
        }
       res.render('dashboard',{post: postChunks});
        //res.render('dashboard',{post: docs});
   });
})

routes.get('/post', (req, res, next) => {
    res.render('post');
})

routes.get('/demo', (req, res, next) => {
    res.render('demo');
})

routes.get('/uppost', restricted, (req, res, next) => {
    res.render('uppost');
})
module.exports = routes;
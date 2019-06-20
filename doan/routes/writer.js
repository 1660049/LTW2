var express = require('express');
var routes = express.Router();
var mongoose = require('mongoose');
var Users = require('../models/users.models');
var post = require('../models/post.models');
var passport = require('passport');

var writerRestricted = require('../middlewares/writerRestricted');
var limit = new Number();
limit = 6;
routes.get('/uppost', writerRestricted, (req, res, next) => {
    res.render('viewWriter/uppost');
})

routes.get('/loadlistbitc',writerRestricted,(req,res,next)=>{
    var id = req.user._id;
    Promise.all([post.GetPostByUserTC(id)
    ]).then(([post]) => {
        res.render('viewWriter/loadlistbitc', {
            post
        });
    }).catch(err=>{next(err)});
})
routes.get('/updatepost/:id',writerRestricted, (req,res,next)=>{
    var idpost = req.params.id;
    post.findById(idpost,(err,docs)=>{
        res.render('viewWriter/updatePost',{docs});
    })
})
routes.post('/editPost/:id',writerRestricted, (req,res,next)=>{
    var idPost = req.params.id;
    var Post = ({
        tieuDe: req.body.tieuDe,
        chuyenMuc: req.body.chuyenMuc,
        tag: req.body.tag,
        ngayDang: req.body.ngayDang,
        abtract: req.body.abtract,
        content: req.body.content,
        idAuther: req.user._id,
        ngayXuatBan: req.body.ngayDang,
      });
      post.findByIdAndUpdate(idPost,{$set: Post},(err,docs)=>{
          res.redirect('/writer/loadpost');
      })
})
routes.get('/loadpost', writerRestricted, (req, res, next) => {
    var id = req.user._id;
    console.log(id);
    var page = req.query.page || 1;
    if (page < 1) page = 1;
    var start_offset = (page - 1) * limit;
    Promise.all([post.GetPostByUser(start_offset,id),
    post.countGetPostByUser( id)
    ]).then(([post, Ctotal]) => {
        var postchunks = [];
        var size = 2;
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
        res.render('viewWriter/loadlistpost', {
            post: postchunks,
            page_numbers
        });
    }).catch();

})
module.exports = routes;
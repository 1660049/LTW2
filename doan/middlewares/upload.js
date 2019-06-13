var multer = require('multer');
var mongoose = require('mongoose');
var postUser = require('../models/post.models');
var restricted = require('./restricted');
var authmdw = require('./auth.mdw');
module.exports = function (app) {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/img')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  });

  app.post('/writer/uppost', restricted, (req, res, next) => {
    multer({ storage }).single('file')(req, res, err => {
      if (err) {
        return res.json({
          error: err.message
        })
      }
      // var date = new Date();
      // date = req.body.ngayDang;
      // date.toISOString();
      var newPost = new postUser({
        img: '/public/img/' + req.file.filename,
        tieuDe: req.body.tieuDe,
        chuyenMuc: req.body.chuyenMuc,
        tag: req.body.tag,
        ngayDang: req.body.ngayDang,
        abtract: req.body.abtract,
        content: req.body.content,
        idAuther: req.user._id,
        duyet: false,
        views: 0,
      });
      postUser.addPost(newPost, (err, post) => {
        if (err) return res.json({ error: err.message });
      });
      res.redirect('/user/uppost');
    })
  })
}
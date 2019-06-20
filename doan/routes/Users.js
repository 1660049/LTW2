var express = require('express');
var routes = express.Router();
var mongoose = require('mongoose');
var Users = require('../models/users.models');
var passport = require('passport');
var restricted = require('../middlewares/restricted');
var writerRestricted = require('../middlewares/writerRestricted');

routes.get('/login', (req, res) => {
    res.render('login');
})
routes.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        console.log(user);
        if (err) return next(err);

        if (!user) {
            return res.render('login', {
                err_message: info.message
            })
        }
        var retUrl = req.query.retUrl || '/';
        req.logIn(user, err => {
            if (err) return next(err);
            return res.redirect(retUrl);
        });
    })(req, res, next);
})

routes.get('/regist', (req, res, next) => {
    res.render('regist');
})

routes.post('/regist', (req, res, next) => {
    var user = new Users({
        userName: req.body.f_Username,
        email: req.body.f_Email,
        password: req.body.password,
        name: req.body.f_Name,
        role: 'guest'
    });
    Users.addUser(user, (err, usCallback) => {
        if (err) {
            return res.json({error: err.message});
        }
    });
    res.redirect('login');
})

routes.get('/profile', restricted, (req, res, next) => {
    Users.findById(req.user._id,(err,docs)=>{
        res.render('profile',{user: docs});
    })
})

routes.post('/logout',restricted,(req, res, next) => {
    req.logOut();
    res.redirect('login');
})

routes.get('/is-available', (req, res, next) => {
    var user = req.query.user;
    Users.getUserByUserName(user,(err,docs)=>{
        if(docs) res.json(false);
        else res.json(true);
    })
})

routes.post('/editprofile',restricted,(req,res,next)=>{
    var user = req.user;
    Users.findByIdAndUpdate(user._id,{$set:{name: req.body.name, email: req.body.email}},(err,docs)=>{
        res.redirect('/user/profile');
    })
})

module.exports = routes;
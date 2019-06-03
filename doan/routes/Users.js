var express = require('express');
var routes = express.Router();
var mongoose = require('mongoose');
var Users = require('../models/users.models');
var passport = require('passport');
var restricted = require('../middlewares/restricted')

routes.get('/login', (req, res) => {
    res.render('login');
})
routes.post('/login',(req,res,next)=>{
    passport.authenticate('local', (err, user, info)=>{
        console.log(user);
        if(err) return next(err);

        if(!user){
            return res.render('login',{
                err_message: info.message
            })
        }
        
        
        req.logIn(user, err =>{
            if(err) return next(err);
            return res.redirect('/');
        });
    })(req,res,next);
})

routes.get('/regist', (req, res, next) => {
    res.render('regist');
})

routes.post('/regist', (req, res, next) => {
    var user = new Users({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
    });
    Users.addUser(user, (err,usCallback)=>{
        if(err){
            
        }
    });
    res.render('regist');
})

routes.get('/profile', restricted, (req, res, next) => {
    res.render('profile');
})

routes.post('/logout', (req, res, next)=>{
    req.logOut();
    res.redirect('login');
});

module.exports = routes;
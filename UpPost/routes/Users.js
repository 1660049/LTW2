var express = require('express');
var routes = express.Router();
var mongoose = require('mongoose');
var Users = require('../models/users.models');

routes.get('/login', (req, res) => {
    res.render('login');
})

routes.post('/login', (res, req, next) => {
    
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
module.exports = routes;
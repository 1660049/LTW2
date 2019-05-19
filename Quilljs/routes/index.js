var express = require('express');
var routes = express.Router();

routes.get('/',(req,res)=>{
    res.render('post', {layout: false});
})
routes.post('/',(req,res)=>{
    console.log(req.body);
    res.render('post', {layout: false});
})
module.exports = routes;
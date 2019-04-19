var express =  require('express');

var routes  = express.Router();

routes.get('/',(req,res)=>{
    res.end('categories');
})

routes.get('/single',(req,res)=>{
    res.end('category');
})
module.exports = routes;
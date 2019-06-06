module.exports = (req,res,next)=>{
    if(!req.user){
        var retUrl = req.originalUrl;
        return res.redirect(`/user/login?retUrl=${retUrl}`);
    }
    var user = req.user;
    if(req.user.role!= 'writer'){
        return res.redirect('/roleError');
    }
    next();
}
module.exports = (req,res,next)=>{
    console.log(req.user);
    if(!req.user){
        var retUrl = req.originalUrl;
        return res.redirect(`/user/login?retUrl=${retUrl}`);
    }
    next();
}
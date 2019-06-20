module.exports = (req, res, next)=> {
    if(req.user) {
        var user = req.user;
        res.locals.isAuthenticated = true;
        res.locals.authUser = req.user;
        res.locals.idUser = req.user._id;
        if(user.role === 'writer'){
            res.locals.writer = true;
        }
        if(user.role === 'editor'){
            res.locals.editor = true;
        }
        if(user.role === 'admin'){
            res.locals.admin = true;
        }
        if(user.role === 'g_premium'){
            res.locals.g_premium = true;
        }
    }
    next();
}
module.exports = (req, res, next)=> {
    if(req.user) {
        var user = req.user;
        res.locals.isAuthenticated = true;
        res.locals.authUser = req.user;
        if(user.role === 'writer'){
            res.locals.writer = true;
        }
    }
    next();
}
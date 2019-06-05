module.exports = (req, res, next)=> {
    if(req.file) {
        res.locals.isUpload= true;
        res.locals.filename_img = req.file.filename;
    }
    next();
}
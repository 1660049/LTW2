var session = require('express-session');

module.exports = function(app){
    app.use(session({
        secret:'myhardScretByBinCi',
        resave: true,
        saveUninitialized: true
    }));
}
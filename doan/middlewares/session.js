var session = require('express-session');

module.exports = function(app){
    app.use(session({
        secret:'binxi1998',
        resave: true,
        saveUninitialized:true
    }));
}
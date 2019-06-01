var passport = require('passport');
var bcrypt = require('bcrypt');
var LocalStrategy = require('passport-local').Strategy;
var UserModels = require('../models/users.models');

module.exports = function (app) {
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(
        new LocalStrategy({
            usernameField: 'userName',
            passwordField: 'password'
        },(userName, password, done)=>{

            UserModels.findOne({userName: userName},(err,user)=>{
                if(err) return done(err);
                if(!user) return done(null, false, { message: 'Incorrect username.' });
                var ret = bcrypt.compareSync(password, user.password);
                if(ret) return done(null, user);
                return done(null, false, {message: 'invalid password'});
            });
            // UserModels.getUserByUserName(userName,(err,user)=>{
            //     if(err) return done(err);
            //     if(!user) return done(null, false, { message: 'Incorrect username.' });
            //     var ret = bcrypt.compareSync(password, user.password);
            //     if(ret) return done(null, user);
            //     return done(null, false, {message: 'invalid password'});
            // });
        })
    );
    passport.serializeUser((user, done) => {
        done(null, user);
      });
    
    passport.deserializeUser((user, done) => {
        done(null, user);
      });
}

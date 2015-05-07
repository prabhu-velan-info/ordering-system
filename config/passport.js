var LocalStrategy   = require('passport-local').Strategy;
var bcrypt   = require('bcrypt-nodejs');

// var User       		= require('../app/models/user');

var db  = require('../models');

var encryptedPassword = null;

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
         
          db.Admin.find({
            where: { 'id': id }
          }).complete(function(err, record) {
             var user = record.values;
             done(err, user);
          });

    });

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
            
          db.Admin.find({
            where: { 'email': email }
          }).complete(function(err, user) {

            if (err)
               return done(err);

            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                db.Admin.create({'email' : email, 'password': generateHash(password)}).success(function(record){                            
                    
                    if(!record){
                        throw err;
                    }
                    else{
                        var newUser = record.values;
                        console.log("----New USER----");
                        console.log(newUser);
                        return done(null, newUser);
                    }
                
                });
            }
            
         
          });

    }));

    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        db.Admin.find({
            where: { 'email': email }
        }).complete(function(err, user) {

                if (err)
                   return done(err);

                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

                userResult = user.values;
                encryptedPassword = user.values.password;
                
                if (!validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                console.log('====USER====');
                console.log(user.values);
                return done(null, user.values);
         
        });

    }));

};


//Purpose : The function is to convert the user password to hash
//Input   : password
//Output   : passwordHash
var generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};


//Purpose : The function will validate the password
//Input   : password
//Output   : true or false
var validPassword = function(password) {
    return bcrypt.compareSync(password, encryptedPassword);
};


var fbUtils = require('./fb_utils.js');
var dbUtils = require('./db_utils.js');

var express = require('express');
var engines = require('consolidate');
var passport = require('passport');

var app = express();
app.engine('html', engines.hogan);
app.set('views', __dirname + '/templates');

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use('/include', express.static(__dirname + '/include'));

passport.use(new FacebookStrategy({
    clientID: "220803898117351",
    clientSecret: "53edb26e9544e5b7ec79b47903746798",
    callbackURL: "http://localhost:8080/auth/facebook/callback"
  },
  function (accessToken, refreshToken, profile, done) {
    // find or create the user
    var user = new Object();
    done(null, user);
  }
));

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { successRedirect: '/dummy_page',
                                      failureRedirect: '/login' }));
                                      
app.get('/dummy_page', function(request, response) {
  response.render('dummy.html', {});
});

app.get('/login', function(request, response) {
  response.render('login.html', {});
});

app.get('/', function(request, response) {
  response.redirect('/auth/facebook');
});
 
app.listen(8080, function() {
	console.log("- Server listening on port 8080");
});

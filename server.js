var fb = require('./fb_utils.js');
var db = require('./db_utils.js');

var express = require('express');
var engines = require('consolidate');
var passport = require('passport');

var app = express();
app.engine('html', engines.hogan);
app.set('views', __dirname + '/templates');
app.use(express.session({secret: 'badsecret'}));

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
app.use(passport.initialize());
//app.use(passport.session());
passport.serializeUser(function(user, done) {
  console.log("ses");
  db.storeUser(user, function(id) {
    done(null, id);
  });
});
passport.deserializeUser(function(id, done) {
  console.log("des");
  db.loadUser(id, function(user) {
    done(null, user);
  });
});

app.use('/include', express.static(__dirname + '/include'));

passport.use(new FacebookStrategy({
    clientID: "220803898117351",
    clientSecret: "53edb26e9544e5b7ec79b47903746798",
    callbackURL: "http://localhost:8080/auth/facebook/callback"
  },
  db.createUser
));

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { successRedirect: '/dummy_page',
                                      failureRedirect: '/login' }));
                                      
app.get('/dummy_page', function(request, response) {
  response.render('dummy.html', {name: request.user.displayName});
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

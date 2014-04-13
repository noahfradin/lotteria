var fb = require('./fb_utils.js');
var db = require('./db_utils.js');

var express = require('express');
var engines = require('consolidate');
var passport = require('passport');

var app = express();
app.engine('html', engines.hogan);
app.set('views', __dirname + '/templates');
app.use(express.cookieParser());
app.use(express.session({secret: 'badsecret'}));

// Database setup
var anyDB = require('any-db');
var conn = anyDB.createConnection('sqlite3://lotteria.db');

// Login setup
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  db.storeUser(user, conn, function(id) {
    console.log("stored user with id " + id);
    done(null, id);
  });
});
passport.deserializeUser(function(id, done) {
  db.loadUser(id, conn, function(user) {
    console.log("loaded user with id " + user.facebook_id);
    done(null, user);
  });
});

// Static redirects
app.use('/include', express.static(__dirname + '/include'));

passport.use(new FacebookStrategy({
    clientID: "220803898117351",
    clientSecret: "53edb26e9544e5b7ec79b47903746798",
    callbackURL: "http://localhost:8080/auth/facebook/callback"
  },
  function (accessToken, refreshToken, profile, done) {
    db.findOrCreate(accessToken, refreshToken, profile, done, conn);
  }
));

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { successRedirect: '/dummy_page',
                                      failureRedirect: '/login' }));
                                      
app.get('/dummy_page', function(request, response) {
  console.log("user is: " + request.user.profile.displayName);
  console.log(request.user);
  response.render('dummy.html', {name: request.user.profile.displayName});
});

app.get('/login', function(request, response) {
  // this should be the page that prompts you to log in
  response.render('login.html', {});
});

app.post('/auth', function(request, response){
  response.redirect('/auth/facebook');
});

app.get('/reset', function(request, response) {
  // Create tables
  db.newTables(conn);
  response.redirect('/');
});

app.get('/', function(request, response) {
  response.render('home(nostache).html', {});
});
 
app.listen(8080, function() {
	console.log("- Server listening on port 8080");
});

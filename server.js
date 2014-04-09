var fb = require('./fb_utils.js');
var db = require('./db_utils.js');

var express = require('express');
var engines = require('consolidate');
var passport = require('passport');

var app = express();
app.engine('html', engines.hogan);
app.set('views', __dirname + '/templates');

//Database setup
var anyDB = require('any-db');
var conn = anyDB.createConnection('sqlite3://lotteria.db');

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  db.storeUser(user, function(id) {
    done(null, id);
  });
});
passport.deserializeUser(function(id, done) {
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

app.post('/auth', function(request, response){
  response.redirect('/auth/facebook');
});

app.get('/', function(request, response) {
  response.render('home(nostache).html', {});
  //Create tables
  conn.query('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,first_name TEXT, last_name TEXT, photo TEXT, tickets BLOB,pools BLOB, facebook_id TEXT')
  .on('error', console.error);
  conn.query('CREATE TABLE IF NOT EXISTS tickets (id INTEGER PRIMARY KEY AUTOINCREMENT, user INTEGER, numbers TEXT, draw_date TEXT, purchase_date TEXT, power_play INTEGER)')
  .on('error', console.error);
  conn.query('CREATE TABLE IF NOT EXISTS pools (id INTEGER PRIMARY KEY AUTOINCREMENT, size INTEGER, users BLOB, tickets BLOB)')
  .on('error', console.error);
});
 
app.listen(8080, function() {
	console.log("- Server listening on port 8080");
});

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
app.use('/public', express.static(__dirname + '/public'));

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
  passport.authenticate('facebook', { successRedirect: '/home',
                                      failureRedirect: '/' }));
                                      
app.get('/dummy_page', function(request, response) {
  console.log("user is: " + request.user.profile.displayName);
  console.log(request.user);
  response.render('dummy.html', {name: request.user.profile.displayName});
});

app.get('/home', function(request, response) {
  // this is the user's personal homepage with their tickets and friend tickets
  // right now it just redirects to your tickets
  response.redirect('/mytickets');
});

app.get('/mytickets', function(request, response) {
  // page with all your tickets
  if (request.user) {
    db.loadAllPoolsForUser(conn, request.user, function(pools) {
      response.render('mytickets.html', {pools: pools});
    });
  } else {
    response.redirect('/');
  }
});

app.get('/picker', function(request, response) {
  // buy into a pool
  if (request.user) {
    response.render('picker.html', {});
  } else {
    response.redirect('/');
  }
});

app.post('/auth', function(request, response){
  response.redirect('/auth/facebook');
});

app.get('/reset', function(request, response) {
  // Create tables
  db.newTables(conn);
  response.redirect('/create_samples');
});

app.get('/create_samples', function(request, response) {
  // Create tables
  db.createSamples(conn);
  response.redirect('/');
});

app.get('/ticketprofile', function(request, response) {
  response.render('ticketProfile.html', {});
});

app.get('/', function(request, response) {
  if (request.user) {
    response.redirect('/home');
  } else {
    response.render('login.html', {});
  }
});
 
app.listen(8080, function() {
  db.newTables(conn);
  db.createSamples(conn);
	console.log("- Server listening on port 8080");
});

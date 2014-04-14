var fb = require('./fb_utils.js');
var db = require('./db_utils.js');

var express = require('express');
var engines = require('consolidate');
var passport = require('passport');

var app = express();
app.engine('html', engines.hogan);
app.set('views', __dirname + '/templates');
app.use(express.bodyParser());
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

app.get('/picker/:id', function(request, response) {
  // buy into a pool
  if (request.user) {
    db.loadPoolByID(conn, request.params.id, function(pool) {
      response.render('picker.html', {pool: pool});
    });
  } else {
    response.redirect('/');
  }
});

app.get('/newPool', function(request, response) {
  // create a new pool
  if (request.user) {
    response.render('newPool.html', {user: request.user});
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

app.get('/ticketprofile/:id', function(request, response) {
  if (request.user) {
    db.loadPoolByID(conn, request.params.id, function(pool) {
      console.log(pool);
      var usernumber = pool.buyins.length;
      response.render('ticketProfile.html', {pool: pool, usernumber: usernumber});
    });
  } else {
    response.redirect('/');
  }
});

app.get('/rewards', function(request, response){
  response.render('rewards.html');
});

app.get('/', function(request, response) {
  if (request.user) {
    response.redirect('/home');
  } else {
    response.render('login.html', {});
  }
});

app.post('/create', function(request, response) {
  if (request.user) {
    var info = new Object();
    info.name = request.body.name;
    info.desc = request.body.desc;
    info.private = request.body.private;
    info.draw_string = request.body.year + "/" + request.body.day + "/" + request.body.month;
    info.main_pic_url = '/public/images/eventPhoto.jpg';
    db.createPool(conn, info, request.user, function(pool_id) {
      console.log("created pool...");
      response.redirect('/ticketprofile/' + pool_id);
    });
  } else {
    response.redirect('/');
  }
});

app.post('/buyin/:id', function(request, response) {
  if (request.user) {
    var info = new Object();
    info.user = request.user;
    info.pool_id = request.params.id;
    info.n1 = request.body.n1;
    info.n1 = request.body.n2;
    info.n1 = request.body.n3;
    info.n1 = request.body.n4;
    info.n1 = request.body.n5;
    db.recordBuyin(conn, info, function(pool_id) {
      console.log("bought into pool...");
      response.redirect('/ticketprofile/' + pool_id);
    });
  } else {
    response.redirect('/');
  }
});
 
app.listen(8080, function() {
  db.newTables(conn);
  db.createSamples(conn);
	console.log("- Server listening on port 8080");
});

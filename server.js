var fb = require('./fb_utils.js');
var db = require('./db_utils.js');

var express = require('express');
var engines = require('consolidate');
var passport = require('passport');
var https = require('https');
var mail = require('nodemailer');
var fs = require('fs');

var AWS = require('aws-sdk');
AWS.config.loadFromPath('.awsconfig.json');

var util = require('util');

var s3 = new AWS.S3({params: {Bucket: 'Lotteria'}});

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
    done(null, id);
  });
});
passport.deserializeUser(function(id, done) {
  db.loadUser(id, conn, function(user) {
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

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['user_friends'] }));

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { successRedirect: '/landing',
                                      failureRedirect: '/' }));
                                      
app.get('/dummy_page', function(request, response) {
  console.log("user is: " + request.user.profile.displayName);
  console.log(request.user);
  response.render('dummy.html', {name: request.user.profile.displayName});
});

app.get('/about', function(request, response) {
    response.render('about.html', {user: request.user});
});

app.get('/mytickets', function(request, response) {
  // page with all your tickets
  if (request.user) {
    db.loadAllPoolsForUser(conn, request.user, function(pools) {
      response.render('mytickets.html', {pools: pools, user: request.user});
    });
  } else {
    promptLogin(request, response, '/mytickets');
  }
});

app.get('/picker/:id', function(request, response) {
  // buy into a pool
  if (request.user) {
    db.loadPoolByID(conn, request.params.id, function(pool) {
      response.render('picker.html', {pool: pool, user: request.user});
    });
  } else {
    promptLogin(request, response, '/ticketprofile/' + request.params.id);
  }
});

app.get('/newPool', function(request, response) {
  // create a new pool
  if (request.user) {
    response.render('newPool.html', {user: request.user, user: request.user});
  } else {
    promptLogin(request, response, '/newPool');
  }
});

app.post('/auth', function(request, response) {
  response.redirect('/auth/facebook');
});

app.get('/logout', function(request, response) {
  request.logout();
  response.redirect('/');
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
      var usernumber = pool.buyins.length;
      response.render('ticketProfile.html', {pool: pool, usernumber: usernumber, user: request.user});
    });
  } else {
    promptLogin(request, response, '/ticketprofile/' + request.params.id);
  }
});

app.get('/rewards', function(request, response) {
  if (request.user) {
    response.render('rewards.html', {user: request.user});
  } else {
    promptLogin(request, response, '/rewards');
  }
});

app.get('/home', function(request, response) {
  if (request.user) {
    fb.getFriendIDs(request.user, https, function(friend_ids) {
      db.filterUsers(conn, friend_ids, function(ids) {
        ids.push(request.user.facebook_id);
        db.loadAllPoolsForGroup(conn, ids, function(pools) {
          response.render('newsfeed.html', {pools: pools, user: request.user});
        });
      });
    });
  } else {
    promptLogin(request, response, '/home');
  }
});

app.get('/payment/:id', function(request, response) {
  if (request.user) {
    response.render('credit.html', {
      user: request.user,
      info: request.session.buyin_info
    });
  } else {
    promptLogin(request, response, '/ticketprofile/' + request.params.id);
  }
});

app.get('/howitworks', function(request, response) {
  if (request.user) {
    response.render('howitworks.html', {user: request.user});
  } else {
    promptLogin(request, response, '/howitworks');
  }
});

app.get('/landing', function(request, response) {
  if (request.user) {
    if (request.user.registered == 1) {
      if (request.session.landing) {
        var landing = request.session.landing;
        request.session.landing = false;
        response.redirect(landing);
      } else {
        response.redirect('/home');
      }
    } else {
      request.user.registered = true;
      db.storeUser(request.user, conn, function(user_id) {
        response.redirect('/howitworks');
      });
    }
  } else {
    promptLogin(request, response, '/home');
  }
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
    info.draw_string = request.body.month;
    info.main_pic_url = request.body.imageURL;
    db.createPool(conn, info, request.user, function(pool_id) {
      console.log("created pool...");
      response.redirect('/ticketprofile/' + pool_id);
    });
  } else {
    promptLogin(request, response, '/create');
  }
});

app.post('/ticketprofile/:id/newmessage', function(request, response) {
  if (request.user) {
    var pool_id = request.params.id;
    db.recordMessage(conn, pool_id, request.user, request.body.message, function(msg) {
      response.redirect('/ticketprofile/' + pool_id);
    });
  } else {
    promptLogin(request, response, '/ticketprofile/' + request.params.id);
  }
});

app.post('/buyin/:id', function(request, response) {
  if (request.user) {
    var info = new Object();
    info.user = request.user;
    info.pool_id = request.params.id;
    info.n1 = parseInt(request.body.n1);
    info.n2 = parseInt(request.body.n2);
    info.n3 = parseInt(request.body.n3);
    info.n4 = parseInt(request.body.n4);
    info.n5 = parseInt(request.body.n5);
    info.powerball = parseInt(request.body.powernum);
    info.powerplay = request.body.multiplier;
    info.shares = request.body.shares;
    info.price = (info.powerplay ? 3 : 2) * info.shares;
    request.session.buyin_info = info;
    response.redirect('/payment/' + request.params.id);
  } else {
    promptLogin(request, response, '/ticketprofile/' + request.params.id);
  }
});

// TODO: this is wicked insecure
app.post('/process_payment/:id', function(request, response) {
  if (request.user) {
    var info = request.session.buyin_info;
    db.storeUser(request.user, conn, function(user_id) {
      db.recordBuyin(conn, info, function(pool) {
        var form = new Object();
        form.firstName = request.body.firstName;
        form.lastName = request.body.lastName;
        form.email = request.body.email;
        form.shares = info.shares;
        fb.mailConfirmation(request.user, request.session.buyin_info, form, mail, function() {
          response.redirect('/ticketprofile/' + pool.id);
        });
      });
    });
  } else {
    promptLogin(request, response, '/ticketprofile/' + request.params.id);
  }
});

app.post('/upload/image', function(request, response) {
  fs.readFile(request.files.img.path, function (err, data) {

    var userImageName = request.files.img.name;

    var imageName = 'img_'+new Date().getTime().toString()+Math.floor((Math.random() * 10) + 1).toString() + userImageName;
      var data_params = {Key: imageName, Body: data};
      s3.putObject(data_params, function(err, data) {
        if (err) {
          console.log("Error uploading data: ", err);
        } else {
          console.log("Successfully uploaded data to myBucket/myKey");
          var imgurl = "http://s3.amazonaws.com/Lotteria/" + imageName;
          var jsonToReturn = { };
          jsonToReturn.url = imgurl;
          response.json(jsonToReturn);
        }
      });
	});
});

app.post('/addbucks', function(request, response) {
  if (request.user) {
    request.user.powerbucks += parseInt(request.body.powerbucks);
    db.storeUser(request.user, conn, function(id) {
      // yeah we're done
      response.json({powerbucks: request.user.powerbucks});
    });
    db.store
  } else {
    promptLogin(request, response, '/home');
  }
});
 
app.listen(8080, function() {
  db.newTables(conn);
  db.createSamples(conn);
	console.log("- Server listening on port 8080");
});

function promptLogin(request, response, landing) {
  request.session.landing = landing;
  response.redirect('/');
}

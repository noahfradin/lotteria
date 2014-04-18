// various database and user management utilities

var moment = require('moment');

// stores the user in the database, then calls callback with that user's id
// this should NOT be used for new users
function storeUser(user, conn, callback) {
  console.log("trying to store user with id " + user.facebook_id + "...");
  var sql = 'UPDATE users SET access_token=$1, profile=$2, pools=$3 WHERE facebook_id=$4';
  var vars = [
    user.access_token,
    JSON.stringify(user.profile),
    JSON.stringify(user.pools),
    user.facebook_id];
  var q = conn.query(sql, vars, function(error, result) {
    if (callback) {
      callback(user.facebook_id);
    }
  });
}

// loads the user from the database, then calls callback with the user object
function loadUser(id, conn, callback) {
  console.log("trying to load user for id " + id + "...");
  var sql = 'SELECT * FROM users WHERE facebook_id=$1';
  var vars = [id];
  var q = conn.query(sql, vars, function(error, result) {
    if (result.rowCount == 0) {
      if (callback) {
        callback(null);
      }
    } else if (result.rowCount == 1) {
      var user = result.rows[0];
      user.profile = JSON.parse(user.profile);
      user.pools = JSON.parse(user.pools);
      if (callback) {
        callback(user);
      }
    } else if (result.rowCount > 1) {
      console.log("too many users with id " + id + "!!");
    }
  });
}

// creates the user from a facebook callback, then calls done
// accessToken: what we use to get stuff from FB
// refreshToken: no idea
// profile : JSON object representing user basic profile
// done: thing possible needed from passport
// conn: connection to the database
// returns the created user
function createUser(accessToken, refreshToken, profile, done, conn) {
  console.log("creating user with id " + profile.id + "...");
  var newUser = new Object();
  newUser.profile = profile;
  newUser.facebook_id = profile.id;
  newUser.access_token = accessToken;
  newUser.pools = [];
  var sql = 'INSERT INTO users (facebook_id, access_token, profile, pools) VALUES ($1, $2, $3, $4)';
  var vars = [profile.id, accessToken, JSON.stringify(profile), JSON.stringify(newUser.pools)];
  var q = conn.query(sql, vars);
  q.on('end', function() {
    if (done) {
      done(null, newUser);
    }
  });
}

// called from fb login
function findOrCreate(accessToken, refreshToken, profile, done, conn) {
  loadUser(profile.id, conn, function(user) {
    if (user) {
      console.log("user exists with id " + user.facebook_id);
      user.profile = profile;
      user.accessToken = accessToken;
      user.refreshToken = refreshToken
      storeUser(user, conn);
      done(null, user);
    } else {
      console.log("user with id " + profile.id + " does not exist, make new");
      createUser(accessToken, refreshToken, profile, done, conn);
    }
  });
}

// creates a new pool in the database
// conn: database connection
// info: basic pool info object with date, buyin, desc, etc
// user: the user object that created the pool
// callback: called with id of created pool after insertion
function createPool(conn, info, user, callback) {
  var sql = 'INSERT INTO pools (info, tickets, created, buyins, shares) VALUES ($1, $2, $3, $4, $5)';
  info.more_text = "";
  info.sample_users = new Array();
  info.sample_users.push({facebook_id: user.facebook_id});
  info.founder = user.facebook_id;
  var buyins = new Array();
  buyins.push({id: user.facebook_id, shares: 0});
  var vars = [
    JSON.stringify(info),
    new Array(),
    moment().unix(),
    JSON.stringify(buyins),
    0];
  var q = conn.query(sql, vars, function(error, result) {
    var sql = 'SELECT last_insert_rowid()';
    var q = conn.query(sql, [], function(error, result) {
      if (error) { console.error(error); }
      var buyin = new Object();
      buyin.id = result.rows[0]['last_insert_rowid()'];
      buyin.shares = 0;
      user.pools.push(buyin);
      console.log("user with ID " + user.facebook_id + " created pool with id " + buyin.id);
      storeUser(user, conn, function(facebook_id) {
        if (callback) {
          callback(buyin.id);
        }
      });
    });
  });
}

// stores the given pool in database, then calls callback with the pool id
function storePool(conn, pool, callback) {
  var sql = 'UPDATE pools SET info=$1, tickets=$2, buyins=$3, shares=$4 WHERE id=$5';
  var vars = [
    JSON.stringify(pool.info),
    JSON.stringify(pool.tickets),
    JSON.stringify(pool.buyins),
    pool.shares,
    pool.id];
  var q = conn.query(sql, vars, function(error, result) {
    if (callback) {
      callback(pool.id);
    }
  });
}

// loads the pool with the given id, then calls callback with the json pool
function loadPoolByID(conn, id, callback) {
  var sql = 'SELECT * FROM pools WHERE id=$1';
  var vars = [id];
  var q = conn.query(sql, vars, function(error, result) {
    if (result.rowCount == 0) {
      callback(null);
    } else if (result.rowCount == 1) {
      var pool = result.rows[0];
      pool.info = JSON.parse(pool.info);
      pool.tickets = JSON.parse(pool.tickets);
      pool.buyins = JSON.parse(pool.buyins);
      callback(pool);
    } else if (result.rowCount > 1) {
      console.log("too many pools with id " + id + "!!");
    }
  });
}

// DB call for the mytickets page
function loadAllPoolsForUser(conn, user, callback) {
  var pools = [];
  var loaded = 0;
  var loadFunc = function(pool) {
    console.log("loaded pool:");
    console.log(pool);
    pools.push(pool);
    loaded += 1;
    if (loaded == user.pools.length) {
      callback(pools);
    } else {
      console.log("loading pool with id: " + user.pools[loaded].id);
      loadPoolByID(conn, user.pools[loaded].id, loadFunc);
    }
  }
  if (user.pools.length == 0) {
    callback(pools);
  } else {
    loadPoolByID(conn, user.pools[loaded].id, loadFunc);
  }
}

// DB call for the homepage
function loadRelevantPools(conn, user, callback) {
  // TODO
}

// records the user as having bought into a pool
// most args are stored in the info blob and collected from POST params
// TODO flesh this out by creating a ticket
function recordBuyin(conn, info, callback) {
  loadPoolByID(conn, info.pool_id, function(pool) {
    var buyin = null;
    for (var i = 0; i < pool.buyins.length; i += 1) {
      if (pool.buyins[i].id == info.user.facebook_id) {
        buyin = pool.buyins[i];
      }
    }
    if (buyin != null) {
      buyin.shares += 1;
    } else {
      buyin = {id: info.user.facebook_id, shares: 1};
      pool.buyins.push(buyin);
	  pool.info.sample_users.push({facebook_id: info.user.facebook_id});
    }
    pool.shares += 1;
    storePool(conn, pool, function(pool_id) {
      var buyin = null;
      for (var i = 0; i < info.user.pools.length; i += 1) {
        if (info.user.pools[i].id == pool_id) {
          buyin = info.user.pools[i];
        }
      }
      if (buyin != null) {
        buyin.shares += 1;
      } else {
        buyin = {id: pool_id, shares: 1};
        info.user.pools.push(buyin);
      }
      storeUser(info.user, conn, function(facebook_id) {
        if (callback) {
          callback(pool_id);
        }
      });
    });
  });
}

// resets the tables
function newTables(conn) {

  // remove existing
  conn.query("DROP TABLE users").on('error', console.error);
  conn.query("DROP TABLE tickets").on('error', console.error);
  conn.query("DROP TABLE pools").on('error', console.error);
  
  // create anew!!
  conn.query("CREATE TABLE users (facebook_id TEXT PRIMARY KEY, access_token INTEGER, profile BLOB, pools BLOB)")
  .on('error', console.error);
  conn.query("CREATE TABLE tickets (id INTEGER PRIMARY KEY AUTOINCREMENT)")
  .on('error', console.error);
  conn.query("CREATE TABLE pools (id INTEGER PRIMARY KEY AUTOINCREMENT, info BLOB, tickets BLOB, created INTEGER, buyins BLOB, shares INTEGER)")
  .on('error', console.error);
}

// populates with sample data
function createSamples(conn) {
  var users = new Array();
  var adk = new Object();
  var ameade = new Object();
  var crfitz = new Object();
  var nfradin = new Object();
  users.push(adk);
  users.push(ameade);
  users.push(crfitz);
  users.push(nfradin);
  adk.id = 1831215604;
  ameade.id = 1067881337;
  crfitz.id = 599381317;
  nfradin.id = 685294752;
  
  var i = 0;
  var poolFunc = function() {
    var user = users[i];
    user.facebook_id = user.id;
    createUser("", "", user, null, conn);
    
    var info = new Object();
    info.name = "Sample Pool " + user.facebook_id;
    info.desc = "My first sample pool!";
    info.private = true;
    info.draw_string = 12 + "/" + 12 + "/" + 14;
    info.main_pic_url = "http://www.wombatrpgs.net/block/images/widget.gif";
    loadUser(user.facebook_id, conn, function(user2) {
      createPool(conn, info, user2, function(pool) {
        i += 1;
        if (i < users.length) {
          poolFunc();
        }
      });
    });
  }
  poolFunc();
}

exports.newTables = newTables;
exports.createUser = createUser;
exports.loadUser = loadUser;
exports.storeUser = storeUser;
exports.findOrCreate = findOrCreate;
exports.loadPoolByID = loadPoolByID;
exports.loadAllPoolsForUser = loadAllPoolsForUser;
exports.createPool = createPool;
exports.createSamples = createSamples;
exports.recordBuyin = recordBuyin;
// various database and user management utilities

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
  var sql = 'INSERT INTO pools (info, tickets) VALUES ($1, $2)';
  info.more_text = "";
  info.sample_users = new Array();
  info.sample_users.push({facebook_id: user.facebook_id});
  var vars = [JSON.stringify(info), new Array()];
  var q = conn.query(sql, vars, function(error, result) {
    var sql = 'SELECT last_insert_rowid()';
    var q = conn.query(sql, [], function(error, result) {
      if (error) { console.error(error); }
      var buyin = new Object();
      buyin.id = result.rows[0]['last_insert_rowid()'];
      buyin.shares = 0;
      user.pools.push(buyin);
      storeUser(user, conn, function(facebook_id) {
        if (callback) {
          callback(id);
        }
      });
    });
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
      callback(pool);
    } else if (result.rowCount > 1) {
      console.log("too many pools with id " + id + "!!");
    }
  });
}

// DB call for the mytickets page
function loadAllPoolsForUser(conn, user, callback) {
  console.log("loadallpools");
  console.log(user);
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
  conn.query("CREATE TABLE pools (id INTEGER PRIMARY KEY AUTOINCREMENT, info BLOB, tickets BLOB)")
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
  for (var i = 0; i < users.length; i += 1) {
    var user = users[i];
    user.facebook_id = user.id;
    createUser("", "", user, null, conn);
  }
  
  var poolInfo = new Object();
  poolInfo.name = "Sample Pool";
  poolInfo.draw_string = "12/12/14";
  poolInfo.main_pic_url = "http://www.wombatrpgs.net/block/images/widget.gif";
  loadUser(adk.facebook_id, conn, function(user) {
    console.log(user);
    createPool(conn, poolInfo, user, null);
  });
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
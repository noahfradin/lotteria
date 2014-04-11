// various database and user management utilities

// stores the user in the database, then calls callback with that user's id
// this should NOT be used for new users
function storeUser(user, conn, callback) {
  console.log("trying to store user with id " + user.facebook_id + "...");
  var sql = 'UPDATE users SET access_token=$1, profile=$2 WHERE facebook_id=$3';
  var vars = [user.access_token, JSON.stringify(user.profile), user.facebook_id];
  var q = conn.query(sql, vars, function(error, result) {
    callback(user.facebook_id);
  });
}

// loads the user from the database, then calls callback with the user object
function loadUser(id, conn, callback) {
  console.log("trying to load user for id " + id + "...");
  var sql = 'SELECT * FROM users WHERE facebook_id=$1';
  var vars = [id];
  var q = conn.query(sql, vars, function(error, result) {
    if (result.rowCount == 0) {
      callback(null);
    } else if (result.rowCount == 1) {
      var user = result.rows[0];
      user.profile = JSON.parse(user.profile);
      callback(user);
    } else if (result.rowCount > 1) {
      console.log("too many users with id " + id + "!!");
    }
  });
}

// creates the user from a facebook callback, then calls done
// accessToken: what we use to get stuff from FB
// refreshToken: no idea
// profile : JSON object representing user basic profile
// conn: connection to the database
// returns the created user
function createUser(accessToken, refreshToken, profile, done, conn) {
  console.log("creating user with id " + profile.id + "...");
  var newUser = new Object();
  newUser.profile = profile;
  newUser.facebook_id = profile.id;
  newUser.access_token = accessToken;
  var sql = 'INSERT INTO users (facebook_id, access_token, profile) VALUES ($1, $2, $3)';
  var vars = [profile.id, accessToken, JSON.stringify(profile)];
  var q = conn.query(sql, vars);
  q.on('end', function() {
    done(null, newUser);
  });
}

// called from fb login
function findOrCreate(accessToken, refreshToken, profile, done, conn) {
  loadUser(profile.id, conn, function(user) {
    if (user) {
      console.log("user exists with id " + user.facebook_id);
      done(null, user);
    } else {
      console.log("user with id " + profile.id + " does not exist, make new");
      createUser(accessToken, refreshToken, profile, done, conn);
    }
  });
}

function newTables(conn) {
  conn.query("CREATE TABLE IF NOT EXISTS users (facebook_id TEXT PRIMARY KEY, access_token INTEGER, profile BLOB, tickets BLOB, pools BLOB)")
  .on('error', console.error);
  conn.query("CREATE TABLE IF NOT EXISTS tickets (id INTEGER PRIMARY KEY AUTOINCREMENT, user INTEGER, numbers TEXT, draw_date TEXT, purchase_date TEXT, power_play INTEGER)")
  .on('error', console.error);
  conn.query("CREATE TABLE IF NOT EXISTS pools (id INTEGER PRIMARY KEY AUTOINCREMENT, size INTEGER, users BLOB, tickets BLOB)")
  .on('error', console.error);
}

exports.newTables = newTables;
exports.createUser = createUser;
exports.loadUser = loadUser;
exports.storeUser = storeUser;
exports.findOrCreate = findOrCreate;
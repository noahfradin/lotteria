// various database and user management utilities

// stores the user in the database, then calls callback with that user's id
function storeUser(user, conn, callback) {
  // TODO
  callback(0);
};

// loads the user from the database, then calls callback with the user object
function loadUser(user, conn, callback) {
  // TODO
  callback(new Object());
};

// creates the user from a facebook callback, then calls done
// accessToken: what we use to get stuff from FB
// refreshToken: no idea
// profile : JSON object representing user basic profile
// conn: connection to the database
function createUser(accessToken, refreshToken, profile, done, conn) {
  var newUser = profile;
  newUser.accessToken = accessToken;
  storeUser(newUser, conn, function(user) {
    done(null, user);
  });
};

function newTables(conn) {
  conn.query("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, first_name TEXT, last_name TEXT, photo TEXT, tickets BLOB, pools BLOB, facebook_id TEXT)")
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
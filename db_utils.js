// various database and user management utilities

// stores the user in the database, then calls callback with that user's id
exports.storeUser = function(user, callback) {
  // TODO
  callback(0);
};

// loads the user from the database, then calls callback with the user object
exports.loadUser = function(user, callback) {
  // TODO
  callback(new Object());
};

// creates the user from a facebook callback, then calls done
exports.createUser = function (accessToken, refreshToken, profile, done) {
  // TODO
  var user = profile;
  done(null, user);  // null could be an error object maybe
};

exports.newTables = function() {
  conn.query("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,first_name TEXT, last_name TEXT, photo TEXT, tickets BLOB,pools BLOB, facebook_id TEXT")
  .on('error', console.error);
  conn.query("CREATE TABLE IF NOT EXISTS tickets (id INTEGER PRIMARY KEY AUTOINCREMENT, user INTEGER, numbers TEXT, draw_date TEXT, purchase_date TEXT, power_play INTEGER)")
  .on('error', console.error);
  conn.query("CREATE TABLE IF NOT EXISTS pools (id INTEGER PRIMARY KEY AUTOINCREMENT, size INTEGER, users BLOB, tickets BLOB)")
  .on('error', console.error);
}
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
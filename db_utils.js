// various database and user management utilities

var moment = require('moment');

// stores the user in the database, then calls callback with that user's id
// this should NOT be used for new users
function storeUser(user, conn, callback) {
  var sql = 'UPDATE users SET access_token=$1, profile=$2, pools=$3, powerbucks=$4, registered=$5 WHERE facebook_id=$6';
  var vars = [
    user.access_token,
    JSON.stringify(user.profile),
    JSON.stringify(user.pools),
    user.powerbucks,
    user.registered,
    user.facebook_id];
  var q = conn.query(sql, vars, function(error, result) {
    if (callback) {
      callback(user.facebook_id);
    }
  });
}

// loads the user from the database, then calls callback with the user object
function loadUser(id, conn, callback) {
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
  var newUser = new Object();
  newUser.profile = profile;
  newUser.facebook_id = profile.id;
  newUser.access_token = accessToken;
  newUser.pools = [];
  newUser.powerbucks = 100;
  var sql = 'INSERT INTO users (facebook_id, access_token, profile, pools, powerbucks, registered) VALUES ($1, $2, $3, $4, $5, $6)';
  var vars = [
    profile.id,
    accessToken,
    JSON.stringify(profile),
    JSON.stringify(newUser.pools),
    0,
    newUser.powerbucks];
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
      user.access_token = accessToken;
      user.refresh_token = refreshToken
      storeUser(user, conn, function(result) {
        done(null, user);
      });
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
  var sql = 'INSERT INTO pools (info, created, buyins, shares, messages, numbers) VALUES ($1, $2, $3, $4, $5, $6)';
  info.more_text = "";
  info.sample_users = new Array();
  info.sample_users.push({facebook_id: user.facebook_id});
  info.founder = user.facebook_id;
  info.founder_name = user.profile.displayName;
  var buyins = new Array();
  buyins.push({id: user.facebook_id, tickets: []});
  var vars = [
    JSON.stringify(info),
    moment().unix(),
    JSON.stringify(buyins),
    0,
    JSON.stringify(new Array()),
    JSON.stringify(new Array())];
  var q = conn.query(sql, vars, function(error, result) {
    var sql = 'SELECT last_insert_rowid()';
    var q = conn.query(sql, [], function(error, result) {
      if (error) { console.error(error); }
      var buyin = new Object();
      buyin.id = result.rows[0]['last_insert_rowid()'];
      buyin.tickets = [];
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
  var sql = 'UPDATE pools SET info=$1, buyins=$2, shares=$3, messages=$4, numbers=$5 WHERE id=$6';
  var vars = [
    JSON.stringify(pool.info),
    JSON.stringify(pool.buyins),
    pool.shares,
    JSON.stringify(pool.messages),
    JSON.stringify(pool.numbers),
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
      pool.buyins = JSON.parse(pool.buyins);
      pool.messages = JSON.parse(pool.messages);
      pool.numbers = JSON.parse(pool.numbers);
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

// DB call for the home page
function loadAllPoolsForGroup(conn, ids, callback) {
  var loadFunc = function(loaded, pools) {
    loadUser(ids[loaded], conn, function(user) {
      loadAllPoolsForUser(conn, user, function(userPools) {
        pools = pools.concat(userPools);
        loaded += 1;
        if (loaded < ids.length) {
          loadFunc(loaded, pools);
        } else {
          callback(arrayUnique(pools));
        }
      });
    });
  };
  loadFunc(0, []);
}

// removes duplicates from an array
function arrayUnique(array) {
  var a = array.concat();
  for (var i=0; i<a.length; ++i) {
    for (var j=i+1; j<a.length; ++j) {
      if (a[i] === a[j]) {
        a.splice(j--, 1);
      }
    }
  }
  return a;
};

// records the user's message to a pool
// callback will be called with the final message object
function recordMessage(conn, pool_id, user, message, callback) {
  loadPoolByID(conn, pool_id, function(pool) {
    var msg = new Object();
    msg.message = message;
    msg.name = user.profile.name.givenName;
    msg.facebook_id = user.facebook_id;
    pool.messages.push(msg);
    storePool(conn, pool, function(pool_id) {
      callback(msg);
    });
  });
}

// records the user as having bought into a pool
// most args are stored in the info blob and collected from POST params
function recordBuyin(conn, info, callback) {
  var loadFunc = function(created, info2) {
    internalRecordBuyin(conn, info2, created, function(pool) {
      created += 1;
      if (created == info2.shares) {
        callback(pool);
      } else {
        info2 = incrementTicket(pool, info2);
        loadFunc(created, info2);
      }
    });
  };
  loadFunc(0, info);
}

// mutates the ticket information so that it contains a number unique in pool
function incrementTicket(pool, info) {
  // this method is not very safe, no guarantee a unique # exists
  // also jesus this thing is ugly
  while (poolHas(pool, info)) {
    info.n5 += 1;
    if (info.n5 > 59) {
      info.n5 = 1;
      info.n4 += 1;
      if (info.n4 > 59) {
        info.n4 = 1;
        info.n3 += 1;
        if (info.n3 > 59) {
          info.n3 = 0;
          info.n2 += 1;
          if (info.n2 > 59) {
            info.n2 = 0;
            info.n1 += 1;
            if (info.n1 > 50) {
              console.log("warning: wrapped ticket number");
              info.n1 = 0;
              return incrementTicket(pool, info);
            }
          }
        }
      }
    }
  }
  return info;
}

// return true if pool already has ticket with that number
// because js has no arraycontains for some reason
function poolHas(pool, info) {
  var string = createStringFromInfo(info);
  for (var i = 0; i < pool.numbers.length; i += 1) {
    if (pool.numbers[i].value == string) {
      return true;
    }
  }
  var nums = [info.n1, info.n2, info.n3, info.n4, info.n5];
  for (var i = 0; i < nums.length; i += 1) {
    for (var j = 0; j < nums.length; j += 1) {
      if (i == j) continue;
      if (nums[i] == nums[j]) {
        return true;
      }
    }
  }
  return false;
}

// co-recursive function for record buyin
// seq is the sequence number of this ticket, ie 2 out of 4 shares to create
function internalRecordBuyin(conn, info, seq, callback) {
  createTicket(conn, info.pool_id, info.user.facebook_id,
      [info.n1, info.n2, info.n3, info.n4, info.n5, info.powerball],
      info.powerplay, function(ticket) {
    var ticket_id = ticket.id;
    loadPoolByID(conn, info.pool_id, function(pool) {
      var buyin = null;
      for (var i = 0; i < pool.buyins.length; i += 1) {
        if (pool.buyins[i].id == info.user.facebook_id) {
          buyin = pool.buyins[i];
        }
      }
      if (buyin != null) {
        buyin.tickets.push(ticket_id);
      } else {
        buyin = {id: info.user.facebook_id, tickets: [ticket_id]};
        pool.buyins.push(buyin);
        pool.info.sample_users.push({facebook_id: info.user.facebook_id});
      }
      pool.shares += 1;
      pool.numbers.push({value: ticket.string});
      storePool(conn, pool, function(pool_id) {
        var buyin = null;
        for (var i = 0; i < info.user.pools.length; i += 1) {
          if (info.user.pools[i].id == pool_id) {
            buyin = info.user.pools[i];
          }
        }
        if (buyin != null) {
          buyin.tickets.push(ticket_id);
        } else {
          buyin = {id: pool_id, tickets: [ticket_id]};
          info.user.pools.push(buyin);
        }
        storeUser(info.user, conn, function(facebook_id) {
          if (callback) {
            callback(pool);
          }
        });
      });
    });
  });
}

// filters a list of users to remove users who have not registered on the site
// once done, callback is called with the update users list
function filterUsers(conn, ids, callback) {
  var loadFunc = function(filtered, result) {
    var id = ids[filtered];
    loadUser(id, conn, function(user) {
      if (user) {
        result.push(id);
      }
      filtered += 1;
      if (filtered < ids.length) {
        loadFunc(filtered, result);
      } else {
        callback(result);
      }
    });
  }
  loadFunc(0, []);
}

// creates a new ticket in the database
// the numbers are in the form [n1, n2, n3, n4, n5, powerball]
// callback is called with id of new ticket
function createTicket(conn, pool_id, user_id, numbers, powerplay, callback) {
  var sql = 'INSERT INTO tickets (pool_id, user_id, n1, n2, n3, n4, n5, powerball, powerplay, string) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
  var string = createString(numbers);
  var vars = [
    pool_id,
    user_id,
    numbers[0], numbers[1], numbers[2], numbers[3], numbers[4],
    numbers[5],
    powerplay ? 1 : 0,
    string];
  var q = conn.query(sql, vars, function(error, result) {
    var sql = 'SELECT last_insert_rowid()';
    var q = conn.query(sql, [], function(error, result) {
      if (error) { console.error(error); }
      var id = result.rows[0]['last_insert_rowid()'];
      if (callback) {
        loadTicketByID(conn, id, function(ticket) {
          callback(ticket);
        });
      }
    });
  });
}

// converts info into human-readable ticket no
function createString(numbers) {
  var string = "";
  for (var i = 0; i < 5; i += 1) {
    if (i > 0) string += "-";
    string += numbers[i];
  }
  string += " ";
  string += numbers[5];
  return string;
}

// see above
function createStringFromInfo(info) {
  return createString([info.n1, info.n2, info.n3, info.n4, info.n5, info.powerball]);
}

// loads the ticket with the given id, then calls callback with the json ticket
function loadTicketByID(conn, id, callback) {
  var sql = 'SELECT * FROM tickets WHERE id=$1';
  var vars = [id];
  var q = conn.query(sql, vars, function(error, result) {
    if (result.rowCount == 0) {
      callback(null);
    } else if (result.rowCount == 1) {
      var ticket = result.rows[0];
      ticket.powerplay = (ticket.powerplay == 1);
      callback(ticket);
    } else if (result.rowCount > 1) {
      console.log("too many tickets with id " + id + "!!");
    }
  });
}

// resets the tables
function newTables(conn) {

  // remove existing
  conn.query("DROP TABLE users").on('error', console.error);
  conn.query("DROP TABLE tickets").on('error', console.error);
  conn.query("DROP TABLE pools").on('error', console.error);
  
  // create anew!!
  conn.query("CREATE TABLE users (facebook_id TEXT PRIMARY KEY, access_token TEXT, profile BLOB, pools BLOB, " +
      "powerbucks INTEGER, registered INTEGER)")
  .on('error', console.error);
  conn.query("CREATE TABLE tickets (id INTEGER PRIMARY KEY AUTOINCREMENT, pool_id TEXT, user_id TEXT, n1 TEXT, " +
      "n2 TEXT, n3 TEXT, n4 TEXT, n5 TEXT, powerball TEXT, powerplay INTEGER, string TEXT)")
  .on('error', console.error);
  conn.query("CREATE TABLE pools (id INTEGER PRIMARY KEY AUTOINCREMENT, info BLOB, created INTEGER, " +
      "buyins BLOB, shares INTEGER, messages BLOB, numbers BLOB)")
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
  adk.name = "Aaron King";
  ameade.name = "Alec Meade";
  crfitz.name = "Cody Fitzgerald";
  nfradin.name = "Noah Fradin";
  
  var i = 0;
  var poolFunc = function() {
    var user = users[i];
    user.facebook_id = user.id;
    user.displayName = user.name;
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
exports.recordMessage = recordMessage;
exports.filterUsers = filterUsers;
exports.loadAllPoolsForGroup = loadAllPoolsForGroup;
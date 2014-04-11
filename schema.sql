CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  access_token INTEGER,
  profile BLOB,
  tickets BLOB,
  pools BLOB
);
CREATE TABLE tickets(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user INTEGER,
  numbers TEXT,
  draw_date TEXT,
  purchase_date TEXT,
  power_play INTEGER
);
CREATE TABLE pools(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  size INTEGER,
  users BLOB,
  tickets BLOB
);

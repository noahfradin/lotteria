CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT,
  last_name TEXT,
  photo TEXT,
  tickets BLOB,
  pools BLOB,
  facebook_id TEXT
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

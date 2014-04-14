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

-- Pool info blob:
-- name             name of pool
-- draw_string      when the ticket is drawn, string format
-- main_pic_url     url of pic to display to represent pool
-- sample user      list of sample users:
---- facebook_id    identifier for user
-- more_text        "+ 13 more" etc
CREATE TABLE users (
  facebook_id TEXT PRIMARY KEY,
  access_token TEXT,
  profile BLOB,
  pools BLOB,
);
CREATE TABLE tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
);
CREATE TABLE pools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  info BLOB,
  tickets BLOB,
  created INTEGER,
  buyins BLOB,
  shares INTEGER,
  messages BLOB,
)


-- Pool info blob:
-- name             name of pool
-- draw_string      when the ticket is drawn, string format
-- main_pic_url     url of pic to display to represent pool
-- [sample user]    list of sample user facebook ids
-- more_text        "+ 13 more" etc
-- private          boolean value, this is the "friends only"
-- desc             user-given pool description
-- founder          facebook_id of user that created it

-- Message blob:
-- name             display name of the user with the message
-- message          message from that user
-- facebook_id      facebook id of the user

-- Pool buyin info blob:
-- id               user id of guy who bought
-- [ticket_id]      list of the tickets that user bought

-- User buyin info blob:
-- id               id of the pool the user bought into
-- [ticket_id]      list of the tickets the user bought

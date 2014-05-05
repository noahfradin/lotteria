README: POOL PLAY GTECH
Group Number: 9
Group Name: GTECH
Group Members: Alexander Meade, Cody Fitzgerald, Aaron King and Noah Fradin

Run / Install Instructions:
Currently the server is running on amazon EC2 and we can leave this up for the next week or two. If you would like to run the code locally it is currently running on port 5000 which can be easily changed in the server.js file. Furthermore, it should be noted that the links from facebook invites that are sent out from the site will only work if you are using the ec2 setup because you cannot send those links while running locally. If you choose to run it locally, run npm install first.

File Structure:
Similiar to the setup for chatroom we have all our HTML templates in the directory templates. All css, javascript and images are within their own directories within the public directory. All dependencies we use are stored within  package.json. We currently use any-db, sqlite3, hogan.js and consolidate. For facebook interaction we use passport and passport-facebook. Additionally, we utilize moment, nodemailer and aws-sdk.

The current amazon webserver link to our site is:
http://ec2-54-187-156-41.us-west-2.compute.amazonaws.com/

The database schema shown below can also be found in schema.sql:

CREATE TABLE users (
  facebook_id TEXT PRIMARY KEY,
  access_token TEXT,
  profile BLOB,
  pools BLOB,
  powerbucks INTEGER,
  registered INTEGER
);
CREATE TABLE tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pool_id TEXT,
  user_id TEXT,
  n1 TEXT,
  n2 TEXT,
  n3 TEXT,
  n4 TEXT,
  n5 TEXT,
  powerball TEXT,
  powerplay INTEGER,
  string TEXT
);
CREATE TABLE pools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  info BLOB,
  created INTEGER,
  buyins BLOB,
  shares INTEGER,
  messages BLOB,
  numbers BLOB,
  promoted INTEGER
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

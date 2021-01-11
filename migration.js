const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./database.sqlite");

//CREATE ARTIST TABLE
db.run(
  "CREATE TABLE IF NOT EXISTS Artist (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, date_of_birth TEXT NOT NULL, biography TEXT NOT NULL, is_currently_employed INTEGER DEFAULT 1)"
);

//INSERT DATA TO ARTIST
db.run(
  "INSERT INTO Artist (id, name, date_of_birth, biography) VALUES (1,'Manu', '1984', 'test')"
);

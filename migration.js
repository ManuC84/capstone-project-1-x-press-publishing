const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./database.sqlite");

db.serialize(() => {
  //CREATE ARTIST TABLE
  db.run(`DROP TABLE IF EXISTS Artist`);

  db.run(
    "CREATE TABLE IF NOT EXISTS Artist (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, date_of_birth TEXT NOT NULL, biography TEXT NOT NULL, is_currently_employed INTEGER DEFAULT 1)"
  );

  //CREATE SERIES TABLE
  db.run(`DROP TABLE IF EXISTS Series`);

  db.run(
    "CREATE TABLE IF NOT EXISTS Series (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, description TEXT NOT NULL)"
  );
  // db.run(
  //   "INSERT INTO Series (id, name, description) VALUES (1,'Manu', 'test')"
  // );
});

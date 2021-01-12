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

  //CREATE ISSUE TABLE
  db.run(`DROP TABLE IF EXISTS Issue`);

  db.run(
    "CREATE TABLE IF NOT EXISTS Issue (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL, issue_number INTEGER NOT NULL, publication_date TEXT NOT NULL, artist_id INTEGER NOT NULL, series_id INTEGER NOT NULL, FOREIGN KEY(artist_id) REFERENCES Artist(id), FOREIGN KEY(series_id) REFERENCES Series(id))"
  );

  // db.run(
  //   "INSERT INTO Issue (id, name, issue_number, publication_date, artist_id, series_id) VALUES (1,'Manu', '1', 'test', 1, 1)"
  // );
});

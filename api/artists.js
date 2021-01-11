const e = require("express");
const express = require("express");
const artistsRouter = express.Router();
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

//ROUTER PARAMS && VALIDATE ARTIST
artistsRouter.param("artistId", (req, res, next, id) => {
  db.get(`SELECT * FROM Artist WHERE id = ${id}`, (err, artistId) => {
    if (err) {
      next(err);
    } else if (artistId) {
      req.artistId = artistId;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

const validateArtist = (req, res, next) => {
  req.name = req.body.artist.name;
  req.dateOfBirth = req.body.artist.dateOfBirth;
  req.biography = req.body.artist.biography;
  req.isCurrentlyEmployed = req.body.artist.isCurrentlyEmployed === 0 ? 0 : 1;
  if (!req.name || !req.dateOfBirth || !req.biography) {
    return res.sendStatus(400);
  } else {
    next();
  }
};

//GET REQUEST
artistsRouter.get("/", (req, res, next) => {
  db.all(
    "SELECT * FROM Artist WHERE is_currently_employed = 1",
    (err, artists) => {
      if (err) {
        next(err);
      } else {
        console.log(artists);
        res.status(200).json({ artists: artists });
      }
    }
  );
});

//GET BY ID
artistsRouter.get("/:artistId", (req, res, next) => {
  res.status(200).json({ artist: req.artistId });
});

//POST REQUEST
artistsRouter.post("/", validateArtist, (req, res, next) => {
  // const { name, dateOfBirth, biography } = req.body.artist;
  // const isCurrentlyEmployed = req.body.artist.isCurrentlyEmployed === 0 ? 0 : 1;
  // if (!name || !dateOfBirth || !biography) {
  //   return res.sendStatus(400);
  // }
  const query = `INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed) VALUES ($name, $dateOfBirth, $biography, $isCurrentlyEmployed)`;
  const params = {
    $name: req.name,
    $dateOfBirth: req.dateOfBirth,
    $biography: req.biography,
    $isCurrentlyEmployed: req.isCurrentlyEmployed,
  };
  db.run(query, params, function (err) {
    if (err) {
      next(err);
    } else {
      db.get(
        `SELECT * FROM Artist WHERE id = ${this.lastID}`,
        (err, artist) => {
          if (err) {
            next(err);
          } else {
            res.status(201).json({ artist: artist });
          }
        }
      );
    }
  });
});

//PUT REQUEST
artistsRouter.put("/:artistId", validateArtist, (req, res, next) => {
  const query = `UPDATE Artist SET name = $name, date_of_birth = $dateOfBirth, biography = $biography, is_currently_employed = $isCurrentlyEmployed WHERE id = $artistId`;
  const params = {
    $name: req.name,
    $dateOfBirth: req.dateOfBirth,
    $biography: req.biography,
    $isCurrentlyEmployed: req.isCurrentlyEmployed,
    $artistId: req.params.artistId,
  };
  db.run(query, params, function (err) {
    if (err) {
      next(err);
    } else {
      db.get(
        `SELECT * FROM Artist WHERE id = ${req.params.artistId}`,
        (err, artist) => {
          if (err) {
            next(err);
          } else {
            res.status(200).json({ artist: artist });
          }
        }
      );
    }
  });
});

//DELETE HANDLER
artistsRouter.delete("/:artistId", (req, res, next) => {
  const query = `UPDATE Artist SET is_currently_employed = $isCurrentlyEmployed WHERE id = $artistId`;
  const values = { $isCurrentlyEmployed: 0, $artistId: req.params.artistId };
  db.run(query, values, function (err) {
    if (err) {
      next(err);
    } else {
      db.get(
        `SELECT * FROM Artist WHERE id = ${req.params.artistId}`,
        (err, artist) => {
          res.status(200).json({ artist: artist });
        }
      );
    }
  });
});

module.exports = artistsRouter;

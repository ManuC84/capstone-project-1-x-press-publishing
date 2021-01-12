const express = require("express");
const seriesRouter = express.Router();
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);
const issuesRouter = require("./issues");

//ISSUES ROUTER
seriesRouter.use("/:seriesId/issues", issuesRouter);

//ROUTER PARAMS
seriesRouter.param("seriesId", (req, res, next, seriesId) => {
  db.get(`SELECT * FROM Series WHERE id = ${seriesId}`, (err, series) => {
    if (err) {
      return next(err);
    } else if (series) {
      req.series = series;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

//VALIDATE SERIES
const validateSeries = (req, res, next) => {
  const { name, description } = req.body.series;
  req.name = name;
  req.description = description;
  if (!name || !description) {
    return res.sendStatus(400);
  } else {
    next();
  }
};

//GET HANDLER
seriesRouter.get("/", (req, res) => {
  db.all(`SELECT * FROM Series`, (err, series) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json({ series: series });
    }
  });
});

//GET BY ID HANDLER
seriesRouter.get("/:seriesId", (req, res, next) => {
  res.status(200).json({ series: req.series });
});

//POST HANDLER
seriesRouter.post("/", validateSeries, (req, res, next) => {
  const query = `INSERT INTO Series (name, description) VALUES ($name, $description)`;
  const values = { $name: req.name, $description: req.description };
  db.run(query, values, function (err) {
    if (err) {
      next(err);
    } else {
      db.get(
        `SELECT * FROM Series WHERE id = ${this.lastID}`,
        (err, series) => {
          if (err) {
            next(err);
          } else {
            res.status(201).json({ series: series });
          }
        }
      );
    }
  });
});

//PUT HANDLER
seriesRouter.put("/:seriesId", validateSeries, (req, res, next) => {
  const query = `UPDATE Series SET name = $name, description = $description`;
  const values = { $name: req.name, $description: req.description };
  db.run(query, values, function (err) {
    if (err) {
      next(err);
    } else {
      db.get(
        `SELECT * FROM Series WHERE id = ${req.params.seriesId}`,
        (err, series) => {
          if (err) {
            next(err);
          } else {
            res.status(200).json({ series: series });
          }
        }
      );
    }
  });
});

module.exports = seriesRouter;

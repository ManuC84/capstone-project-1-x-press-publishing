const express = require("express");
const issuesRouter = express.Router({ mergeParams: true });
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(
  process.env.TEST_DATABASE || "./database.sqlite"
);

//ISSUES ROUTE PARAM
issuesRouter.param("issueId", (req, res, next, issueId) => {
  db.get(`SELECT * FROM Issue WHERE id = ${issueId}`, (err, issue) => {
    if (err) {
      return next(err);
    } else if (issue) {
      req.issue = issue;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

//VALIDATE ISSUES
const validateIssues = (req, res, next) => {
  const { name, issueNumber, publicationDate, artistId } = req.body.issue;
  req.name = name;
  req.issueNumber = issueNumber;
  req.publicationDate = publicationDate;
  req.artistId = artistId;

  if (!name || !issueNumber || !publicationDate || !artistId) {
    return res.sendStatus(400);
  }

  db.get(`SELECT * FROM Artist WHERE id = ${artistId}`, (err, artist) => {
    if (err) {
      next(err);
    }
    if (!artist) {
      return res.sendStatus(400);
    }
  });
  next();
};

//GET ISSUES HANDLER
issuesRouter.get("/", (req, res, next) => {
  const query = `SELECT * FROM Issue WHERE series_id = ${req.params.seriesId}`;
  db.all(query, (err, issues) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json({ issues: issues });
    }
  });
});

//POST ISSUES HANDLER
issuesRouter.post("/", validateIssues, (req, res, next) => {
  const query = `INSERT INTO Issue (name, issue_number, publication_date, artist_id, series_id) VALUES ($name, $issueNumber, $publicationDate, $artistId, $seriesId)`;
  const values = {
    $name: req.name,
    $issueNumber: req.issueNumber,
    $publicationDate: req.publicationDate,
    $artistId: req.artistId,
    $seriesId: req.params.seriesId,
  };
  db.run(query, values, function (err) {
    if (err) {
      next(err);
    } else {
      db.get(`SELECT * FROM Issue WHERE id = ${this.lastID}`, (err, issue) => {
        if (err) {
          next(err);
        } else {
          res.status(201).json({ issue: issue });
        }
      });
    }
  });
});

//PUT ISSUES HANDLER
issuesRouter.put("/:issueId", validateIssues, (req, res, next) => {
  const query = `UPDATE Issue SET name = $name, issue_number = $issueNumber, publication_date = $publicationDate, artist_id = $artistId WHERE id = $issueId`;
  const values = {
    $name: req.name,
    $issueNumber: req.issueNumber,
    $publicationDate: req.publicationDate,
    $artistId: req.artistId,
    $issueId: req.params.issueId,
  };
  db.run(query, values, function (err) {
    if (err) {
      next(err);
    } else {
      db.get(
        `SELECT * FROM Issue WHERE id = ${req.params.issueId}`,
        (err, issue) => {
          if (err) {
            next(err);
          } else {
            res.status(200).json({ issue: issue });
          }
        }
      );
    }
  });
});

//DELETE ISSUES HANDLER
issuesRouter.delete("/:issueId", (req, res, next) => {
  const query = `DELETE FROM Issue WHERE id = $issueId`;
  const values = { $issueId: req.params.issueId };
  db.run(query, values, function (err) {
    if (err) {
      next(err);
    } else {
      res.sendStatus(204);
    }
  });
});

module.exports = issuesRouter;

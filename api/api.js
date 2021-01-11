const express = require("express");
const app = express();
const apiRouter = express.Router();
const artistsRouter = require("./artists");
const seriesRouter = require("./series");

//ARTISTS ROUTER
apiRouter.use("/artists", artistsRouter);
apiRouter.use("/series", seriesRouter);

module.exports = apiRouter;

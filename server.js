const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const errorHandler = require("errorhandler");
const apiRouter = require("./api/api");

const PORT = process.env.PORT || 4000;

//MIDDLEWARE
app.use(bodyParser.json());
app.use(errorHandler());
app.use(cors());
app.use(morgan("dev"));

//ROUTING
app.use("/api", apiRouter);

app.listen(PORT, () => console.log("server is listening on PORT " + PORT));

module.exports = app;

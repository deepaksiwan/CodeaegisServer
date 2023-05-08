const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { connect } = require("./connection/dbConnection");
dotenv.config();
const User = require("./auth/routes/authRoutes")
const Car = require ("./car/routes/carRoute")
//!This is a middlewares
app.use(helmet());
app.use(morgan("dev"));
// Increase the maximum size limit to 10MB
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(cors());
app.use(express.json());
app.use("/api/auth", User);
app.use("/api/car",Car)
connect();
var PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`A Node Js API is listening on port:${PORT}`);
});
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes.js");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3001;

const dbUri = `mongodb+srv://admin:${process.env.DB_PASSWORD}@cluster0.2hrll.mongodb.net/authDatabase?retryWrites=true&w=majority`;

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(routes);

app.listen(PORT, () => console.log("Running on port " + PORT));

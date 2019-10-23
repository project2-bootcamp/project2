var express = require("express");
var session = require("express-session");

var passport = require("./config/passport");

var PORT = process.env.PORT || 8080;
var db = require("./models");

var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }))
app.use(passport.initialize());
app.use(passport.session());

require("./routes/htmlRoutes.js")(app);
require("./routes/apiRoutes.js")(app);

db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    console.log("==> :earth_americas:  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  })
});

require("dotenv").config();

//Import the node-spotify-api NPM package
var Spotify = require("node-spotify-api");

//Import the API keys
var keys = require("./keys.js");

//Import the Axios npm package
var axios = require("axios");

//Initialize the spotify API 
var spotify = new Spotify(keys.spotify);


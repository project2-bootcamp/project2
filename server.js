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

// Take in the command line arguments (i.e. action will be spotify-this-song and parameter will be the song name)
var action = process.argv[2];
var parameter = process.argv[3];

function liriCases() {

  switch (action) {

    case 'spotify-this-song':
      spotSong(parameter);
      break;
  }
};

// ---------------Functions

// #1 Spotify 
function spotSong(parameter) {

  searchTrack = parameter;

  spotify.search({
    type: 'track',
    query: searchTrack,
    limit: 1,
  }, function (error, data) {
    if (error) {
      console.log('Error occurred: ' + error);
      return;
    } else {
      console.log("\n---------------------------------------------------\n");
      console.log(JSON.stringify("Artist: " + data.tracks.items[0].album.artists[0].name, null, 2));
      console.log(JSON.stringify("Song Name: " + data.tracks.items[0].name, null, 2));
      console.log(JSON.stringify("Preview Link: " + data.tracks.items[0].preview_url, null, 2))
      console.log(JSON.stringify("Album: " + data.tracks.items[0].album.name, null, 2))
      console.log("\n---------------------------------------------------\n");

    }
  });
};

liriCases();

var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {
    app.post("/api/login", passport.authenticate("local"), function (req, res) {
        res.json(req.user);
    });


app.post("/api/signup", function(req, res) {
    db.User.create ({
        email: req.body.email,
        password: req.body.password
    })
        .then(function() {
            res.redirect(307, "/api/login");
        })
        .catch(function(err) {
            res.status(401).json(err);
        });
});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/login");
});

app.get("/api/user_data", function(req, res) {
    if (!req.user) {
        res.json({});
    } else {
        res.json({
            email: req.user.email,
            id: req.user.id
        })
    }
})

app.get("/api/search/:app", function(req, res) {
    var Spotify = require('node-spotify-api');
    var searchRequest =  [req.params.app]
 
var spotify = new Spotify({
  id: "5a842289d2ce46ea8f2cd2a6f4647304",
  secret: "9eaede9f19504fd59402808674913f46"
})

spotify
  .search({ type: 'track', query: searchRequest })
  .then(function(response) {

    // Artist name
    console.log(JSON.stringify(response.tracks.items[0].album.artists[0].name, null, 2));

    // Album name
    console.log(JSON.stringify(response.tracks.items[0].album.name, null, 2));

    // Album image
    console.log(JSON.stringify(response.tracks.items[0].album.images[0]));

    // Name of Song
    console.log(JSON.stringify(response.tracks.items[0].name, null, 2));
    
    // Preview of Song
    console.log(JSON.stringify(response.tracks.items[0].preview_url, null, 2));
  })
  .catch(function(err) {
    console.log(err);
  })
})};
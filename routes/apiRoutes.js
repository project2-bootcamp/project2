var db = require("../models");
var passport = require("../config/passport");
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
    id: "5a842289d2ce46ea8f2cd2a6f4647304",
    secret: "9eaede9f19504fd59402808674913f46"
})


module.exports = function (app) {
    app.post("/api/login", passport.authenticate("local"), function (req, res) {
        res.json(req.user);
    });


    app.post("/api/signup", function (req, res) {
        db.User.create({
            email: req.body.email,
            password: req.body.password
        })
            .then(function () {
                res.redirect(307, "/api/login");
            })
            .catch(function (err) {
                res.status(401).json(err);
            });
    });

    app.get("/logout", function (req, res) {
        req.logout();
        res.redirect("/login");
    });

    app.get("/api/user_data", function (req, res) {
        if (!req.user) {
            res.json({});
        } else {
            res.json({
                email: req.user.email,
                id: req.user.id
            })
        }
    })

    var artistSongData = {
        name: "",
        image: "",
        followers: "",
        songName: "",
        songPreview: ""
    }

    app.get("/api/search/:app", function (req, res) {
        var searchRequest = req.params.app



        spotify
            .search({ type: 'artist', query: searchRequest })
            .then(function (response) {


                artistSongData.name = JSON.stringify(response.artists.items[0].name)

                artistSongData.image = response.artists.items[0].images[0].url,

                    artistSongData.followers = JSON.stringify(response.artists.items[0].followers.total)


            }).then(
                spotify
                    .search({ type: 'track', query: searchRequest })
                    .then(function (response) {


                        artistSongData.songName = JSON.stringify(response.tracks.items[0].name),

                            artistSongData.songPreview = JSON.stringify(response.tracks.items[0].preview_url)



                        console.log("This is the artistSongData")
                        console.log(artistSongData)

                        res.json(artistSongData)
                    })
            )

    })
};
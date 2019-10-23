var db = require("../models");
var passport = require("../config/passport");
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
    id: "5a842289d2ce46ea8f2cd2a6f4647304",
    secret: "9eaede9f19504fd59402808674913f46"
})


const axios = require('axios');
const path = require('path')

// const express = require('express');

// const router = express.Router();

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




//ticketmaster and google maps api
app.get('/api/google/:lat/:lng', function (req, res) {
    console.log(`we're in the backend`);
    let { lat, lng } = req.params;
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDxTdbiQM9NRtUgYe3cYN86iuXIleDgb04`)
        .then(function (data) {
            console.log(`axios to google success`);
            console.log(data);
            //console.log(data.data.results);
            //console.log(data.data.results)
            var formattedCurrentLoc = data.data.results[0].formatted_address;
            //console.log(formattedCurrentLoc.split(",")[1]);
            console.log(`---------------------------------------------`)
            //console.log(formattedCurrentLoc.split(",")[0]);
            var city = formattedCurrentLoc.split(",")[1];
            console.log(city);
            axios.get(`http://app.ticketmaster.com/discovery/v2/events.json?latlong=${lat},${lng}&radius=50&classificationName=music&apikey=ViAx3nGninoxzArIJ9YGMoKZV01DtmFV`)
                .then(function (json) {
                    var events = json.data._embedded.events;

                    // Parse the response.
                    res.json(events)
                })
        }
        ).catch(err => {
            console.log(err);
        })
    // res.json("we worked")
})




// module.exports = router;


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

    });

}

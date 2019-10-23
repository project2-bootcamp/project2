var db = require("../models");
var passport = require("../config/passport");

const axios = require('axios');
const path = require('path')

// const express = require('express');

// const router = express.Router();

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
            // axios.get(`https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&city=${city}&apikey=ViAx3nGninoxzArIJ9YGMoKZV01DtmFV`)
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


}
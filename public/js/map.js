var map;


function initMap() {
    infoWindow = new google.maps.InfoWindow;
    //finds current location
    currentPosition2 = "";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            currentPosition2 = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            //console.log(currentPosition2.lat);

            testPos(currentPosition2);
            //nearBy(currentPosition2);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }



    function testPos(arg) {
        //console.log(arg);
        var lat = currentPosition2.lat;
        var lng = currentPosition2.lng;
        console.log(lat);
        console.log(lng);

        $.get(`/api/google/${lat}/${lng}`).then((response) => {
            console.log(response)
            map = new google.maps.Map(
                document.getElementById('map'),
                { center: new google.maps.LatLng(currentPosition2.lat, currentPosition2.lng), zoom: 10 });
            console.log(currentPosition2.lat);

            for (var i = 0; i < response.length; i++) {
                addMarker(map, response[i]);
                console.log("RESPONSE: " + response[0]);

            };

            function addMarker(map, event) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(event._embedded.venues[0].location.latitude, event._embedded.venues[0].location.longitude),
                    map: map
                });
                marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
                //console.log(marker);
            };
        });
    }

    // function positionMapOnClick(){
    //     $(".card").onClick(alert("clicked!"));
    // }


}

$(document).on("click", ".card", function () {
    var stringFound = $(this)[0].innerHTML.split(">")[17];
    var completeCoords = stringFound.split("<")[0].split(",");
    console.log(completeCoords);

    map = new google.maps.Map(
        document.getElementById('map'),
        { center: new google.maps.LatLng(completeCoords[0], completeCoords[1]), zoom: 16 });
    //console.log(currentPosition2.lat);
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(completeCoords[0], completeCoords[1]),
        map: map
    });
    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');


});


// function concerts(searchRequest) {

//     // ticketmaster and google maps api
//     app.get('/api/google/:lat/:lng', function (req, res) {
//         console.log(`we're in the backend`);
//         let { lat, lng } = req.params;
//         axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDxTdbiQM9NRtUgYe3cYN86iuXIleDgb04`)
//             .then(function (data) {
//                 console.log(`axios to google success`);
//                 //console.log(data.data.results[0]);                
//                 //console.log(data.data.results);
//                 //console.log(data.data.results)
//                 var formattedCurrentLoc = data.data.results[0].formatted_address;
//                 //console.log(formattedCurrentLoc);
//                 console.log(`---------------------------------------------`)
//                 //console.log(formattedCurrentLoc.split(",")[0]);
//                 var city = formattedCurrentLoc.split(",")[1];
//                 console.log(city);
//                 // axios.get(`http://app.ticketmaster.com/discovery/v2/events.json?latlong=${lat},${lng}&radius=50&classificationName=music&apikey=ViAx3nGninoxzArIJ9YGMoKZV01DtmFV`)
//                 axios.get(`http://app.ticketmaster.com/discovery/v2/events.json?&classificationName=music&countryCode=US&sort'date,asc'&keyword=${searchRequest}&apikey=ViAx3nGninoxzArIJ9YGMoKZV01DtmFV`)
//                     .then(function (json) {
//                         var events = json.data._embedded.events;
//                         console.log(json);

//                         // Parse the response.
//                         res.json(events)
//                     })
//             }
//             ).catch(err => {
//                 console.log(err);
//             })
//         // res.json("we worked")
//     })
// };


// $("#spotify-submit").on("click", function(){
//     concerts($("#userSearch").val().trim());
// });



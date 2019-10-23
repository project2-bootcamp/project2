var currentCity = "";


function currentLocation() {
    //sets initial map
    infoWindow = new google.maps.InfoWindow;
    //finds current location
    currentPosition2 = "";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            currentPosition2 = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            testPos(currentPosition2);
            //nearBy(currentPosition2);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
};

var currentPosition;
//console.log(currentPosition2);

//currentLocation();

function testPos(arg) {
    //console.log(arg);
    var lat = currentPosition2.lat;
    var lng = currentPosition2.lng;
    console.log(lat);
    console.log(lng);

    $.get(`/api/google/${lat}/${lng}`).then((response) => {

        for (var i = 0; i < response.length; i++) {
            var element = response[i];

            var newCard = $("<div class='card' style='width: 30rem;'>");
            var cardBody = $("<div class='card-body'>");
            var cardTitle = $("<h5 class='card-title'>");
            var cardSubtitle = $("<h6 class='card-subtitle mb-2 text-muted'>");
            var cardAddress = $("<h8 class='card-subtitle'>");
            var cardText = $("<p class='card-text'>");
            var cardLink = $("<a href=# class='card-link'>Get Tickets!");
            var cardPrice = $("<h7 class='price'>");
            var latlng = $("<h8 type='hidden' class='coords'>");

            //latlng.setAttribute("type", "hidden");

            newCard.append(cardBody, cardTitle, cardSubtitle, cardAddress, cardText, cardLink, cardPrice, latlng);
            cardTitle.text(element.name);
            //console.log(suffix);
            if (element.info) {
                cardText.text(element.info);
            };
            cardPrice.text("$" + element.priceRanges[0].min + " - " + "$" + element.priceRanges[0].max);
            cardLink.append(`<a href=${element.url} class='card-link'>Get Tickets!`);
            cardAddress.text(element._embedded.venues[0].address.line1 + ", " + element._embedded.venues[0].city.name + " " + element._embedded.venues[0].state.stateCode);
            latlng.append(element._embedded.venues[0].location.latitude + "," + element._embedded.venues[0].location.longitude);
            latlng.hide();
            $('.card-container').append(newCard);

            //time conversion
            var convertedTime = element.dates.start.localTime;
            var splitTime = convertedTime.split(":");
            var hours = splitTime[0];
            var minutes = splitTime[1];
            var suffix = (hours >= 12) ? 'pm' : 'am';
            hours = (hours > 12) ? hours - 12 : hours;
            hours = (hours == '00') ? 12 : hours;
            cardSubtitle.text(element.dates.start.localDate + ' @ ' + hours + ":" + minutes + suffix);


        }
    })



};



// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var map, infoWindow;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 6
    });
    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);

            var request = {
                query: 'Bar',
                fields: ['name', 'geometry'],
            };

            service = new google.maps.places.PlacesService(map);
            console.log(service);

            service.findPlaceFromQuery(request, function (results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        createMarker(results[i]);
                        console.log(results[i]);
                    }
                    map.setCenter(results[0].geometry.location);
                }
            });
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function initialize() {
    var pyrmont = new google.maps.LatLng(-33.8665433, 151.1956316);

    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 15
    });

    var request = {
        location: pyrmont,
        radius: '500',
        type: ['restaurant']
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            createMarker(results[i]);
        }
    }
}
initialize();

function createMarker(place) {
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}


$("#citySearchBtn").click(function initMap() {

    let userInput = document.getElementById("citySearch").value;
    //let userInput = document.getElementById("citySearch");

    let geocoder = new google.maps.Geocoder();

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 0,
            lng: 0
        },
        zoom: 8
    });

   

    geocoder.geocode({ 'address': userInput }, function (results, status) {
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
            infoWindow.setPosition(map.center);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            let pos = {
                lat: map.center.lat,
                lng: map.center.lng
            }

             //provideCityInfo(map.center)
             displayPlaces(pos)

        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
});





function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function wikiSearch(item) {
    // ADD A METHOD TO UPPERCASE FIRST LETTER OF EVERY WORD IN A QUERY?
    url = "http://en.wikipedia.org/w/api.php?action=query&prop=description&titles=" + item.toString() + "&prop=extracts&exintro&explaintext&format=json&redirects&callback=?";
    $.getJSON(url, function (json) {
        var item_id = Object.keys(json.query.pages)[0];
        sent = json.query.pages[item_id].extract;
        result = "<t><strong>" + item + "</strong></t>: " + sent;
        $('#wiki').html("<div>" + result + "</div>"); // Replace 
    });
}


//function displayPlaces(placeData) {
//    $(".info-container").empty();

//    $.each(placeData, function (key, value) {
//        $(".info-container")
//            //.append(`<div class="row object-row"><div class="col-3"><a href="${value.Image}"><img src="${value.Image}"></a></div>` + "<div class='col-3'>" + value.Title + "</div><div class='col-3'>" + value.Genre + "</div><div class='col-3'>" + value.DirectorName + "</div>")
//            .append(
//                `<div class="row">
//                      <div class="info-box">
//                        <img src="http://placehold.it/100x100">
//                            <p>Lorem ipsum dolor sit amet.</p>
//                      </div>
//                    </div>`
//            )
//    });

    //$.ajax({
    //    type: "GET",
    //    url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + pos.lat + "," + pos.lng + "&radius=300&type=" + "restaurant" + "&key=AIzaSyB9VqyRQ0U9jrBEYpymyq1xB5zzGsnbLnc",
    //    contentType: "application/json",
    //    dataType: 'json'
    // })
    //.done(function (data) {
    //            console.log(data);
    //        $.each(data, function (key, value) {
    //            $(".info-container")
    //                //.append(`<div class="row object-row"><div class="col-3"><a href="${value.Image}"><img src="${value.Image}"></a></div>` + "<div class='col-3'>" + value.Title + "</div><div class='col-3'>" + value.Genre + "</div><div class='col-3'>" + value.DirectorName + "</div>")
    //                .append (
    //               `<div class="row">
    //                  <div class="info-box">
    //                    <img src="http://placehold.it/100x100">
    //                        <p>Lorem ipsum dolor sit amet.</p>
    //                  </div>
    //                </div>`
    //               )
    //        })
    //}).fail(function () {
    //    alert("Sorry. Server unavailable. ");
    //});       
//}
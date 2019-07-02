$(document).ready(function () {
    let map, service, infoWindow;
    let counter = 0;
    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 6
        });
        infoWindow = new google.maps.InfoWindow;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                let pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                infoWindow.setPosition(pos);
                infoWindow.setContent('Location found.');
                infoWindow.open(map);
                map.setCenter(pos);

                let newPlacesMap = new google.maps.LatLng(pos.lat, pos.lng);

                initialize(newPlacesMap);

            }, function () {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }
    }
    initMap();

    $("#citySearchBtn").click(function initMap() {
        counter = 0;
        let userInput = document.getElementById("citySearch").value;
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

                let loc = [];
                loc[0] = results[0].geometry.location.lat();
                loc[1] = results[0].geometry.location.lng();

                let newPlacesMap = new google.maps.LatLng(loc[0], loc[1]);

                initialize(newPlacesMap);

            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    });

    function initialize(newMap) {

        map = new google.maps.Map(document.getElementById('map'), {
            center: newMap,
            zoom: 14
        });

        var request = {
            location: newMap,
            radius: '500',
            type: ['restaurant']
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
    }

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            $(".info-container").empty();
            for (var i = 0; i < 4; i++) {
                var place = results[i];
                displayPlaces(results[i]);
                createMarker(results[i]);
            }
        }
    }

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

    function displayPlaces(placeData) {
        $(".info-container")
            .append(
                `<div class="row box" style="padding:10px 0 10px 0">
                     <div class="col-xs-6">
                        <img src="`+ placeData.photos[0].getUrl({ maxWidth: 200, maxHeight: 200 }) + `">    
                    </div>
                <div class="col-xs-6">
                <p>` + placeData.name + `</p>
                <p>` + placeData.vicinity + `</p>
                <p>Rating: ` + placeData.rating + ` | Price: ` + placeData.price_level + `</p>
                <label for="submitToggle` + counter + `" class="btn btn-change btn-2 btn-review">Leave a review</label>
                    <div>
                    <input hidden id="submitToggle` + counter + `" type="checkbox">
                        <div class="infobox submit-card">
                            <div class="submit-card-content">
                                <div>
                                    <div><p>`+ placeData.name + " - " + placeData.vicinity + `</p></div>
                                    <input hidden type="text" id="pointOfInterestValue" value="` + placeData.name + `">
                                    <input hidden type="text" id="poiAddressValue" value="` + placeData.vicinity + `">
                                    <input type="text" id="surveyTitleInput" placeholder="Title of your review" />
                                </div>
                                <div>
                                    <form action="/action_page.php">
                                      Give Rating (between 1 and 10):
                                      <input type="number" id="surveyRatingInput" name="quantity" min="1" max="10">
                                      
                                    </form>
                                </div>
                                <div>
                                      <textarea rows="5" cols="80" id="surveyReviewInput" placeholder="Leave your review"></textarea>  
                                </div>
                                <div class="submitDiv">
                                <input type="submit" class="btn btn-change btn-3" value="Submit" id="submitReviewBtn` + counter + `" >
                                </div>
                            </div>
                            <div class="md-card-btns">
                                <label for="submitToggle` + counter + `" class="btn btn-4">Close Box</label>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>`
            )
        counter++;
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }

    //let submitReviewBtnId = "";

    //$(".info-container").on("click", "#submitReviewBtn0", function () {
    //    submitReviewBtnId = "0";
    //    });
    //$(".info-container").on("click", "#submitReviewBtn1", function () {
    //    submitReviewBtnId = "1";
    //    });
    //$(".info-container").on("click", "#submitReviewBtn2", function () {
    //    submitReviewBtnId = "2";
    //    });
    //$(".info-container").on("click", "#submitReviewBtn3", function () {
    //    submitReviewBtnId = "3";
    //    });


    $(".info-container").on("click", "#submitReviewBtn0", function postSurvey() {

        let newTitleInput = $("#surveyTitleInput").val();
        let newRatingInput = $("#surveyRatingInput").val();
        let newReviewInput = $("#surveyReviewInput").val();
        let pointOfInterest = $("#pointOfInterestValue").val();
        let poiAddress = $("#poiAddressValue").val();
        let poiCity;
        let poiCountry;

        $.ajax({
            method: "POST",
            url: "/Travelers/PostReview",
            datatype: "JSON",
            headers: {
                "Content-Type": "application/json"
            },
            contentType: "application/json",
            data: JSON.stringify({
                "ReviewTitle": newTitleInput,
                "Rating": newRatingInput,
                "Review": newReviewInput,
                "PointOfInterest": pointOfInterest,
                "Address": poiAddress,
                "City": poiCity,
                "Country": poiCountry
            }),
            success: function (data) {
                console.log(data);
            }
        })
        $(".submitDiv").append("<div class='message success'>Thank you for submitting your review!!</div>")
        setTimeout(function () {
            $('.message').remove();
        }, 3000);
    });

    function getSurveys() {
        $.ajax({
            url: '/Travelers/CheckSurveyData',
            data: "",
            dataType: "json",
            type: "GET",
            contentType: "application/json; chartset=utf-8",
        })
            .done(function (data) {

            });
    }
});









//function wikiSearch(item) {
//    // ADD A METHOD TO UPPERCASE FIRST LETTER OF EVERY WORD IN A QUERY?
//    url = "http://en.wikipedia.org/w/api.php?action=query&prop=description&titles=" + item.toString() + "&prop=extracts&exintro&explaintext&format=json&redirects&callback=?";
//    $.getJSON(url, function (json) {
//        var item_id = Object.keys(json.query.pages)[0];
//        sent = json.query.pages[item_id].extract;
//        result = "<t><strong>" + item + "</strong></t>: " + sent;
//        $('#wiki').html("<div>" + result + "</div>"); // Replace 
//    });
//}



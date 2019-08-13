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

    $(document).keypress(function (event) {
        if (event.key === "Enter") {
            initMap();
            function initMap() {
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
            }
        }
    });

    function initialize(newMap) {
        map = new google.maps.Map(document.getElementById('map'), {
            center: newMap,
            zoom: 14
        });

        var request = {
            location: newMap,
            radius: '1000',
            type: ['point_of_interest']
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
    }

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            let vicinityArray = results[0].vicinity.split(" ");
            let item = vicinityArray[vicinityArray.length - 1]; 
            wikiSearch(item)
            $(".info-container").empty();
            for (var i = 0; i < 4; i++) {
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
                        <img src="`+ placeData.photos[0].getUrl({ maxWidth: 200, maxHeight: 150 }) + `">
                    </div>
                <div class="col-xs-6">
                <p>` + placeData.name + `</p>
                <p>` + placeData.vicinity + `</p>
                <p>Rating: ` + placeData.rating + ` | Price: ` + placeData.price_level + `</p>
                <label for="submitToggle` + counter + `" class="btn btn-change btn-4 btn-review">Leave a review</label>
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
                                <br/>
                                <div>
                                    <form action="/action_page.php">
                                      <p style="color:rgba(255, 255, 255, 0.5)">Give Rating (between 1 and 10):</p>                                          
                                      <input style="color:black" type="number" id="surveyRatingInput" name="quantity" min="1" max="10">                                       
                                    </form>
                                </div>
                                <br/>
                                <div>
                                      <textarea rows="5" cols="80" id="surveyReviewInput" placeholder="Leave your review"></textarea>  
                                </div>
                                <div class="submitDiv">
                                <input type="submit" class="btn btn-change btn-4" value="Submit" id="submitReviewBtn` + counter + `" >
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
            }
        })
        $(".submitDiv").append("<div class='message success'>Thank you for submitting your review!!</div>")
        setTimeout(function () {
            $('.message').remove();
        }, 3000);
    });

    /* ---future function to display survey information
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
    */

    function wikiSearch(item) {
        url = "https://en.wikipedia.org/w/api.php?action=query&prop=description&titles=" + item.toString() + "&prop=extracts&exintro&explaintext&format=json&redirects&callback=?";
        $.getJSON(url, function (json) {
            var item_id = Object.keys(json.query.pages)[0];
            sent = json.query.pages[item_id].extract;
            longResult = "<t><strong>" + item + "</strong></t> " + sent;

            resultArray = longResult.split(" ")

            //searching for any ending parenthesis in the first 20 words of the extract, returns word index of last occuring one
            var arrCounter = 0; 
            for (let i = 0; i < 20; i++) {
                if (resultArray[i].indexOf(")") != -1) {
                    arrCounter = i;
                }
            }

            //splicing up to word 70 of the extract
            resultString = resultArray.splice(arrCounter + 1, 70).join(" ")

            $('.cityInfo-container')
                .empty()
                .append(`
                        <h1 style="color: rgba(255, 255, 255, 0.5)">` + item + `</h1>
                        <p style="color: rgba(255, 255, 255, 0.5)">` + resultString + `...  <a href="https://en.wikipedia.org/wiki/` + item + `">Read more on Wikipedia</a></p>
                        `)
        });
        attomDataSearch(item);
    }    

    function attomDataSearch(item) {   
        let fipsArray = [
            {
                countyName: "Milwaukee",
                fips: 55079
            },
            {
                countyName: "Chicago",
                fips: 17031
            },
            {
                countyName: "Angeles",
                fips: 06037
            },
            {
                countyName: "Cincinnati",
                fips: 39061
            }
        ]        

        var itemFips;

        for (let i = 0; i < fipsArray.length; i++) {
            if (item == fipsArray[i].countyName) {
                itemFips = fipsArray[i].fips;
                break;
            }            
        }       

        $.ajax({
            method: "Get",
            url: "https://api.gateway.attomdata.com/communityapi/v2.0.0/area/full?AreaId=CO" + itemFips,
            datatype: "JSON",
            headers: {
                "accept": "application/json",
                //"apikey": "you api key goes here"
            },
            success: function (data) {
                let extractedData = {
                    "20-24": data.response.result.package.item[0].age20_24,
                    "25-29": data.response.result.package.item[0].age25_29,
                    "30-34": data.response.result.package.item[0].age30_34,
                    "35-39": data.response.result.package.item[0].age35_39,
                    "40-44": data.response.result.package.item[0].age40_44,
                    "45-49": data.response.result.package.item[0].age45_49,
                    "50-54": data.response.result.package.item[0].age50_54,
                    //"55-59": data.response.result.package.item[0].age55_59,
                    //"60-64": data.response.result.package.item[0].age60_64,
                    //"65-69": data.response.result.package.item[0].age65_69
                }
                displayPopulationGraph(extractedData);
            }
        });
    }

    function displayPopulationGraph(attomData) {
        let chartData = [];
        let chartAges = [];

        for (var key in attomData) {
            if (attomData.hasOwnProperty(key)) {
                chartData.push(parseInt(attomData[key]))
                chartAges.push(key)
            }
        }

        //----------------------------------------Bar Chart-----------------------------

        function BarChart() {
            d3.select("svg").remove()
            let margin = {
                top: 30,
                right: 10,
                bottom: 30,
                left: 50
            }

            let height = 350 - margin.top - margin.bottom;
            let width = 420 - margin.left - margin.right;

            let dynamicColor;

            let yScale = d3.scaleLinear()
                .domain([0, d3.max(chartData)])
                .range([0, height])

            let xScale = d3.scaleBand()
                .domain(d3.range(0, 7))
                .range([0, width])

            let colors = d3.scaleLinear()
                .domain([0, chartData.length * .33, chartData.length * .66, chartData.length])
                .range(['#d6e9c6', '#bce8f1', '#faebcc', '#ebccd1'])

            let awesome = d3.select('#bar-chart').append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)

                .append('g')
                .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
                .selectAll('rect').data(chartData)
                .enter().append('rect')
                .styles({
                    'fill': function (data, i) {
                        return colors(i);
                    },
                    'stroke': '#31708f',
                    'stroke-width': '1'
                })

                .attr('width', xScale.bandwidth())
                .attr('x', function (data, i) {
                    return xScale(i);
                })

                .attr('height', 0)
                .attr('y', height)

                .on('mouseover', function (data) {
                    dynamicColor = this.style.fill;
                    d3.select(this)
                        .style('fill', '#3c763d')

                })

                .on('mouseout', function (data) {
                    d3.select(this)
                        .style('fill', dynamicColor)
                    $('svg.title').remove();
                })


            awesome.transition()
                .attr('height', function (data) {
                    return yScale(data);
                })
                .attr('y', function (data) {
                    return height - yScale(data);
                })
                .delay(function (data, i) {
                    return i * 20;
                })

                .duration(2000)
                .ease(d3.easeElastic)
            let verticalGuideScale = d3.scaleLinear()
                .domain([0, d3.max(chartData)])
                .range([height, 0])

            let vAxis = d3.axisLeft(verticalGuideScale)
                .ticks()
                

            let verticalGuide = d3.select('svg').append('g')
            vAxis(verticalGuide)
            verticalGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
            verticalGuide.selectAll('path')
                .styles({
                    fill: 'none',
                    stroke: "#3c763d"
                })

            verticalGuide.selectAll('line')
                .styles({
                    stroke: "#3c763d"
                })

            let horizontalGuideScale = d3.scaleLinear()
                .domain([0, d3.max(chartAges)])
                .range([width, 0])

            let hAxis = d3.axisBottom(xScale)                
                .tickFormat(function (d, i) {
                    return chartAges[i];
                })
                

            let horizontalGuide = d3.select('svg').append('g')

            hAxis(horizontalGuide)
            horizontalGuide.attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')')
            horizontalGuide.selectAll('path')
                .styles({
                    fill: 'none',
                    stroke: "#3c763d"
                })
            horizontalGuide.selectAll('line')
                .styles({
                    stroke: "#3c763d"
                });
        }
        BarChart();
    }
});

/* ----future smoother transition from profile section to api section
var scrollingElement = (document.scrollingElement || document.body || body);

function scrollSmoothToBottom(id) {
    $(scrollingElement).animate({
        scrollTop: document.body.scrollHeight
    }, 500);
}

function scrollSmoothToTop(id) {
    $(scrollingElement).animate({
        scrollTop: 0
    }, 500);
}*/



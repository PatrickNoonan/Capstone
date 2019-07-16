/*https://c-sf.smule.com/s-ash-bck4/sing/performance/cover/76/6c/3671eed8-426c-4c54-8417-ec89a2a5f0ad.jpg
 */
$(document).ready(function () {

    var countryCounter = 0;
    var countryArray = [];
    var stateCounter = 0;
    var stateArray = [];

    am4core.ready(function () {

        am4core.useTheme(am4themes_animated);

        var chart = am4core.create("chartdiv", am4maps.MapChart);

        chart.geodata = am4geodata_worldLow;

        chart.projection = new am4maps.projections.Miller();

        var worldSeries = chart.series.push(new am4maps.MapPolygonSeries());
        worldSeries.exclude = ["AQ"];
        worldSeries.useGeodata = true;

        var polygonTemplate = worldSeries.mapPolygons.template;
        polygonTemplate.tooltipText = "{name}";
        polygonTemplate.fill = chart.colors.getIndex(0);
        polygonTemplate.nonScalingStroke = true;

        var hs = polygonTemplate.states.create("hover");
        hs.properties.fill = am4core.color("rgb(163, 103, 220)");

        var usaSeries = chart.series.push(new am4maps.MapPolygonSeries());
        usaSeries.geodata = am4geodata_usaLow;

        var usPolygonTemplate = usaSeries.mapPolygons.template;
        usPolygonTemplate.tooltipText = "{name}";
        usPolygonTemplate.fill = chart.colors.getIndex(0);
        usPolygonTemplate.nonScalingStroke = true;

        var uhs = usPolygonTemplate.states.create("hover");
        uhs.properties.fill = am4core.color("rgb(163, 103, 220)");

        var activeState = polygonTemplate.states.create("active");
        activeState.properties.fill = am4core.color("#2776BD");

        var usActiveState = usPolygonTemplate.states.create("active");
        usActiveState.properties.fill = am4core.color("#2776BD");

        function getStates() {
            $.ajax({
                url: '/Travelers/GetStatesVisitedDetails',
                data: "",
                dataType: "json",
                type: "GET",
                contentType: "application/json; chartset=utf-8",
            })
                .done(function (data) {
                    let usaStatesArray = usaSeries.dataItems.values;
                    stateCounter = data.length;
                    $("#pie-chartState").empty();
                    let pieData3 = { a: stateCounter, b: 50 - stateCounter } //50
                    makePie(pieData3, "state");

                    for (let i = 0; i < data.length; i++) {
                        for (let j = 0; j < usaStatesArray.length; j++) {
                            if (data[i].stateName == usaStatesArray[j].dataContext.name) {
                                usaSeries.dataItems.values[j].mapObject.isActive = true;
                            }
                        }
                    }

                });
        }

        function getCountries() {
            $.ajax({
                url: '/Travelers/GetCountriesVisitedDetails',
                data: "",
                dataType: "json",
                type: "GET",
                contentType: "application/json; chartset=utf-8",
            })
                .done(function (data) {
                    let countriesArray = worldSeries.dataItems.values;
                    console.log(data);
                    console.log(worldSeries.dataItems.values[3].mapObject.isActive)
                    countryCounter = data.length;
                    $("#pie-chartCountry").empty();
                    let pieData3 = { a: countryCounter, b: 195 - countryCounter } //195
                    makePie(pieData3, "country");

                    for (let i = 0; i < data.length; i++) {
                        for (let j = 0; j < countriesArray.length; j++) {
                            if (data[i].countryName == countriesArray[j].dataContext.name) {
                                worldSeries.dataItems.values[j].mapObject.isActive = true;
                            }
                        }
                    }

                });
        }

        $("#saveInputs").on("click", function postStates() {

            for (let i = 0; i < stateArray.length; i++) {
                let stateNameInput = stateArray[i];
                $.ajax({
                    method: "POST",
                    url: "/Travelers/PostStatesVisitedDetails",
                    datatype: "JSON",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    contentType: "application/json",
                    data: JSON.stringify({
                        "StateName": stateNameInput,
                        "HasVisited": true,
                    }),
                    success: function (data) {
                    }
                });
            }
            $("#saveMessage").append("<div class='message success'>Your visits have been logged!</div>")
            setTimeout(function () {
                $('.message').remove();
            }, 3000);

            for (let i = 0; i < countryArray.length; i++) {
                let countryNameInput = countryArray[i];
                $.ajax({
                    method: "POST",
                    url: "/Travelers/PostCountriesVisitedDetails",
                    datatype: "JSON",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    contentType: "application/json",
                    data: JSON.stringify({
                        "CountryName": countryNameInput,
                        "HasVisited": true,
                    }),
                    success: function (data) {
                    }
                });
            }
            $("#saveMessage").append("<div class='message success'>Your visits have been logged!</div>")
            setTimeout(function () {
                $('.message').remove();
            }, 3000);

        });

        $('#countriesVisited').append('<span id="countryCounterSpan">' + countryCounter + '</span>');
        $('#statesVisited').append('<span id="stateCounterSpan">' + stateCounter + '</span>');


        // event to toggle "active" state
        polygonTemplate.events.on("hit", function (ev) {
            $('#countryCounterSpan').remove();
            getCountries();
            
            let targetObjectName = ev.target.dataItem.dataContext.name;


            if (ev.target.isActive) {
                ev.target.isActive = !ev.target.isActive;
                for (var i = 0; i < country.length; i++) {
                    if (countryArray[i] == targetObjectName) {
                        placeArray.splice(i, 1);
                        break;
                    }
                }
                if (countryCounter > 0) {
                    countryCounter--;
                    $('#countriesVisited').append('<span id="countryCounterSpan">' + countryCounter + '</span>');
                }
            }
            else if (!ev.target.isActive) {
                ev.target.isActive = !ev.target.isActive;
                countryArray.push(targetObjectName);
                countryCounter++;
                $('#countriesVisited').append('<span id="countryCounterSpan">' + countryCounter + '</span>');
            }
        })

        usPolygonTemplate.events.on("hit", function (ev) {
            $('#stateCounterSpan').remove();   
            getStates();

            let targetObjectName = ev.target.dataItem.dataContext.name;

            if (ev.target.isActive) {
                ev.target.isActive = !ev.target.isActive;
                for (var i = 0; i < stateArray.length; i++) {
                    if (stateArray[i] == targetObjectName) {
                        stateArray.splice(i, 1);
                        break;
                    }
                }
                console.log(stateArray)
                if (stateCounter > 0) {
                    if (stateCounter == 1) {
                        countryCounter--;
                        $('#countryCounterSpan').remove();
                        $('#countriesVisited').append('<span id="countryCounterSpan">' + countryCounter + '</span>');
                    }
                    stateCounter--;
                    $('#statesVisited').append('<span id="stateCounterSpan">' + stateCounter + '</span>');
                }
            }
            else if (!ev.target.isActive) {
                ev.target.isActive = !ev.target.isActive
                stateArray.push(targetObjectName);
                console.log(stateArray)
                if (stateCounter == 0) {
                    countryCounter++;
                    $('#countryCounterSpan').remove();
                    $('#countriesVisited').append('<span id="countryCounterSpan">' + countryCounter + '</span>');
                }
                stateCounter++;
                $('#statesVisited').append('<span id="stateCounterSpan">' + stateCounter + '</span>');
            }
        })
    })

    var dateArray = []
    var monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    function getTravelDetails() {
        $.ajax({
            method: "GET",
            url: "/Travelers/GetTravelDetails",
            datatype: "JSON",
            data: "",
            contentType: "application/json",
            success: function (data) {

                data.sort(function (a, b) {
                    return (a.yearMonthVisited - (a.monthVisited * 2)) - (b.yearMonthVisited - (b.monthVisited * 2));
                });

                for (i = 0; i < data.length; i++) {
                    addEventToTimelineOnInit(data[i]);
                }

                function addEventToTimelineOnInit(dataObject) {

                    let year = dataObject.yearVisited
                    let month = dataObject.monthVisited
                    let place = dataObject.country
                    let photoUrl = dataObject.photoUrl
                    let description = dataObject.notes


                    if (checkForUniqueYear(year) == true) {
                        addYearToTimeline(year);
                    }
                    dateArray.push(
                        {
                            dateYear: year,
                            dateMonth: month
                        }
                    )
                    $("#timeline-date-" + year)
                        .after(
                            `<li>
                <a>•</a>
                <p class="timeline-date">
                    <img src="` + photoUrl + `" alt="" class="timeline-dateicon"><strong>` + place + ` - ` + monthArray[parseInt(month)] + ` ` + year + `</strong><br>
                        ` + description + `
                    </p>
                </li>`
                        )
                    $(".submitDiv").append("<div class='message success'>Thank you for submitting!</div>")
                    setTimeout(function () {
                        $('.message').remove();
                    }, 3000);
                }
            }
        })
    };

    $("#submitEventBtn").on("click", function addEventToTimeline() {

        let date = $("#enterNewDate").val();
        let year = date.substring(0, 4);
        let month = date.substring(5, 7);
        let place = $("#enterPlace").val();
        let photoUrl = $("#enterNewPhoto").val();
        let description = $("#enterDescription").val();

        let travelDetails = {
            "travelPlace": place,
            "travelMonth": month,
            "travelYear": year,
            "travelPhoto": photoUrl,
            "travelDescription": description,
        }
        postTravelDetails(travelDetails)

        if (checkForUniqueYear(year) == true) {
            addYearToTimeline(year);
        }
        dateArray.push(
            {
                dateYear: year,
                dateMonth: month
            }
        )
        $("#timeline-date-" + year)
            .after(
                `<li>
                <a>•</a>
                <p class="timeline-date">
                    <img src="` + photoUrl + `" alt="" class="timeline-dateicon"><strong>` + place + ` - ` + monthArray[parseInt(month)] + ` ` + year + `</strong><br>
                        ` + description + `
                    </p>
                </li>`
            )
        $(".submitDiv").append("<div class='message success'>Thank you for submitting! Please refresh for an updated timeline.</div>")
        setTimeout(function () {
            $('.message').remove();
        }, 3000);

    })

    function addYearToTimeline(year) {

        $("#timeline-ul")
            .append(
                `<li id="timeline-date-` + year + `" class="date">
                    <p>` + year + `</p>
                </li>`
            )
    }

    function checkForUniqueYear(year) {
        let counter = 0;
        for (let i = 0; i < dateArray.length; i++) {
            if (dateArray[i].dateYear == year) {
                counter++;
            }
        }
        if (counter == 0) {
            return true;
        } else if (counter > 0) {
            return false;
        }
    }

    function postTravelDetails(details) {
        $.ajax({
            method: "POST",
            url: "/Travelers/PostTravelDetails",
            datatype: "JSON",
            headers: {
                "Content-Type": "application/json"
            },
            contentType: "application/json",
            data: JSON.stringify({
                "Country": details.travelPlace,
                "YearVisited": details.travelYear,
                "MonthVisited": details.travelMonth,
                "Notes": details.travelDescription,
                "PhotoUrl": details.travelPhoto,
            }),
            success: function (data) {
                console.log(data);
            }
        })
    };

    getTravelDetails();  

    //----------------------------------------------------------------- Pie Chart -----------------------------------
    let pieData1 = { a: 0, b: 50 } //50
    let pieData2 = { a: 0, b: 195 }//195
    let type1 = "state";
    let type2 = "country";

    makePie(pieData1, type1);
    makePie(pieData2, type2);

    function makePie(data, type) {
        $('#pie-chart').empty();

        let width = 100
        height = 100
        margin = 5

        let radius = Math.min(width, height) / 2 - margin

        if (type == "state") {
            var svg = d3.select("#pie-chartState")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        } else if (type == "country") {
            var svg = d3.select("#pie-chartCountry")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
        }

        let color = d3.scaleOrdinal()
            .domain(data)
            .range(d3.schemeCategory20);

        let pie = d3.pie()
            .value(function (d) { return d.value; })
        let data_ready = pie(d3.entries(data))

        let arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(radius)

        svg
            .selectAll('mySlices')
            .data(data_ready)
            .enter()
            .append('path')
            .attr('d', arcGenerator)
            .attr('fill', function (d) {return (color(d.data.key))
            })
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 0.85)

        svg
            .selectAll('mySlices')
            .data(data_ready)
            .enter()
            .append('text')
            .text(function (d) { return d.data.value })
            .attr("transform", function (d) { return "translate(" + arcGenerator.centroid(d) + ")"; })
            .style("text-anchor", "middle")
            .style("font-size", 17)
    }            
});
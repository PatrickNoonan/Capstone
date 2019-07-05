am4core.ready(function () {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create map instance
    var chart = am4core.create("chartdiv", am4maps.MapChart);

    // Set map definition
    chart.geodata = am4geodata_worldLow;

    // Set projection
    chart.projection = new am4maps.projections.Miller();

    // Series for World map
    var worldSeries = chart.series.push(new am4maps.MapPolygonSeries());
    worldSeries.exclude = ["AQ"];
    worldSeries.useGeodata = true;

    var polygonTemplate = worldSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.fill = chart.colors.getIndex(0);
    polygonTemplate.nonScalingStroke = true;

    // Hover state
    var hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#367B25");

    // Series for United States map
    var usaSeries = chart.series.push(new am4maps.MapPolygonSeries());
    usaSeries.geodata = am4geodata_usaLow;

    var usPolygonTemplate = usaSeries.mapPolygons.template;
    usPolygonTemplate.tooltipText = "{name}";
    usPolygonTemplate.fill = chart.colors.getIndex(1);
    usPolygonTemplate.nonScalingStroke = true;

    var activeState = polygonTemplate.states.create("active");
    activeState.properties.fill = chart.colors.getIndex(4);

    var usActiveState = usPolygonTemplate.states.create("active");
    usActiveState.properties.fill = chart.colors.getIndex(4);

    console.log(usaSeries);

    function getStates() {
        $.ajax({
            url: '/Travelers/GetVisitedDetails',
            data: "",
            dataType: "json",
            type: "GET",
            contentType: "application/json; chartset=utf-8",
        })
            .done(function (data) {
                let usaStatesArray = usaSeries.dataItems.values;
                let indicesArray = [];
                console.log(data);

                for (let i = 0; i < data.length; i++) {
                    for (let j = 0; j < usaStatesArray.length; j++) {
                        if (data[i].stateName == usaStatesArray[j].dataContext.name) {
                            usaSeries.dataItems.values[j].mapObject.isActive = true;
                        }
                    }
                }
                console.log(usaSeries.dataItems.values[3].mapObject.isActive)
            });
    }
    getStates();

    $("#saveInputs").on("click", function postStates() {

        for (let i = 0; i < stateArray.length; i++) {
            let stateNameInput = stateArray[i];
            $.ajax({
                method: "POST",
                url: "/Travelers/PostVisitedDetails",
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

    });

    var countryCounter = 0;
    var countryArray = [];
    var stateCounter = 0;
    var stateArray = [];

    $('#countriesVisited').append('<span id="countryCounterSpan">' + countryCounter + '</span>');
    $('#statesVisited').append('<span id="stateCounterSpan">' + stateCounter + '</span>');


    // Create an event to toggle "active" state
    polygonTemplate.events.on("hit", function (ev) {
        $('#countryCounterSpan').remove();



        let targetObjectName = ev.target.dataItem.dataContext.name;

        console.log(ev.target.dataItem.dataContext)
        console.log(ev.target.dataItem.dataContext.name)

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
            });//Im a god damn genius

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
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

    //var countryCounter = @Html.Raw(Json.Encode(Model.CountriesVisited));
    //var stateCounter = @Html.Raw(Json.Encode(Model.StatesVisited));

    var countryCounter = 1;
    var stateCounter = 0;

    $('#countriesVisited').append('<span id="countryCounterSpan">' + countryCounter + '</span>');
    $('#statesVisited').append('<span id="stateCounterSpan">' + stateCounter + '</span>');

    // Create an event to toggle "active" state
    polygonTemplate.events.on("hit", function (ev) {
        $('#countryCounterSpan').remove();
        if (ev.target.isActive) {
            ev.target.isActive = !ev.target.isActive;
            if (countryCounter > 1) {
                countryCounter--;
                $('#countriesVisited').append('<span id="countryCounterSpan">' + countryCounter + '</span>');
            }

        }
        else if (!ev.target.isActive) {
            ev.target.isActive = !ev.target.isActive
            countryCounter++;
            $('#countriesVisited').append('<span id="countryCounterSpan">' + countryCounter + '</span>');
        }

    })

    usPolygonTemplate.events.on("hit", function (ev) {
        $('#stateCounterSpan').remove();
        if (ev.target.isActive) {
            ev.target.isActive = !ev.target.isActive;
            if (stateCounter > 0) {
                stateCounter--;
                $('#statesVisited').append('<span id="stateCounterSpan">' + stateCounter + '</span>');
            }

        }
        else if (!ev.target.isActive) {
            ev.target.isActive = !ev.target.isActive
            stateCounter++;
            $('#statesVisited').append('<span id="stateCounterSpan">' + stateCounter + '</span>');
        }

    })
});

function addToTimeline() {
    let year;
    let month = "January";
    let photoUrl;
    let description;

    $("#timeline-ul")
        .append(
            `<li class="date">
                    <p>` + year + `</p>
                </li>
                <li>
                    <a>•</a>
                    <p class="timeline-date">
                        <img src="http://lorempixel.com/g/110/110/cats/2" alt="" class="timeline-dateicon"><strong>` + month + `</strong><br>
                        Quisque ante justo, consectetur at posuere at, sagittis at erat. Suspendisse accumsan viverra accumsan. Nulla mauris est, semper vel leo ac, suscipit ullamcorper nibh. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
                    </p>
                </li>
                <li>
                    <a>•</a>
                    <p class="timeline-date">
                        <img src="http://lorempixel.com/g/110/110/cats/9" alt="" class="timeline-dateicon">								<strong>July 1970</strong><br>
                        Nulla pretium, tortor et hendrerit gravida, justo est efficitur ex, et auctor magna dolor vel ante. Quisque viverra urna justo, scelerisque auctor quam gravida vitae. Donec cursus placerat mattis.
                    </p>
                </li>
                <li>
                    <a>•</a>
                    <p class="timeline-date">
                        <strong>1970</strong><br>
                        Ut vitae felis risus. Vestibulum lorem eros, vehicula nec elit vel, tempus consequat urna. Suspendisse at accumsan turpis, eu bibendum odio
                    </p>
                </li>`
        )
}

function addYearToTimeline() {
    let year = $("#enterNewYear").val();

    $("#timeline-ul")
        .append(
            `<li id="timeline-date-` + year + `" class="date">
                    <p>` + year + `</p>
                </li>`
        )
}

function addEventToTimeline() {
    let year = $("EnterExistingYear").val();
    let month = $("#enterNewMonth").val();
    let photoUrl = $("#enterNewPhoto").val();
    let description = $("#enterDescription").val();

    $(`"#timeline-date-` + year + `"`)
        .after(
            `<li>
                <a>•</a>
                <p class="timeline-date">
                    <img src="` + photoUrl + `" alt="" class="timeline-dateicon"><strong>` + month + `</strong><br>
                        ` + description + `
                    </p>
                </li>`
        )

}


addYearToTimeline();
addMonthToTimeline();


























 //-------------------------------------------------------------- end am4core.ready()

/* OnLoad function */
//function JdOnLoad() {
//    document.getElementById("world_map").src = "j_countries_load.php";
//    document.getElementById("save_map").action = "j_save.php";
//}

/* Maps function */
//function onBoxClicked2(frame, country) {
//    if (document.getElementById(country).checked == false) {
//        var newcount = parseInt(document.getElementById('Count').innerHTML) + 1;
//        if (newcount == 0) { newcount = newcount + ' countries'; }
//        else if (newcount > 1) { newcount = newcount + ' countries'; }
//        else { newcount = newcount + ' country'; }
//        document.getElementById('Count').innerHTML = newcount;
//        document.getElementById(country).checked = true;
//        document.getElementById("world_map").src = "j_countries_load.php?action=add&country=" + country;
//    }
//    else {
//        var newcount = parseInt(document.getElementById('Count').innerHTML) - 1;
//        if (newcount == 0) { newcount = newcount + ' countries'; }
//        else if (newcount > 1) { newcount = newcount + ' countries'; }
//        else { newcount = newcount + ' country'; }
//        document.getElementById('Count').innerHTML = newcount;
//        document.getElementById(country).checked = false;
//        document.getElementById("world_map").src = "j_countries_load.php?action=remove&country=" + country;
//    }

//    document.getElementById("save_map").action = "j_save.php";

//}

///* Checkboxes function */
//function onBoxClicked(frame, country) {
//    if (document.getElementById(country).checked == true) {
//        var newcount = parseInt(document.getElementById('Count').innerHTML) + 1;
//        if (newcount == 0) { newcount = newcount + ' countries'; }
//        else if (newcount > 1) { newcount = newcount + ' countries'; }
//        else { newcount = newcount + ' country'; }
//        document.getElementById('Count').innerHTML = newcount;
//        document.getElementById("world_map").src = "j_countries_load.php?action=add&country=" + country;
//    }
//    else {
//        var newcount = parseInt(document.getElementById('Count').innerHTML) - 1;
//        if (newcount == 0) { newcount = newcount + ' countries'; }
//        else if (newcount > 1) { newcount = newcount + ' countries'; }
//        else { newcount = newcount + ' country'; }
//        document.getElementById('Count').innerHTML = newcount;
//        document.getElementById("world_map").src = "j_countries_load.php?action=remove&country=" + country;
//    }

//    document.getElementById("save_map").action = "j_save.php";
//}



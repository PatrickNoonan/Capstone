
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

    // Create an event to toggle "active" state
    polygonTemplate.events.on("hit", function (ev) {
        ev.target.isActive = !ev.target.isActive;
    })

    usPolygonTemplate.events.on("hit", function (ev) {
        ev.target.isActive = !ev.target.isActive;
    })

}); // end am4core.ready()



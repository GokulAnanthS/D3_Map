// variables for easy access
var data_size = 0;
var svg_width = 650;
var svg_height = 650;
var transition_duration = 700;
var map_size = 1600
var population;

// capturing current zoom Identity for plotting in same zoom level
let currentTransform = d3.zoomIdentity;

// SVG Area
const svg = d3.select('body')
    .append('svg')
    .attr("width", `${svg_width}px`)
    .attr("height", `${svg_height}px`);

// seperate tag for map and circles
const map_g = svg.append('g');
const plot_g = svg.append('g');

// geoMercator function to generate xy coordinates for uk map
const projection = d3.geoMercator().center([0, 56.8])
    .scale(map_size)
    .translate([375, 250]);

// geoPath to draw projected coordinates in SVG
const pathGenerator = d3.geoPath().projection(projection);

// Used to Zoom the map.
svg.call(d3.zoom().scaleExtent([1, 5]).on('zoom', () => {

    // storing current zoom co-ordinates
    currentTransform = d3.event.transform;

    // apply zoom to map
    map_g.attr('transform', currentTransform);

    // displays locations(circles) according to map
    plot_g.selectAll(".circle_state")
        .attr("cx", (d) => {
            const [x, y] = projection([d.lng, d.lat]);
            return d3.event.transform.applyX(x);
        })
        .attr("cy", (d) => {
            const [x, y] = projection([d.lng, d.lat]);
            return d3.event.transform.applyY(y);
        });

}));




function fetchData() {


    d3.json(`http://34.38.72.236/Circles/Towns/${data_size}`, function (err, data) {

        // Error Handling
        if (err) throw err;

        population = data;

        // Creating circle 
        const circle = plot_g.selectAll(".circle_state")
            .data(data, (d) => d.County);

        // Deleting circles not available in updated data [ Exit method ]
        circle.exit().transition()
            .duration(1000)
            .attr('r', 0)
            .remove();

        // Creating new circles
        const updatedCircles = circle.enter()
            .append("circle")
            .merge(circle);

        // Ploting new data
        updatedCircles.transition().duration(transition_duration)
            .attr("cx", (d) => {
                const [x, y] = projection([d.lng, d.lat]);
                return currentTransform.applyX(x);
            })
            .attr("cy", (d) => {
                const [x, y] = projection([d.lng, d.lat]);
                return currentTransform.applyY(y);
            })
            .transition().duration(transition_duration)
            .attr('r', (d) => d.Population * 0.00005)
            .attr('class', 'circle_state')
            .attr("fill", "#F45B69")
            .attr('opacity', 0.5);

        // Remove all tooltips
        updatedCircles.selectAll('title').remove();

        // create new tooltips for every circle
        updatedCircles.append('title')
            .attr('class', 'circle_title')
            .text((d) => `County : ${d.County}\nTown : ${d.Town}\nPopulation : ${d.Population}`);
    });
}


function drawMap() {

    d3.json('smix.geojson', function (err, data) {

        // Selecting map path
        const paths = map_g.selectAll('path');

        // creating map 
        paths.data(data.features).enter().append('path')
            .attr("class", function (d, i) { return "subunit_" + i; })
            .attr("fill", "#F6F4EB")
            .attr('d', d => pathGenerator(d))
            .attr('class', 'map_state')
            .append('title')
            .text(d => d.properties.LPA23NM.slice(0, -4));

        //  creating EventListner 
        const input = document.querySelector(".slider");

        // var dataCount = document.querySelector(".dataCount");

        input.addEventListener("click", (event) => {

            data_size = event.target.value;
            // dataCount.innerHTML = `You've fetched ${data_size} data..!`;
            fetchData();

        });

        fetchData();

    });
}



createPlayground();

// Creating slider, refresh button and map
function createPlayground() {
    const divTag = document.createElement("div");
    divTag.setAttribute("class", "control");
    divTag.appendChild(createSlider(divTag));
    divTag.appendChild(refreshButton(divTag));
    document.body.appendChild(divTag);
    drawMap();
}

// creating refresh button
function refreshButton() {
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("onclick", "fetchData()");
    button.setAttribute("class", "refresh");
    button.innerHTML = "Refresh";
    return button;
}

// creating slider
function createSlider() {
    const inputTag = document.createElement("input");
    inputTag.setAttribute("type", "range");
    inputTag.setAttribute("min", "0")
    inputTag.setAttribute("max", "500")
    inputTag.setAttribute("value", "10")
    inputTag.setAttribute("class", "slider")
    return inputTag;
}
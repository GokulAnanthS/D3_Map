


const svg = d3.select('body')
    .append('svg')
    .attr("width", "500px")
    .attr("height", "600px");

const map_g = svg.append('g');

const projection = d3.geoMercator().center([0, 55.4])
    .scale(1400)
    .translate([375, 250]);

const pathGenerator = d3.geoPath().projection(projection);

function drawMap() {
    d3.json('smix.geojson', function (err, data) {
        const paths = map_g.selectAll('path');
        paths.data(data.features).enter().append('path')
            .attr("class", function (d, i) { return "subunit_" + i; })
            .attr("fill", "#d3d3d3")
            .attr('d', d => pathGenerator(d))
            .attr('class', 'map_state')
            .append('title')
            .text(d => d.properties.LPA23NM.slice(0, -4));
    });
}



createControl();

function createControl() {
    const divTag = document.createElement("div");
    divTag.appendChild(createSlider(divTag));
    divTag.appendChild(refreshButton(divTag));
    document.body.appendChild(divTag);
    drawMap();
}

function refreshButton() {
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("class", "refresh")
    button.innerHTML = "Refresh";
    return button;
}

function createSlider(divTag) {
    const inputTag = document.createElement("input");
    inputTag.setAttribute("type", "range");
    inputTag.setAttribute("min", "0")
    inputTag.setAttribute("max", "500")
    inputTag.setAttribute("value", "0")
    inputTag.setAttribute("class", "slider")
    return inputTag;
}
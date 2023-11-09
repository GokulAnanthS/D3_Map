
var data_size;

const svg = d3.select('body')
    .append('svg')
    .attr("width", "500px")
    .attr("height", "600px");

const svg_g = svg.append('g');
const map_g = svg_g.append('g');
const plot_g = svg_g.append('g');

let currentTransform = d3.zoomIdentity;

svg.call(d3.zoom().on('zoom', () => {

    currentTransform = d3.event.transform;

    map_g.attr('transform', currentTransform);

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

const projection = d3.geoMercator().center([0, 55.4])
    .scale(1400)
    .translate([375, 250]);

const pathGenerator = d3.geoPath().projection(projection);


function fetchData() {
    d3.json(`http://34.38.72.236/Circles/Towns/${data_size}`, function (err, data) {
        const circle = plot_g.selectAll(".circle_state")
            .data(data, (d) => d.County);

        circle.exit().transition()
            .duration(1000)
            .attr('r', 0)
            .remove();

        const updatedCircles = circle.enter()
            .append("circle")
            .merge(circle);

        updatedCircles.transition().duration(500)
            .attr("cx", (d) => {
                const [x, y] = projection([d.lng, d.lat]);
                return currentTransform.applyX(x);
            })
            .attr("cy", (d) => {
                const [x, y] = projection([d.lng, d.lat]);
                return currentTransform.applyY(y);
            })
            .transition().duration(500)
            .attr('r', (d) => d.Population * 0.00005)
            .attr('class', 'circle_state')
            .attr("fill", "#F45B69")
            .attr('opacity', 0.5);

        updatedCircles.selectAll('title').remove();
        updatedCircles.append('title')
            .attr('class', 'circle_title')
            .text((d) => `County : ${d.County}\nTown : ${d.Town}\nPopulation : ${d.Population}`);
    });
}


function drawMap() {
    d3.json('smix.geojson', function (err, data) {
        const paths = map_g.selectAll('path');
        paths.data(data.features).enter().append('path')
            .attr("class", function (d, i) { return "subunit_" + i; })
            .attr("fill", "#F6F4EB")
            .attr('d', d => pathGenerator(d))
            .attr('class', 'map_state')
            .append('title')
            .text(d => d.properties.LPA23NM.slice(0, -4));
        const input = document.querySelector(".slider");

        // var dataCount = document.querySelector(".dataCount");

        input.addEventListener("click", (event) => {
            data_size = event.target.value;
            // dataCount.innerHTML = `You've fetched ${data_size} data..!`;
            console.log(data_size);
            fetchData(data_size);

        });
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
    button.setAttribute("onclick", "fetchData()");
    button.setAttribute("class", "refresh");
    button.innerHTML = "Refresh";
    return button;
}

function createSlider() {
    const inputTag = document.createElement("input");
    inputTag.setAttribute("type", "range");
    inputTag.setAttribute("min", "0")
    inputTag.setAttribute("max", "500")
    inputTag.setAttribute("value", "20")
    inputTag.setAttribute("class", "slider")
    return inputTag;
}
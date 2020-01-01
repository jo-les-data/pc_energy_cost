
function wattToDailyJoules(w, durationInHours) {
    res = durationInHours * 3600 * w;
    console.log("Total energy(J: ", res)
    return res
}

function wattToJoules(w_enery) {
    res = w_enery * 3600
    console.log("Equivalent in Joules", res)
    return res
}

function joulesToRun(energy) {
    // 1h running = 770kcal/h = 3,2e+6 J
    res = energy / 3.2e6
    console.log("Hours to run: ", res)
    return res
}

function joulesToWalk(energy) {
    // 1h walking = 267 kcal/h = 1,117e+6 J
    res = energy / 1.117e6
    console.log("Hours to walk: ", res)
    return res
}

function joulesToCycle(energy) {
    // 1h cycling = 402 kcal/h = 1,682e+6
    res = energy / 1.682e6
    console.log("Hours to cycle", res)
    return res
}

function joulesToSwim(energy) {
    // 1h swimming = 1071 kcal/h = 4481064 J
    res = energy / 4481064
    console.log("Hours to swim", res)
    return res
}
function joulesToBigMac(energy) {
    // 1 BigMac = 2300kJ
    res = energy / 2300000
    console.log("Number of BigMac: ", res)
    return res
}

// laptop
wattsConsumption = {
    "Google": 32.5,
    "Repos": 34.5,
    "Netflix": 40.5,
    "Jeux": 109
}

function compute_total_Watt_enery(wattsConsumption, pcUsage) {
    energy_total = 0
    Object.keys(pcUsage).forEach(function (key) {
        energy_total += pcUsage[key] * wattsConsumption[key]
    });
    console.log(energy_total);
    return energy_total
}

var gameUsage = 2, idlleUsage = 12, netflixUsage = 5, googleUsage = 2;
var pcUsage = 0;

var googleSlider, twitchSlider, netflixSlider, gameSlider, pcSlider;

var pcDetails = {
    "Google": googleUsage,
    "Repos": idlleUsage,
    "Netflix": netflixUsage,
    "Jeux": gameUsage
}

var pcColors = d3.scaleOrdinal()
    .domain(["Google", "Repos", "Netflix", "Jeux"])
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"]);


function key(d) { return d.data.label; };

function getData(data, colors) {
    var labels = colors.domain();
    return labels.map(function (label) {
        return { label: label, value: data[label] }
    });
}

function createTicks(tick, skipStep = 0) {
    var min = parseInt(tick.min)
    var max = parseInt(tick.max);
    var step = parseInt(tick.step); // can be empty string
    if (!step) step = 1;
    var div = document.createElement("div");
    div.className = "ticks"
    for (var i = min; i < max + 1; i = i + ((skipStep) ? skipStep : step)) {
        var span = document.createElement("span");
        span.className = "tick"
        span.innerHTML = i;
        div.appendChild(span);

    }

    tick.parentElement.appendChild(div);
}




window.onload = () => {
    var ticks = document.getElementsByClassName("slider");
    for (let tick of ticks) {
        createTicks(tick, 6);
    }
    googleSlider = document.getElementById("google");
    twitchSlider = document.getElementById("twitch");
    netflixSlider = document.getElementById("netflix");
    gameSlider = document.getElementById("jeux");
    pcSlider = document.getElementById("pc");


    googleSlider.value = googleUsage;
    twitchSlider.value = idlleUsage;
    netflixSlider.value = netflixUsage;
    gameSlider.value = gameUsage;

    gameSlider.oninput = () => {
        gameUsage = parseInt(gameSlider.value);
        refreshInterface();
    }
    netflixSlider.oninput = () => {
        netflixUsage = parseInt(netflixSlider.value);
        refreshInterface();
    }
    twitchSlider.oninput = () => {
        idlleUsage = parseInt(twitchSlider.value);
        refreshInterface();
    }
    googleSlider.oninput = () => {
        googleUsage = parseInt(googleSlider.value);
        refreshInterface();
    }
    pcSlider.oninput = () => {
        // console.log("input");
    }

    var svg = d3.select("#visu").append("svg").append("g");
    svg.append("g")
        .attr("class", "slices");
    svg.append("g")
        .attr("class", "labels");
    svg.append("g")
        .attr("class", "lines");

    var width = 680,
        height = 400,
        radius = Math.min(width, height) / 2;

    var pie = d3.pie()
        .sort(null)
        .value(function (d) {
            return d.value;
        });


    svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var refreshPie = function (data, colors) {

        var slice = svg.select(".slices").selectAll("path.slice")
            .data(pie(data));
        slice.enter()
            .insert("path")
            .attr('d', d3.arc()
                .innerRadius(radius * 0.8)
                .outerRadius(radius)
            )
            .attr('fill', function (d) { return (colors(d.data.label)) })
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 1)
        /* slice		
            .transition().duration(1000)
            .attrTween("d", function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    return arc(interpolate(t));
                };
            })*/
        slice.exit()
            .remove();
    }

    dataset = update_energy_data()
    var margin_bars = { top: 40, right: 30, bottom: 30, left: 50 },
        width_bars = 680 - margin_bars.left - margin_bars.right,
        height_bars = 400 - margin_bars.top - margin_bars.bottom;

    var greyColor = "#898989";
    var barColor = d3.interpolateInferno(0.4);
    var highlightColor = d3.interpolateInferno(0.3);

    var formatPercent = d3.format(".0%");

    var svg_bars = d3.select("body").append("svg")
        .attr("width", width_bars + margin_bars.left + margin_bars.right)
        .attr("height", height_bars + margin_bars.top + margin_bars.bottom)
        .attr("class", "barChart")
        .append("g")
        .attr("transform", "translate(" + margin_bars.left + "," + margin_bars.top + ")");

    var x = d3.scaleBand()
        .range([0, width_bars])
        .padding(0.4);
    var y = d3.scaleLinear()
        .range([height_bars, 0]);

    var xAxis = d3.axisBottom(x).tickSize([]).tickPadding(10);
    var yAxis = d3.axisLeft(y);
    // var yAxis = d3.axisLeft(y).tickFormat(formatPercent);

    x.domain(dataset.map(d => { return d.label; }));
    y.domain([0, d3.max(dataset, d => { return d.value; })]);
    // console.log(pcUsage)
    // y.domain([0, 1]);

    svg_bars.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height_bars + ")")
        .call(xAxis);
    svg_bars.append("g")
        .attr("class", "yaxis")
        .call(yAxis);

    svg_bars.selectAll(".bar").data(dataset)
        .enter().append("rect")
        .attr("class", "bar");

    svg_bars.selectAll(".label")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "label")

    refreshChart = function (dataset) {
        // yAxis = d3.axisLeft(y);
        var t = d3.transition()
        .duration(500)

        y.domain([0, d3.max(dataset, d => { return d.value; })]);
        yAxis.scale(y);

        svg_bars.selectAll(".bar").data(dataset)
            .style("display", d => { return d.value === null ? "none" : null; })
            .style("fill", d => {
                return d.value === d3.max(dataset, d => { return d.value; })
                    ? highlightColor : barColor
            })
            .attr("x", d => { return x(d.label); })
            .attr("width", x.bandwidth())
            .attr("y", d => { return height_bars; })
            .attr("height", 0)
            .attr("y", d => { return y(d.value); })
            .attr("height", d => { return height_bars - y(d.value); });

        svg_bars.selectAll(".label")
            .data(dataset)
            .attr("class", "label")
            .style("display", d => { return d.value === null ? "none" : null; })
            .attr("x", (d => { return x(d.label) + (x.bandwidth() / 2); }))
            .style("fill", d => {
                return d.value === d3.max(dataset, d => { return d.value; })
                    ? highlightColor : greyColor
            })
            .attr("y", d => { return height_bars; })
            .attr("height", 0)
            .text(d => { return d3.format(".1f")(d.value) })
            .attr("y", d => { return y(d.value) + .1; })
            .attr("dy", "-.7em");

        svg_bars
            .select(".yaxis")
            .call( yAxis);
    }

    var refreshInterface = function () {
        var newPcUsage = gameUsage + idlleUsage + netflixUsage + googleUsage;
        //TODO: check validitiy (SUM <= 24h)
        pcUsage = newPcUsage;
        pcSlider.value = pcUsage;
        pcDetails = {
            "Google": googleUsage,
            "Repos": idlleUsage,
            "Netflix": netflixUsage,
            "Jeux": gameUsage
        }

        //TODO refresh D3
        console.log(getData(pcDetails, pcColors));
        refreshPie(getData(pcDetails, pcColors), pcColors);
        refreshChart(update_energy_data())
        // print energies
        // dataset = update_energy_data()
    }
    refreshInterface();

    function update_energy_data() {
        tot_energy_w = compute_total_Watt_enery(wattsConsumption, pcDetails)
        tot_energy = wattToJoules(tot_energy_w)
        walk = joulesToWalk(tot_energy)
        run = joulesToRun(tot_energy)
        cycle = joulesToCycle(tot_energy)
        swim = joulesToSwim(tot_energy)
        burger = joulesToBigMac(tot_energy)

        data = [
            { "label": "time walking(h.)", "value": walk },
            { "label": "time running (h.)", "value": run },
            { "label": "time cycling (h.)", "value": cycle },
            { "label": "time swimming (h.)", "value": swim },
            { "label": "Big Macs", "value": burger }
        ]
        return data
    }
}
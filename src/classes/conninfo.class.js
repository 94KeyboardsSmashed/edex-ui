class Conninfo {
    constructor(parentId) {
        if (!parentId) throw "Missing parameters";

        // Create DOM
        this.parent = document.getElementById(parentId);
        this.parent.innerHTML += `<div id="mod_conninfo">
            <div id="mod_conninfo_innercontainer">
                <h1>DOWNLINK SPEED<i>UP / DOWN, MB/S</i></h1>
                <h2>TOTAL<i>0B IN</i></h2>
                <canvas id="mod_conninfo_canvas_top"></canvas>
                <canvas id="mod_conninfo_canvas_bottom"></canvas>
                <h3>OFFLINE</h3>
            </div>
        </div>`;

        this.total = document.querySelector("#mod_conninfo_innercontainer > h2 > i");
        this._pb = require("pretty-bytes");

        // Init Smoothie
        let TimeSeries = require("smoothie").TimeSeries;
        let SmoothieChart = require("smoothie").SmoothieChart;

        // Set chart options
        let chartOptions = [{
            limitFPS: 40,
            responsive: true,
            millisPerPixel: 70,
            interpolation: 'linear',
            grid:{
                millisPerLine: 5000,
                fillStyle:'transparent',
                strokeStyle:`rgba(${window.theme.r},${window.theme.g},${window.theme.b},0.4)`,
                verticalSections:3,
                borderVisible:false
            },
            labels:{
                fontSize: 10,
                fillStyle: `rgb(${window.theme.r},${window.theme.g},${window.theme.b})`,
                precision: 2
            }
        }];
        chartOptions.push(Object.assign({}, chartOptions[0]));  // Deep copy object, see http://jsben.ch/bWfk9
        chartOptions[0].minValue = 0;
        chartOptions[1].maxValue = 0;

        // Create chart
        this.series = [new TimeSeries(), new TimeSeries()];
        this.charts = [new SmoothieChart(chartOptions[0]), new SmoothieChart(chartOptions[1])];

        this.charts[0].addTimeSeries(this.series[0], {lineWidth:1.7,strokeStyle:`rgb(${window.theme.r},${window.theme.g},${window.theme.b})`});
        this.charts[1].addTimeSeries(this.series[1], {lineWidth:1.7,strokeStyle:`rgb(${window.theme.r},${window.theme.g},${window.theme.b})`});

        this.charts[0].streamTo(document.getElementById("mod_conninfo_canvas_top"), 1000);
        this.charts[1].streamTo(document.getElementById("mod_conninfo_canvas_bottom"), 1000);

        // Init updater
        this.updateInfo();
        this.infoUpdater = setInterval(() => {
            this.updateInfo();
        }, 1000);
    }
    updateInfo() {
        let time = new Date().getTime();

        let max0 = this.series[0].maxValue;
        let max1 = -this.series[1].minValue;
        if (max0 > max1) {
            this.series[1].minValue = -max0;
        } else if (max1 > max0) {
            this.series[0].maxValue = max1;
        }

        this.series[0].append(time, window.jsondata.conninfo.up);
        this.series[1].append(time, -window.jsondata.conninfo.down);        

        this.total.innerText = `${window.jsondata.conninfo.up} OUT, ${window.jsondata.conninfo.down} IN`.toUpperCase();
    }
}

module.exports = {
    Conninfo
};

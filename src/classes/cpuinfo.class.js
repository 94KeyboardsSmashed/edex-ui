class Cpuinfo {
    constructor(parentId) {
        if (!parentId) throw "Missing parameters";

        // Create initial DOM
        this.parent = document.getElementById(parentId);
        this.parent.innerHTML += `<div id="mod_cpuinfo">
        </div>`;
        this.container = document.getElementById("mod_cpuinfo");

        // Init Smoothie
        let TimeSeries = require("smoothie").TimeSeries;
        let SmoothieChart = require("smoothie").SmoothieChart;

        this.series = [];
        this.charts = [];


        let cpuName = window.jsondata.sat;
        cpuName = cpuName.substr(0, 30);
        cpuName.substr(0, Math.min(cpuName.length, cpuName.lastIndexOf(" ")));

        let innercontainer = document.createElement("div");
        innercontainer.setAttribute("id", "mod_cpuinfo_innercontainer");
        innercontainer.innerHTML = `<h1>ENVIROMENT<i>${cpuName}</i></h1>
            <div>
                <h1><em>TEMP</em><br>
                <i id="mod_cpuinfo_usagecounter0">Avg. --°C</i></h1>
                <canvas id="mod_cpuinfo_canvas_0" height="60"></canvas>
            </div>
            <div>
                <h1><em>HUMID</em><br>
                <i id="mod_cpuinfo_usagecounter1">Avg. --%</i></h1>
                <canvas id="mod_cpuinfo_canvas_1" height="60"></canvas>
            </div>
            <div>
                <div>
                    <h1>ACCEL<br>
                    <i id="mod_cpuinfo_temp">--m/s²</i></h1>
                </div>
                <div>
                    <h1>GYRO X<br>
                    <i id="mod_cpuinfo_speed_min">--rpm</i></h1>
                </div>
                <div>
                    <h1>GYRO Y<br>
                    <i id="mod_cpuinfo_speed_max">--rpm</i></h1>
                </div>
                <div>
                    <h1>GYRO Z<br>
                    <i id="mod_cpuinfo_tasks">--rpm</i></h1>
                </div>
            </div>`;
        this.container.append(innercontainer);

        for (var i = 0; i < 2; i++) {
            this.charts.push(new SmoothieChart({
                limitFPS: 30,
                responsive: true,
                millisPerPixel: 50,
                grid:{
                    fillStyle:'transparent',
                    strokeStyle:'transparent',
                    verticalSections:0,
                    borderVisible:false
                },
                labels:{
                    disabled: true
                },
                yRangeFunction: () => {
                    return {min:0,max:100};
                }
            }));
        }

        for (var i = 0; i < 2; i++) {
            // Create TimeSeries
            this.series.push(new TimeSeries());

            let serie = this.series[i];
            let options = {
                lineWidth: 1.7,
                strokeStyle: `rgb(${window.theme.r},${window.theme.g},${window.theme.b})`
            };

            if (i < 1) {
                this.charts[0].addTimeSeries(serie, options);
            } else {
                this.charts[1].addTimeSeries(serie, options);
            }
        }

        for (var i = 0; i < 2; i++) {
            this.charts[i].streamTo(document.getElementById(`mod_cpuinfo_canvas_${i}`), 500);
        }

        // Init updater
        this.updateCPUload();
        this.updateCPUtemp();
        this.updateCPUspeed();
        this.updateCPUtasks();
        this.loadUpdater = setInterval(() => {
            this.updateCPUload();
        }, 500);

        this.tempUpdater = setInterval(() => {
            this.updateCPUtemp();
        }, 2000);
        
        this.speedUpdater = setInterval(() => {
            this.updateCPUspeed();
        }, 1000);
        
        this.tasksUpdater = setInterval(() => {
            this.updateCPUtasks();
        }, 5000);
        
    }
    updateCPUload() { 
        let average = [[],[]];
        let findAvg = (array) => array.reduce((a, b) => a + b) / array.length;
        for (var i = 0; i < 2; i++) {
            if (i < 1){
                this.series[i].append(new Date().getTime(), window.jsondata.sat);
                average[i].push(window.jsondata.sat);
                try {
                    document.getElementById(`mod_cpuinfo_usagecounter${i}`).innerText = `Avg. ${findAvg(average[i])}°C`;
                } catch(e) {
                    // Fail silently, DOM element is probably getting refreshed (new theme, etc)
                }
            }
            else{
                this.series[i].append(new Date().getTime(), window.jsondata.sat);
                average[i].push(window.jsondata.sat);
                try {
                    document.getElementById(`mod_cpuinfo_usagecounter${i}`).innerText = `Avg. ${findAvg(average[i])}%`;
                } catch(e) {
                    // Fail silently, DOM element is probably getting refreshed (new theme, etc)
                }
            }
        }
        
        /*
        window.si.currentLoad().then(data => {
            let average = [[], []];

            if (!data.cpus) return; // Prevent memleak in rare case where systeminformation takes extra time to retrieve CPU info (see github issue #216)

            data.cpus.forEach((e, i) => {
                this.series[i].append(new Date().getTime(), e.load);

                if (i < this.divide) {
                    average[0].push(e.load);
                } else {
                    average[1].push(e.load);
                }
            });
            average.forEach((stats, i) => {
                average[i] = Math.round(stats.reduce((a, b) => a + b, 0)/stats.length);

                try {
                    document.getElementById(`mod_cpuinfo_usagecounter${i}`).innerText = `Avg. ${average[i]}%`;
                } catch(e) {
                    // Fail silently, DOM element is probably getting refreshed (new theme, etc)
                }
            });
        }); */
    }
    updateCPUtemp() {
        try {
            document.getElementById("mod_cpuinfo_temp").innerText = `${window.jsondata.sat}m/s²`;
        } catch(e) {
            // See above notice
        }
    }
    updateCPUspeed() {
        try {
            document.getElementById("mod_cpuinfo_speed_min").innerText = `${window.jsondata.sat}rpm`;
            document.getElementById("mod_cpuinfo_speed_max").innerText = `${window.jsondata.sat}rpm`;
        } catch(e) {
            // See above notice
        }
    }
    updateCPUtasks() {
        try {
            document.getElementById("mod_cpuinfo_tasks").innerText = `${window.jsondata.sat}rpm`;
        } catch(e) {
            // See above notice
        }
    }
}

module.exports = {
    Cpuinfo
};

class Netstat {
    constructor(parentId) {
        if (!parentId) throw "Missing parameters";

        // Create DOM
        this.parent = document.getElementById(parentId);
        this.parent.innerHTML += `<div id="mod_netstat">
            <div id="mod_netstat_inner">
                <h1>NETWORK STATUS<i id="mod_netstat_iname"></i></h1>
                <div id="mod_netstat_innercontainer">
                    <div>
                        <h1>STATE</h1>
                        <h2>UNKNOWN</h2> <!-- ACTIVE, OFFLINE -->
                    </div>
                    <div>
                        <h1>LOCATION</h1>
                        <h2>----,--,--</h2>
                    </div>
                    <div>
                        <h1>SATS</h1>
                        <h2>--</h2>
                    </div>
                </div>
            </div>
        </div>`;

        this.offline = false;
        this.fix = false;

        // Init updaters
        this.updateInfo();
        this.infoUpdater = setInterval(() => {
            this.updateInfo();
        }, 2000);
    }
    updateInfo() {
        let connection = window.jsondata.connection;
        if (connection){
            this.offline = false;
            document.getElementById("mod_netstat_iname").innerText = "Interface: "+window.jsondata.netstat.parser
            document.querySelector("#mod_netstat_innercontainer > div:nth-child(3) > h2").innerHTML = window.jsondata.netstat.sat; 
            if (window.jsondata.gps_fix){
              this.fix = true;
              document.querySelector("#mod_netstat_innercontainer > div:first-child > h2").innerHTML = "FIXED";
              document.querySelector("#mod_netstat_innercontainer > div:nth-child(2) > h2").innerHTML = window.jsondata.netstat.location;
            }
            else{
              this.fix = false;
              document.querySelector("#mod_netstat_innercontainer > div:first-child > h2").innerHTML = "SEARCH";
              document.querySelector("#mod_netstat_innercontainer > div:nth-child(2) > h2").innerHTML = "----,-- --";
            }

        }
        else{
            document.getElementById("mod_netstat_iname").innerText = "Interface: (offline)";

            this.offline = true;
            document.querySelector("#mod_netstat_innercontainer > div:first-child > h2").innerHTML = "OFFLINE";
            document.querySelector("#mod_netstat_innercontainer > div:nth-child(2) > h2").innerHTML = "----,-- --";
            document.querySelector("#mod_netstat_innercontainer > div:nth-child(3) > h2").innerHTML = "--"; 
        }
    }
}

module.exports = {
    Netstat
};

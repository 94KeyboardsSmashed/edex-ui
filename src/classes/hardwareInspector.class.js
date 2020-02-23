class HardwareInspector {
    constructor(parentId) {
        if (!parentId) throw "Missing parameters";

        // Create DOM
        this.parent = document.getElementById(parentId);
        this._element = document.createElement("div");
        this._element.setAttribute("id", "mod_hardwareInspector");
        this._element.innerHTML = `<div id="mod_hardwareInspector_inner">
            <div>
                <h1>HARDWARE</h1>
                <h2 id="mod_hardwareInspector_hardware" >NONE</h2>
            </div>
            <div>
                <h1>TYPE</h1>
                <h2 id="mod_hardwareInspector_type" >NONE</h2>
            </div>
            <div>
                <h1>VERSION</h1>
                <h2 id="mod_hardwareInspector_version" >NONE</h2>
            </div>
        </div>`;

        this.parent.append(this._element);

        this.updateInfo();
        this.infoUpdater = setInterval(() => {
            this.updateInfo();
        }, 20000);
    }
    updateInfo() {
        document.getElementById("mod_hardwareInspector_hardware").innerText = window.jsondata.hardwareInspector.hardware;
        document.getElementById("mod_hardwareInspector_type").innerText = window.jsondata.hardwareInspector.type;
        document.getElementById("mod_hardwareInspector_version").innerText = window.jsondata.hardwareInspector.version;
    }
}

module.exports = {
    HardwareInspector
};

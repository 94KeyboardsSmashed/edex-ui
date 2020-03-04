class Toplist {
    constructor(parentId) {
        if (!parentId) throw "Missing parameters";

        // Create DOM
        this.parent = document.getElementById(parentId);
        this._element = document.createElement("div");
        this._element.setAttribute("id", "mod_toplist");
        this._element.innerHTML = `<h1>SENSOR DATA<i>UNIT | NAME | MAX | VAL</i></h1><br>
        <table id="mod_toplist_table"></table>`;

        this.parent.append(this._element);

        this.updateList();
        this.listUpdater = setInterval(() => {
            this.updateList();
        }, 2000);
    }
    updateList() {
        let data = window.jsondata.toplist
        let list = data.sensortable.sort((a, b) => {
            return b.max-a.max
        }).splice(0, 5);

        document.querySelectorAll("#mod_toplist_table > tr").forEach(el => {
            el.remove();
        });
        list.forEach(proc => {
            let el = document.createElement("tr");
            el.innerHTML = `<td>${proc.rate}</td>
                            <td><strong>${proc.sensor}</strong></td>
                            <td>${proc.max}</td>
                            <td>${Math.round((parseFloat(proc.value) + Number.EPSILON) * 100) / 100}</td>`;
            document.getElementById("mod_toplist_table").append(el);
        });
    }
}

module.exports = {
    Toplist
};

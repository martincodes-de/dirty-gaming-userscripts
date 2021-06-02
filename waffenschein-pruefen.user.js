// ==UserScript==
// @name         Dirty-Gaming.com Aktensystemverbesserung: Waffenlizenzstatus direkt anzeigen
// @version      1.0.0
// @description  Prüft ob eine Waffenlizenz vorhanden ist und gibt es beim Aufruf der Lizenzabfrage direkt als Informationsalert aus. Kann Sekunden sparen.
// @author       martincodes
// @match        https://akte.dirty-gaming.com/lizenzen
// @icon         https://i.imgur.com/q2zMMHS.png
// @updateURL
// @grant        none
// ==/UserScript==

var id_input = document.getElementById("LizenzaktenID");

function pruefeWaffenschein() {
    var zellen = document.querySelectorAll("table tr td");


    var waffenlizenz_vorhanden = 0;

    var alert_waffenlizenz_vorhanden = "<div class='alert alert-success mt-4'>Waffenschein (Waffenlizenz) vorhanden!</div>";
    var alert_waffenlizenz_nicht_vorhanden = "<div class='alert alert-warning mt-4'>Waffenschein (Waffenlizenz) nicht vorhanden!</div>";


    for (let i = 0; i < zellen.length; i++) {
        let datenwert = zellen[i].innerHTML;
        if (datenwert == "Waffenlizenz") {
            waffenlizenz_vorhanden++;
        }
    }

    if (waffenlizenz_vorhanden > 0) {
        id_input.outerHTML += alert_waffenlizenz_vorhanden;
    } else {
        id_input.outerHTML += alert_waffenlizenz_nicht_vorhanden;
    }
}

id_input.addEventListener("keyup", pruefeWaffenschein);
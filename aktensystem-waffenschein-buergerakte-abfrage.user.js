// ==UserScript==
// @name         Dirty-Gaming.com Aktensystemverbesserung: Waffenscheinstatus in Bürgerakte abfragen
// @version      1.0.0
// @description  Zeigt in Bürgerakte an, ob Waffenschein vorhanden ist oder nicht und fügt eine Lizenzübersicht in die erste Tabelle ein.
// @author       martincodes
// @match        https://akte.dirty-gaming.com/buerger/*
// @match        file:///C:/Users/Martin/Desktop/Dirty-Aktensystem/*
// @icon         https://i.imgur.com/q2zMMHS.png
// @updateURL    https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/aktensystem-waffenschein-buergerakte-abfrage.user.js
// @downloadURL  https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/aktensystem-waffenschein-buergerakte-abfrage.user.js
// @grant        none
// @run-at       document-body
// ==/UserScript==

var alertDiv = document.querySelector("div.state");
alertDiv.innerHTML += "<b class='stateButton' id='waffenschein-alert'>Kein Waffenschein</b>";

var url_pfad = window.location.pathname;
var personalausweis_id = url_pfad.replace("/buerger/", "");

var abfrage = new XMLHttpRequest();
abfrage.open("GET", "https://akte.dirty-gaming.com/lizenzen/suche/"+personalausweis_id);
abfrage.onload = function() {
    if (this.status === 200) {
        let lizenzen = JSON.parse(this.responseText);
        let lizenzenListenPunkte = "";

        for (let i = 0; i < lizenzen.length; i++) {
            /* Waffenscheininformation einbinden */
            console.log(lizenzen[i]["name"]);

            if (lizenzen[i]["name"] == "Waffenlizenz") {
                document.getElementById("waffenschein-alert").innerText = "Waffenschein vorhanden!";
                document.getElementById("waffenschein-alert").style.backgroundColor = "green";
            }

            /* Lizenzen unter Waffenscheinbereich vorbereiten */
            lizenzenListenPunkte += "<li>"+ lizenzen[i]["name"] +"</li>";
        }

        /* Liste in Tabelle einfügen */
        var letzteTableRow = document.querySelectorAll("div#buergerakteUebersicht table tr")[4];
        var neueTableRow = "<tr><td></td><td>Lizenzen</td><td>"+"<ul>"+ lizenzenListenPunkte +"</ul>"+"<tr>";
        letzteTableRow.outerHTML += neueTableRow;
    }
};
abfrage.send();
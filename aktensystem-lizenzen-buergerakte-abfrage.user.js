// ==UserScript==
// @name         Dirty-Gaming.com Aktensystemverbesserung: Lizenzen in Bürgerakte
// @version      1.1.0
// @description  Zeigt in Bürgerakte an, ob Waffenschein vorhanden ist oder nicht und fügt eine Lizenzübersicht in die erste Tabelle in der Übersicht ein.
// @author       martincodes
// @match        https://akte.dirty-gaming.com/buerger/*
// @match        file:///C:/Users/Martin/Desktop/Dirty-Aktensystem/*
// @icon         https://i.imgur.com/q2zMMHS.png
// @updateURL    https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/aktensystem-lizenzen-buergerakte-abfrage.user.js
// @downloadURL  https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/aktensystem-lizenzen-buergerakte-abfrage.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

var alertDiv = document.querySelector("div.state");
alertDiv.innerHTML += "<b class='stateButton' id='waffenschein-alert'>Kein Waffenschein</b>";

var url_pfad = window.location.pathname;
var personalausweis_id = url_pfad.replace("/buerger/", "");

const headerH2 = document.getElementById('pageBuergerakte').children[0].children[0].children[0];
if(headerH2.tagName.toLowerCase() === 'h2'){
    headerH2.innerHTML = headerH2.innerHTML + ' [ID: '+personalausweis_id+']'
}

var abfrage = new XMLHttpRequest();
abfrage.open("GET", "https://akte.dirty-gaming.com/lizenzen/suche/"+personalausweis_id);
abfrage.onload = function() {
    if (this.status === 200) {
        let lizenzen = JSON.parse(this.responseText);
        let lizenzenListenPunkte = "";

        for (let i = 0; i < lizenzen.length; i++) {
            /* Waffenscheininformation einbinden */
            if (lizenzen[i]["name"] == "Waffenlizenz") {
                document.getElementById("waffenschein-alert").innerText = "Waffenschein vorhanden!";
                document.getElementById("waffenschein-alert").style.backgroundColor = "green";
            }
            /* Lizenzen unter Waffenscheinbereich vorbereiten */
            lizenzenListenPunkte += "<li>"+ lizenzen[i]["name"] +"</li>";
        }

        /* Liste in Tabelle einfügen */
        var tableBody = document.getElementById("buergerakteUebersicht").children[1].children[0];
        var idTableRow = `<tr><td class="px-0 py-2"><i class="fas fa-address-card"></i></td><td class="pl-1 py-2">Personalausweis ID</td><td class="py-2">${personalausweis_id}</td></tr>`;
        tableBody.innerHTML = idTableRow + tableBody.innerHTML;
        var letzteTableRowList = document.querySelectorAll("div#buergerakteUebersicht table tr");
        var letzteTableRow = letzteTableRowList[letzteTableRowList.length-1];
        var neueTableRow = `<tr><td class="px-0 py-2"><i class="fas fa-id-card-alt"></i></td><td class="pl-1 py-2">Lizenzen</td><td class="py-2"><ul>${lizenzenListenPunkte}</ul><tr>`;
        letzteTableRow.outerHTML += neueTableRow;
    }
};
abfrage.send();
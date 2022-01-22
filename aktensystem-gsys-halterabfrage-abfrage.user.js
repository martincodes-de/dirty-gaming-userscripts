// ==UserScript==
// @name         Dirty-Gaming.com Aktensystemverbesserung: Gangaktensystemsuche in Halterabfrage
// @version      1.0.0
// @description  Fügt Suchbutten für das Gangaktensystem in das Aktensystem bei Halterabfrage ein.
// @author       martincodes
// @match        https://akte.dirty-gaming.com/halterabfrage
// @icon         https://i.imgur.com/q2zMMHS.png
// @updateURL    https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/aktensystem-gsys-halterabfrage-abfrage.user.js
// @downloadURL  https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/aktensystem-gsys-halterabfrage-abfrage.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

// document.querySelector("table#pageHalterabfrage_Suche_Tab tbody").children[0].children[6].children[0].getAttribute("data-id");

let suchButton = document.getElementById("halterabfrageSuche").outerHTML += "<button id='gsysBtnCreatorBtn' class='btn btn-sm btn-info w-100 waves-effect waves-light'>GSYS Suchbutton für unten stehende Halter erstellen</button>";

var gsysBaseUrl = "https://gangakten.lspd-dirty.de";

function setupGsysBtns() {
    var tablerows = document.querySelector("table#pageHalterabfrage_Suche_Tab tbody").children;

    for (let row of tablerows) {
        let buergerAkteOeffnenBtn = row.children[6].children[0];
        let personalausweis_id = buergerAkteOeffnenBtn.getAttribute("data-id");
        console.log(personalausweis_id);
        var gsysUserscriptSucheUrl = gsysBaseUrl+"/backend/search/by/userscript/" + personalausweis_id;
        let gsysBtn = "<a class='btn btn-sm btn-info w-75' href='"+gsysUserscriptSucheUrl+"' target='_blank'>GSYS-Suche</a>";
        buergerAkteOeffnenBtn.outerHTML += gsysBtn;
    }
}

document.getElementById("gsysBtnCreatorBtn").addEventListener("click", setupGsysBtns);
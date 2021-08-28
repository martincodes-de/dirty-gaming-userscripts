// ==UserScript==
// @name         Dirty-Gaming.com Aktensystemverbesserung: Bußgeldrechnertausch
// @version      1.0.3
// @description  Tauscht den Bußgeldrechnerbutton mit den Bußgeldrechnern, die wir nutzen, da der interne Rechner nicht funktional ist.
// @author       martincodes
// @match        https://akte.dirty-gaming.com/buerger/*
// @match        file:///C:/Users/Martin/Desktop/Dirty-Aktensystem/*
// @icon         https://i.imgur.com/q2zMMHS.png
// @updateURL    https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/aktensystem-bussgeldrechner-tausch.user.js
// @downloadURL  https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/aktensystem-bussgeldrechner-tausch.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

var bussgeldtags = document.getElementsByClassName("bußgeldtag");

var bussgeldrechnerDIV = "<div id='bussgeldrechner' class='bußgeldtag' style='border:0'>" +
    "<div class='btn-group' role='group'>" +
    "<a href='https://bussgeldrechner.lspd-dirty.de' target='_blank' class='btn btn-primary btn-sm'>RTS Bußgeldrechner</a>" +
    "<a href='http://lspdbsys.lspd-dirty.de' target='_blank' class='btn btn-info btn-sm'>LSPDBSYS</a>" +
    "</div>" +
    "</div>";

for (let i = 0; i < bussgeldtags.length; i++) {
    let bussgeldtag = bussgeldtags[i];
    bussgeldtag.outerHTML = bussgeldrechnerDIV
}
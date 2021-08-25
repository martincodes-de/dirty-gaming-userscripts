// ==UserScript==
// @name         Dirty-Gaming.com Aktensystemverbesserung: Zuletzt angeklickte Akte anzeigen
// @version      1.0.0
// @description  Fügt dem Titel einer Fallakte bei der Öffnung eine Farbe hinzu. So sehen Sie, welche Fallakte Sie zuletzt geöffnet haben.
// @author       martincodes
// @match        https://akte.dirty-gaming.com/buerger/*
// @match        file:///C:/Users/Martin/Desktop/Dirty-Aktensystem/*
// @icon         https://i.imgur.com/q2zMMHS.png
// @updateURL    https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/aktensystem-zuletzt-angeklickte-akte-markieren.user.js
// @downloadURL  https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/aktensystem-zuletzt-angeklickte-akte-markieren.user.js
// @grant        none
// @run-at       document-body
// ==/UserScript==

var fallaktenTitel = document.querySelectorAll("td.verlaufaktenname a[data-fallakte]");

function entferneAlleAktivenFallaktenMarker() {
    fallaktenTitel.forEach(function (fallakte) {
        fallakte.classList.remove("badge");
        fallakte.classList.remove("badge-success");
    });
}

fallaktenTitel.forEach(item => {
    item.addEventListener('click', event => {
        entferneAlleAktivenFallaktenMarker();
        event.target.classList.add("badge");
        event.target.classList.add("badge-success");
    });
});
// ==UserScript==
// @name         Dirty-Gaming.com Leitstellensystemverbesserung: Status für Userscripts anzeigen
// @version      1.0.3
// @description  Zeigt im Menü an, dass Userscripts verwendet werden.
// @author       martincodes
// @match        https://leitstelle.dirty-gaming.com/*
// @match        file:///C:/Users/Martin/Desktop/Dirty-Leitstellensystem/*
// @icon         https://i.imgur.com/q2zMMHS.png
// @updateURL    https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/userscript-status-leitstellensystem.user.js
// @downloadURL  https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/userscript-status-leitstellensystem.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

var body = document.getElementsByTagName("body")[0];

body.innerHTML += "<small>Userscripts aktiviert :-)</small>";
// ==UserScript==
// @name         Dirty-Gaming.com Leitstellensystemverbesserung: Status für Userscripts anzeigen
// @version      1.0.0
// @description  Zeigt im Menü an, dass Userscripts verwendet werden.
// @author       martincodes
// @match        https://leitstelle.dirty-gaming.com/*
// @match        file:///C:/Users/Martin/Desktop/Dirty-Leitstellensystem/*
// @icon         https://i.imgur.com/q2zMMHS.png
// @updateURL
// @downloadURL
// @grant        none
// ==/UserScript==

var body = document.getElementsByTagName("body")[0];

body.innerHTML += "<small>Userscripts aktiviert :-)</small>";
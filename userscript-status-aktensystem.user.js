// ==UserScript==
// @name         Dirty-Gaming.com Aktensystemverbesserung: Status für Userscripts anzeigen
// @version      1.0.0
// @description  Zeigt im Menü an, dass Userscripts verwendet werden.
// @author       martincodes
// @match        https://akte.dirty-gaming.com/*
// @icon         https://i.imgur.com/q2zMMHS.png
// @updateURL    https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/userscript-status-aktensystem.js
// @grant        none
// ==/UserScript==

var menuTitel = document.getElementById("navName");

menuTitel.innerHTML = "<b>Atensystem</b><br><small>Userscripts aktiviert :-)</small>";
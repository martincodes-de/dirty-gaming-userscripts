// ==UserScript==
// @name         Dirty-Gaming.com Leitstellensystemverbesserung: Schwarze Streifen ausblenden
// @version      1.0.0
// @description  Fügt die Option hinzu, Streifen mit schwarzem Hintergrund auszublenden. (Sind meistens Code 10 oder so).
// @author       martincodes
// @match        https://leitstelle.dirty-gaming.com/dispatch
// @match        file:///C:/Users/Martin/Desktop/Dirty-Leitstellensystem/*
// @icon         https://i.imgur.com/q2zMMHS.png
// @updateURL    https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/leitstellensystem-schwarze-streifen-ausblenen-dispatching.user.js
// @downloadURL  https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/leitstellensystem-schwarze-streifen-ausblenen-dispatching.user.js
// @grant        none
// @run-at       document-body
// ==/UserScript==

var schwarzeStreifen = document.getElementsByClassName("schwarz");
var aktualisierenButton = document.getElementById("aktualisieren");
var optionenRadioButtons = "<br><p>Zuteiloptionen:</p>" +
    "<input type='radio' id='userscriptOptionStreifenAusblenden-ja' name='userscriptOptionStreifenAusblenden' value='ja'>" +
    "<label for='userscriptOptionStreifenAusblenden-ja'> Schwarze Streifen ausblenden</label><br>" +
    "<input type='radio' id='userscriptOptionStreifenAusblenden-nein' name='userscriptOptionStreifenAusblenden' value='nein' checked>" +
    "<label for='userscriptOptionStreifenAusblenden-nein'> Schwarze Streifen nicht ausblenden</label><br>"+
    "<small>Schwarze Streifen = Streifen mit Code 10, Einsatz 1, Einsatz 2, etc. (also nicht verfügbar)</small><br><br>";

aktualisierenButton.outerHTML += optionenRadioButtons;

var schwarzeStreifenAnzeigen = document.getElementById("userscriptOptionStreifenAusblenden-nein");
var schwarzeStreifenNichtAnzeigen = document.getElementById("userscriptOptionStreifenAusblenden-ja");

function schwarzeStreifenSichtbarkeitAendern() {
    if (schwarzeStreifenAnzeigen.checked) {
        for (let i = 0; i < schwarzeStreifen.length; i++) {
            schwarzeStreifen[i].style.display = "unset";
            console.log("Schwarze Streifen versteckt.");
        }
    }

    if (schwarzeStreifenNichtAnzeigen.checked) {
        for (let i = 0; i < schwarzeStreifen.length; i++) {
            schwarzeStreifen[i].style.display = "none";
            console.log("Schwarze Streifen versteckt.");
        }
    }
}

schwarzeStreifenAnzeigen.addEventListener("change", schwarzeStreifenSichtbarkeitAendern);
schwarzeStreifenNichtAnzeigen.addEventListener("change", schwarzeStreifenSichtbarkeitAendern);

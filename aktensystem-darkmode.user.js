// ==UserScript==
// @name         Dirty-Gaming.com Aktensystemverbesserung: Darkmode
// @version      1.0.4
// @description  Nutzt einen Darkmode im Aktensystem
// @author       martincodes
// @match        https://akte.dirty-gaming.com/*
// @match        file:///C:/Users/Martin/Desktop/Dirty-Aktensystem/*
// @icon         https://i.imgur.com/q2zMMHS.png
// @updateURL    https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/aktensystem-darkmode.user.js
// @downloadURL  https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/aktensystem-darkmode.user.js
// @grant        none
// @run-at       document-body
// ==/UserScript==

var styles = [
  "body {background-color: #1c1a1a; color: white;}",
    ".card {background-color: #262626; color: white !important;}",
    "table {color: #fff !important;}",
    ".form-control {color: black; !important}",
    ".form-control:focus {color: black; !important}",
    "h1, h2, h3, h4, h5, h6 {color: white; !important}",
    ".verlaufaktentabelle {color: white !important}",
    ".verlaufaktenname {color: white !important}",
    ".bußgeldtag {border: 0}"
];

var styletag = "<style>";

for (let i = 0; i < styles.length; i++) {
    styletag += " "+styles[i];
}

styletag += "</style>";

document.getElementsByTagName("head")[0].innerHTML += styletag;


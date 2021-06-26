// ==UserScript==
// @name         Dirty-Gaming.com Aktensystemverbesserung: Darkmode
// @version      1.0.9
// @description  Nutzt einen Darkmode im Aktensystem
// @author       martincodes
// @match        https://akte.dirty-gaming.com/*
// @match        file:///C:/Users/Martin/Desktop/Dirty-Aktensystem/*
// @exclude      https://akte.dirty-gaming.com/personal
// @exclude      https://akte.dirty-gaming.com/kammerlog
// @exclude      https://akte.dirty-gaming.com/kammerlog/*
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
  ".bußgeldtag {border: 0}",
  "table.table a {color:white;}",
  "table.table input {color:white;}",
  "table.table input:focus {color:white;}",
  "#HalterabfrageKennzeichen.form-control {color:white !important;}",
  "#HalterabfrageGestellnunner.form-control {color:white !important;}",
  ".forensicsInput {color:white !important;}",
  "#buergerakteID.form-control {color:white !important;}",
  "#buergerakteName.form-control {color:white !important;}",
  "#LizenzaktenID.form-control {color:white !important;}",
  "#dispatchesTable_filter {color:white !important;}",
  "table.dataTable tbody tr {background-color:unset !important;}",
  ".table-hover tbody tr:hover {color: unset;}",
"#fallakteNummer.form-control {color:white !important;}",
  "#bearbeiterHaft.form-control {color:white !important;}",
  "#anmerkungenHaft.form-control {color:white !important;}",
  "#beschlagnahmungenHaft.form-control {color:white !important;}",
  "#ortHaft.form-control {color:white !important;}",
  "#haftzeit.form-control {color:white !important;}",
];

var styletag = "<style>";

for (let i = 0; i < styles.length; i++) {
  styletag += " "+styles[i];
}

styletag += "</style>";

document.getElementsByTagName("head")[0].innerHTML += styletag;
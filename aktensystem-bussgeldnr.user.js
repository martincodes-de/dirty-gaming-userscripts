// ==UserScript==
// @name         Dirty-Gaming.com Aktensystemverbesserung: Bußgeldakten Aktennummer
// @version      1.0.0
// @description  Ergänzt die Bußgeldakten mit akten nummern.
// @author       gnamly
// @match        https://akte.dirty-gaming.com/buerger/*
// @icon         https://i.imgur.com/q2zMMHS.png
// @updateURL    https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/aktensystem-bussgeldnr.user.js
// @downloadURL  https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/aktensystem-bussgeldnr.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

var url_pfad = "";
var personalausweis_id ="";

var akten = [];
var fehler = false;

function start() {
    url_pfad = window.location.pathname;
    personalausweis_id = url_pfad.replace("/buerger/", "");

    var aktenAbfrage = new XMLHttpRequest();
    aktenAbfrage.open("GET", "https://akte.dirty-gaming.com/fallakten/buerger/Polizei%20Bussgeld/all/"+personalausweis_id, false);
    aktenAbfrage.onload = function() {
      if(this.status === 200){
        console.log("Bußgeld Akten Abfrage erfolgreich");
        akten = JSON.parse(this.responseText);
        html();
      }
      else fehler = true;
    }
    aktenAbfrage.send();
}

function html() {
  const tableBody = document.getElementById('buergeraktePolizeiBussgeldAktenVerlauf').children[0];
  setTimeout(()=>{
    console.log('table body length', tableBody.children.length);
    for(var i = 0;i < tableBody.children.length;i++) {
      const child = tableBody.children[i].children[0].children[0];
      console.log('tr', child);
      child.innerHTML = '<b>AktNr.: ' + akten[i].id + '</b> - ' + child.innerHTML;
    }
  }, 3000);
}

start();
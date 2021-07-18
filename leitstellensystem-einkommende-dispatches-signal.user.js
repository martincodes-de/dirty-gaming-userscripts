// ==UserScript==
// @name         Dirty-Gaming.com Leitstellensystemverbesserung: Hinweise bei neuen, einkommenden Dispatches
// @version      1.0.3
// @description  Fügt die Option hinzu, ein akustisches und visuelles Signal auszugeben, wenn neue Dispatches einkommen.
// @author       martincodes
// @match        https://leitstelle.dirty-gaming.com/dispatch
// @match        file:///C:/Users/Martin/Desktop/Dirty-Leitstellensystem/*
// @icon         https://i.imgur.com/q2zMMHS.png
// @updateURL    https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/leitstellensystem-einkommende-dispatches-signal.user.js
// @downloadURL  https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/leitstellensystem-einkommende-dispatches-signal.user.js
// @grant        none
// @run-at       document-body
// ==/UserScript==

/* HINWEIS - FÜR SOUNDAUSGABE
* Damit ein Sound wiedergegeben werden kann, muss dies im Browser eingestellt werden.
* Die Seite muss die Berechtigung erhalten, dass Audio (und ggf. Video) abgespielt werden kann.
* Wenn dies nicht aktiviert wird, entfällt das Audio Signal. Ein Hinweisalert wird trotzdem ausgegeben.
* Aktuell ist unklar, ob es mit Panic Buttons richtig funktioniert.
* */

const zeitBeiAufruf = Date.now();
const neueDispatchesAlert = "<div id='neue-dispatches-alert' class='alert alert-warning' style='display: none'>Es gibt neu eingegangene Dispatches! Bitte Seite aktualisieren, um Dispatches zu sehen und zuzuweisen. <a href='/dispatch'>Seite aktualisieren</a></div>";
const aktualisierenButton = document.getElementById("aktualisieren");

var alleStreifenIDs = [];
var soundAktiv = 0;

aktualisierenButton.outerHTML += neueDispatchesAlert;

/* Panic Button-Modals und Co. */

var panicButtonID = 0;

var panicbuttonModalTemplate = "<!-- Panic Button Modal -->"+
"<div id='panicbutton-modal' class='panicbutton-modal'>"+
  "<!-- Modal content -->"+
  "<div class='panicbutton-modal-content'>"+
    "<h1>Panicbutton ausgelöst</h1>"+
    "<p>Es wurde ein Panicbutton (ID: <span id='panicbutton-dispatch-id'></span>) ausgelöst: <b><span id='panicbutton-dispatch-information'></span></b></p>"+
    "<hr><button id='panicbutton-dispatching' class='btn btn-primary mr-1'>Alle Streifen zuteilen</button>"+
    "<button id='panicbutton-reload' class='btn btn-secondary' onclick='location.reload()'>Manuell dispatching übernehmen</button>"+
  "</div>"+
"</div>";

var panicbuttonModalTemplateStyle = "<style>"+
".panicbutton-modal{display:none;position:fixed;z-index:1005;padding-top:100px;left:0;top:0;width:100%;height:100%;overflow:auto;background-color:#000;background-color:rgba(0,0,0,.4)}"+
".panicbutton-modal-content{background-color:red;margin:auto;padding:20px;border:1px solid #888;width:80%}"+
"#panicbutton-modal-close{color:#aaa;float:right;font-size:28px;font-weight:700}.panicbutton-modal-close:focus,.panicbutton-modal-close:hover{color:#000;text-decoration:none;cursor:pointer}"+
".leaflet-top {z-index: 999;}"+
"</style>";

document.getElementsByTagName("nav")[0].outerHTML += panicbuttonModalTemplate;
document.getElementsByTagName("nav")[0].outerHTML += panicbuttonModalTemplateStyle;

var panicbuttonModal = document.getElementById("panicbutton-modal");
var panicButtonInformationSpan = document.getElementById("panicbutton-dispatch-information");
var panicButtonIDSpan = document.getElementById("panicbutton-dispatch-id");

function aktualisierePanicbuttonModal(dispatchID, dispatchContent) {
    panicButtonID = dispatchID;
    panicButtonIDSpan.innerText = panicButtonID;
    panicButtonInformationSpan.innerText = dispatchContent;
    console.log("Panicbuttonmodal aktualisiert. Dispatch-ID: "+panicButtonID+" | Inhalt: "+panicButtonInformationSpan.innerText);
}

function aktualisiereStreifen() {
    // via SELECT-OPTIONS
    var streifenImSelect = document.getElementsByTagName("option");

    for (let i = 0; i < streifenImSelect.length; i++) {
        let streifenID = streifenImSelect[i].value;

        if (!alleStreifenIDs.includes(streifenID)) {
            alleStreifenIDs.push(streifenID);
            console.log("Streife "+streifenID+" zu Streifenarray hinzugefügt");
        }
    }

    // via POS
    var streifenViaPosition = new XMLHttpRequest();
    streifenViaPosition.open("GET", "https://leitstelle.dirty-gaming.com/allPoses");

    streifenViaPosition.onload = function() {
        let streifenAusPos = JSON.parse(this.responseText);
        //console.log("Streifenjson:");
        //console.log(streifenAusPos);

        for (let streife in streifenAusPos) {
            if (!alleStreifenIDs.includes(streife)) {
                alleStreifenIDs.push(streife);
                console.log("Streife "+streife+" zu Streifenarray hinzugefügt (via POS)");
            }
        }
    };

    streifenViaPosition.send();
}

/* Streifen schon beim Seitenaufruf hinzufügen */
aktualisiereStreifen()

document.getElementById("panicbutton-dispatching").addEventListener("click", function() {
    dispatcheAlleStreifen(panicButtonID);
});

function dispatcheAlleStreifen(dispatchID) {
    
    for (let i = 0; i < alleStreifenIDs.length; i++) {
        let streifenID = alleStreifenIDs[i];

        var dispatching = new XMLHttpRequest();
        dispatching.open("POST", "https://leitstelle.dirty-gaming.com/dispatch/" + dispatchID +"/1/" + streifenID);
        
        dispatching.onload = function() {
            console.log("Streife " + streifenID + " zu DispatchID " + dispatchID + " disponiert.");
        };

        dispatching.send();
    }

    /* Kurzen Alert für Rückmeldung geben und nach bestätigung Seite reloaden */
    let gedispatchteSteifenAnzahl = alleStreifenIDs.length-1;
    alert("Es wurden " + gedispatchteSteifenAnzahl + " Streifen dem Dispatch zugewiesen.");
    setTimeout(function() {
        location.reload()
    }, 2500);
}

/* Allgemeine Funktionalität bzgl. Abfragen */

function checkDispatches() {
    var anfrage = new XMLHttpRequest();
    anfrage.open("GET", "https://leitstelle.dirty-gaming.com/allDispatches");

    anfrage.onload = function() {
        let dispatches = JSON.parse(this.responseText);
        let neueDispatches = 0;
        let neuePanicButtons = 0;

        for (let i = 0; i < dispatches.length; i++) {
            let eingangszeit = Date.parse(dispatches[i]["time"]);

            /* Prüft ob neuer Dispatch älter ist als die Aufrufzeit der Seite */
            if (eingangszeit > zeitBeiAufruf) {
                neueDispatches++;

                /* Prüft ob Dispatch ein Panicbutton ist und erhöht Wert + aktualisiert PBModal-Daten */
                if (dispatches[i]["dispatchName"] == "Panik-Button") {
                    neuePanicButtons++;
                    aktualisierePanicbuttonModal(dispatches[i]["id"], dispatches[i]["dispatchPassiert"]);
                }
            }
        }

        if (neueDispatches > 0) {

            /* Spiele Sound nur 1x ab. */
            if (soundAktiv == 0) {
                let sound = new Audio("https://www.lspd-dirty.de/userscript-assets/feuerwehrmelder.mp3");
                sound.volume = 0.5;
                sound.play();

                soundAktiv++;
            }

            let alert = document.getElementById("neue-dispatches-alert");
            alert.style.display = "block";
            aktualisierenButton.style.display = "none";

            /* Wenn es Panic Buttons gibt, wird das Modal aktiviert. */
            if (neuePanicButtons > 0) {
                panicbuttonModal.style.display = "block";
            }
        }
    };

    anfrage.send();
}

setInterval(checkDispatches, 5000);
setInterval(aktualisiereStreifen, 30000);

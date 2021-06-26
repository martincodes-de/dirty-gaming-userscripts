// ==UserScript==
// @name         Dirty-Gaming.com Leitstellensystemverbesserung: Hinweise bei neuen, einkommenden Dispatches
// @version      1.0.0
// @description  Fügt die Option hinzu, ein akustisches und visuelles Signal auszugeben, wenn neue Dispatches einkommen.
// @author       martincodes
// @match        https://leitstelle.dirty-gaming.com/dispatch
// @match        file:///C:/Users/Martin/Desktop/Dirty-Leitstellensystem/*
// @icon         https://i.imgur.com/q2zMMHS.png
// @updateURL    https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/leitstellensystem-einkommende-dispatches-sound.user.js
// @downloadURL  https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/leitstellensystem-einkommende-dispatches-sound.user.js
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

aktualisierenButton.outerHTML += neueDispatchesAlert;

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

                /* Prüft ob Dispatch Panic buttons sind und erhöht wenn Wert */
                if (dispatches[i]["dispatchName"] == "Panik-Button" && dispatches[i]["dispatchPassiert"].contains("[PANIKBUTTON]")) {
                    neuePanicButtons++;
                }
            }
        }

        if (neueDispatches > 0) {
            let sound = new Audio("https://www.lspd-dirty.de/userscript-assets/laeutewerk-normal.mp3");
            sound.play();

            let alert = document.getElementById("neue-dispatches-alert");
            alert.style.display = "block";
            aktualisierenButton.style.display = "none";

            if (neuePanicButtons > 0) {
                let sound1 = new Audio("https://www.lspd-dirty.de/userscript-assets/laeutewerk-g.mp3");
                sound1.play();

                let sound2 = new Audio("https://www.lspd-dirty.de/userscript-assets/laeutewerk-f.mp3");
                sound2.play();

                let alert = document.getElementById("neue-dispatches-alert");
                alert.classList.replace("alert-warning", "alert-danger");
                alert.innerHTML += " <b>AKTIVER PANICBUTTON!</b> ";
                alert.style.display = "block";
                aktualisierenButton.style.display = "none";
            }
        }
    };

    anfrage.send();
}

setInterval(checkDispatches, 5000);

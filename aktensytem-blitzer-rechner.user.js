// ==UserScript==
// @name         Dirty-Gaming.com Aktensystemverbesserung: Blitzerakten in Bußgeldern Zusammenfassen
// @version      1.0.0
// @description  Gibt übersicht über alle offenen Blitzerakten und Rechnet diese zusammen.
// @author       martincodes & gnamly
// @match        https://akte.dirty-gaming.com/buerger/*
// @icon         https://i.imgur.com/q2zMMHS.png
// @updateURL    https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/aktensytem-blitzer-rechner.user.js
// @downloadURL  https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/aktensytem-blitzer-rechner.user.js
// @grant        none
// @run-at       document-body
// ==/UserScript==

// var alertDiv = document.querySelector("div.state");
// alertDiv.innerHTML += "<b class='stateButton' id='waffenschein-alert'>Kein Waffenschein</b>";

var url_pfad = window.location.pathname;
var personalausweis_id = url_pfad.replace("/buerger/", "");

var bussgeldliste = document.querySelectorAll("ul.nav.nav-tabs")[1];
console.log(bussgeldliste);
var blitzerAlert = "<br/><br/><div class='alert alert-info'><div>ANZAHL offene(n) Blitzerakte(n) gefunden.</div><div>Gesamt Strafe: STRAFE$</div><div>Gesamt Geschwindigkeit: GESCHWkm/h</div></div>";


/*  Beispiel Ausgabe der Akten Abfrage
[
    {"id":108491,"tbCharacterId":14570,"tbPlayerId":-1,"tbGruppenId":1,"tbCharacterFahrzeugeId":-1,"aktetyp":"Polizei Bussgeld","titel":"TC §13 Abs. 1a,b,c,f Überschreitung der Geschwindigkeit (innerorts)","open":0,"angelegt":"2021-08-17T20:13:58.000Z","autor":-1,"deleted":0,"name":"Jayden Evens ","authorname":"System"},
    {"id":108130,"tbCharacterId":14570,"tbPlayerId":-1,"tbGruppenId":1,"tbCharacterFahrzeugeId":-1,"aktetyp":"Polizei Bussgeld","titel":"TC §13 Abs. 1a,b,c,f Überschreitung der Geschwindigkeit (innerorts)","open":0,"angelegt":"2021-08-15T21:42:04.000Z","autor":-1,"deleted":0,"name":"Jayden Evens ","authorname":"System"},
    {"id":108108,"tbCharacterId":14570,"tbPlayerId":-1,"tbGruppenId":1,"tbCharacterFahrzeugeId":-1,"aktetyp":"Polizei Bussgeld","titel":"TC §13 Abs. 1a,b,c,f Überschreitung der Geschwindigkeit (innerorts)","open":0,"angelegt":"2021-08-15T20:29:08.000Z","autor":-1,"deleted":0,"name":"Jayden Evens ","authorname":"System"},
]
*/

var allBlitzer = [];
var summeGeld = 0;
var summeGeschwindigkeit = 0;
var fehler = false;



//Abfrage aller Bußgeldakten
var aktenAbfrage = new XMLHttpRequest();
aktenAbfrage.open("GET", "https://akte.dirty-gaming.com/fallakten/buerger/Polizei%20Bussgeld/all/"+personalausweis_id, false);
aktenAbfrage.onload = function() {
    if(this.status === 200){
        console.log("Akten Abfrage erfolgreich");
        allBlitzer = [];
        summeGeld = 0;
        summeGeschwindigkeit = 0;
        //Alle Akten durchsuchen nach offenen Bußgeldakten
        let akten = JSON.parse(this.responseText);
        let regBlitzer = /^TC §13 Abs\. .* Überschreitung.*/i;
        for(const akte of akten) {
            if(akte.open === 1 && akte.authorname === "System" && akte.titel.match(regBlitzer)){
                //Wenn es eine offene Blitzerakte ist, dann berechnen wir Geld und Geschwindigkeit
                allBlitzer.push(akte);
                berechnungHinzufuegen(akte.id);
            }
        }
        console.log("gefundene Blitzer: "+allBlitzer.length);
        blitzerAlert = blitzerAlert.replace("ANZAHL", allBlitzer.length);
        blitzerAlert = blitzerAlert.replace("STRAFE", summeGeld);
        blitzerAlert = blitzerAlert.replace("GESCHW", summeGeschwindigkeit);
        bussgeldliste.outerHTML += blitzerAlert;
    }
    else fehler = true;

};
aktenAbfrage.send();

function berechnungHinzufuegen(id) {
    /* Beispiel Ausgabe einer einzelnen Akten abfrage
{
    "canEdit":true,
    "strafe":"270",
    "strafe_author":"22.8.2021 / ",
    "einsatzort":"East Vinewood, Mirror Park Blvd, York St",
    "einsatzort_author":"22.8.2021 / ",
    "bussgeld":"18x TC §13 Abs. 1a,b,c,f Überschreitung der Geschwindigkeit (innerorts)\r\n\r\nHaftzeit: 0, Geldstrafe: $ 270,00",
    "bussgeld_author":"22.8.2021 / ",
    "datum":"Sonntag, 22. August 2021",
    "datum_author":"22.8.2021 / ",
    "uhrzeit":"00:45",
    "uhrzeit_author":"22.8.2021 / ",
    "kommentar":"Amtlich-anerkannte Geschwindigkeitsmesseinrichtung",
    "kommentar_author":"22.8.2021 / ",
    "geschehen":"Person wurde vom Blitzer in East Vinewood, Mirror Park Blvd, York St im Fahrzeug Elegy Retro Custom ( Kennzeichen \"LS HR RC\" ) mit einer Geschwindigkeit von 118 km/h bei erlaubten 80 km/h gemessen. Abzüglich der gesetzlichen Toleranz von 20 km/h ist dies eine Geschwindigkeitsüberschreitung von 18 km/h und daraus resultierend ein Bußgeld von $ 270.",
    "geschehen_author":"22.8.2021 / "}
*/
    var blitzerAbfrage = new XMLHttpRequest();
    blitzerAbfrage.open("GET", "https://akte.dirty-gaming.com/fallakten/buerger/Polizei%20Bussgeld/"+id, false);
    blitzerAbfrage.onload = function() {
        console.log("Blitzer "+id+" status "+this.status);
        if(this.status === 200) {
            let blitzer = JSON.parse(this.responseText);
            summeGeld += parseInt(blitzer.strafe);
            let text = blitzer.geschehen;
            let suchText1 = "dies eine Geschwindigkeitsüberschreitung von ";
            let indexSuchText1 = text.indexOf(suchText1);
            let indexEnde = text.indexOf("km/h", indexSuchText1);
            let geschwindigkeit = parseInt(text.substring(indexSuchText1+suchText1.length, indexEnde));
            summeGeschwindigkeit += geschwindigkeit;
        }
        else fehler = true;
    };
    blitzerAbfrage.send();
}
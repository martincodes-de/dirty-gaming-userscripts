// ==UserScript==
// @name         Dirty-Gaming.com Aktensystemverbesserung: Blitzerakten in Bußgeldern Zusammenfassen
// @version      1.3.0
// @description  Gibt übersicht über alle offenen Blitzerakten und Rechnet diese zusammen.
// @author       martincodes & gnamly
// @match        https://akte.dirty-gaming.com/buerger/*
// @icon         https://i.imgur.com/q2zMMHS.png
// @updateURL    https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/aktensytem-blitzer-rechner.user.js
// @downloadURL  https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/aktensytem-blitzer-rechner.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

// var alertDiv = document.querySelector("div.state");
// alertDiv.innerHTML += "<b class='stateButton' id='waffenschein-alert'>Kein Waffenschein</b>";

// window.addEventListener('DOMContentLoaded', start);

var url_pfad = "";
var personalausweis_id ="";

var allSystem = [];
var blitzer = {
    count: 0,
    summeGeld: 0,
    summeGeschwindigkeitInner: 0,
    summeGeschwindigkeitAuser: 0,
    akten: []
};
var eingriff = {
    count: 0,
    summeGeld: 0,
    summeGeschwindigkeitInner: 0,
    summeGeschwindigkeitAuser: 0,
    akten: []
};
var steuer = {
    count: 0,
    summeGeld: 0,
    summeGeschwindigkeit: 0,
    akten: []
};
var kraftstoff = {
    count: 0,
    summeGeld: 0,
    summeKraftstoff: 0,
    akten: []
}
var fehler = false;
var berechnungsQueue = 0;
start();
function start() {
    url_pfad = window.location.pathname;
    personalausweis_id = url_pfad.replace("/buerger/", "");

    //Abfrage aller Bußgeldakten
    var busgeldAktenAbfrage = new XMLHttpRequest();
    busgeldAktenAbfrage.open("GET", "https://akte.dirty-gaming.com/fallakten/buerger/Polizei%20Bussgeld/all/"+personalausweis_id, false);
    busgeldAktenAbfrage.onload = function() {
        if(this.status === 200){
            console.log("Bußgeld Akten Abfrage erfolgreich");
            //Alle Akten durchsuchen nach offenen Bußgeldakten
            let akten = JSON.parse(this.responseText);

            for(const akte of akten) {
                if(akte.open === 1 && akte.authorname === "System"){
                    allSystem.push(akte);
                }
            }
        }
        else fehler = true;
    };
    busgeldAktenAbfrage.send();

    var strafAktenAbfrage = new XMLHttpRequest();
    strafAktenAbfrage.open("GET", "https://akte.dirty-gaming.com/fallakten/buerger/Polizei%20Strafsache/all/"+personalausweis_id, false);
    strafAktenAbfrage.onload = function() {
        if(this.status === 200){
            console.log("Straf Akten Abfrage erfolgreich");
            //Alle Akten durchsuchen nach offenen Bußgeldakten
            let akten = JSON.parse(this.responseText);

            for(const akte of akten) {
                if(akte.open === 1 && akte.authorname === "System"){
                    allSystem.push(akte);
                }
            }
        }
        else fehler = true;
    };
    strafAktenAbfrage.send();

    berechnungsQueue = allSystem.length;
    if(berechnungsQueue === 0) htmlDarstellen();
    console.log("Es werden nun "+berechnungsQueue+" akten abgefragt");

    var xhr = [], i;
    for(i = 0;i < allSystem.length;i++) {
        let systemAkte = allSystem[i];
        let url = "";
        if(systemAkte.aktetyp === "Polizei Bussgeld") url = "https://akte.dirty-gaming.com/fallakten/buerger/Polizei%20Bussgeld/"+systemAkte.id;
        else url = "https://akte.dirty-gaming.com/fallakten/buerger/Polizei%20Strafsache/"+systemAkte.id;
        
        // console.log('Akten Abfrage für url: '+url);
        xhr[i] = new XMLHttpRequest();
        xhr[i].open("GET", url, true);
        xhr[i].onloadend = akteAbfrageFertig;
        xhr[i].send();
    }
    if(fehler) console.log('fehler im Blitzerrechner');
}

function akteAbfrageFertig() {
    // console.log("Akte "+this.responseURL+" status "+this.status);
    if(this.status === 200) {
        let akte = JSON.parse(this.responseText);
        berechnungHinzufuegen(akte, akte.schwersteStraftat !== undefined);
    }
}

function berechnungHinzufuegen(akte, straf) {
    if(straf){ //Stafakten nach Gefährlichem Eingriff oder Steuerhinterziehung durchsuchen
        let regSteuer = /^StG.*Steuerhinterziehung/;
        let regGef = /^StG.*Gefährlicher Eingriff in den Straßenverkehr/;
        let regKraft = /^Kraftstoffdiebstahl/;
        if(akte.schwersteStraftat.match(regSteuer)) {
            steuer.count++;
            let money = akte.bussgeld.substring(akte.bussgeld.indexOf("$")+2).replace(".",'');
            steuer.summeGeld += parseFloat(money);
            akte.auto = akte.geschehen.substring(akte.geschehen.indexOf("für ")+"für ".length, akte.geschehen.indexOf("\" ")+1);
            akte.geld = parseFloat(money);
            steuer.akten.push(akte);
        } 
        else if(akte.schwersteStraftat.match(regGef)) {
            eingriff.count++;
            let money = akte.bussgeld.substring(akte.bussgeld.indexOf("$")+2).replace(".",'');
            eingriff.summeGeld += parseInt(money);
            let geschw = parseInt(akte.bussgeld.substring(0, akte.bussgeld.indexOf('x')));
            if(akte.bussgeld.includes("innerorts")) eingriff.summeGeschwindigkeitInner += geschw;
            else eingriff.summeGeschwindigkeitAuser += geschw;
            akte.geschw = geschw;
            akte.auto = akte.geschehen.substring(akte.geschehen.indexOf("im Fahrzeug ")+"im Fahrzeug".length, akte.geschehen.indexOf(") ")+1);
            akte.geld = parseInt(money);
            eingriff.akten.push(akte);
        }
        else if(akte.schwersteStraftat.match(regKraft)) {
            kraftstoff.count++;
            const geld = parseInt(akte.bussgeld);
            kraftstoff.summeGeld += geld;
            const stoff = parseFloat(akte.geschehen.substring(akte.geschehen.indexOf('Liter: ')+'Liter: '.length));
            kraftstoff.summeKraftstoff += stoff;
            akte.geld = geld;
            akte.stoff = stoff;
            akte.kennzeichen = akte.geschehen.substring(akte.geschehen.indexOf('Kennzeichen ')+'Kennzeichen '.length, akte.geschehen.indexOf(' Liter')-1);
            kraftstoff.akten.push(akte);
        }
    }
    else { //Bußgeldakten nach Blitzer durchsuchen
        let regBlitzer = /TC §13 Abs\. .* Überschreitung.*/i;
        if(akte.bussgeld.match(regBlitzer)) {
            blitzer.count++;
            blitzer.summeGeld += parseInt(akte.strafe);
            let text = akte.geschehen;
            let suchText1 = "dies eine Geschwindigkeitsüberschreitung von ";
            let indexSuchText1 = text.indexOf(suchText1);
            let indexEnde = text.indexOf("km/h", indexSuchText1);
            let geschwindigkeit = parseInt(text.substring(indexSuchText1+suchText1.length, indexEnde));
            if(akte.bussgeld.includes("innerorts")) blitzer.summeGeschwindigkeitInner += geschwindigkeit;
            else blitzer.summeGeschwindigkeitAuser += geschwindigkeit;
            akte.geschw = geschwindigkeit;
            akte.auto = text.substring(text.indexOf("im Fahrzeug ")+"im Fahrzeug".length, text.indexOf(") ")+1);
            blitzer.akten.push(akte);
        }
    }
    berechnungsQueue--;
    if(berechnungsQueue === 0) htmlDarstellen();
}



function htmlDarstellen() {
    var bussgeldliste = document.querySelectorAll("ul.nav.nav-tabs")[1];
    let blitzerAlert = "<div class='alert alert-info'>"+
    "<div>ANZAHL offene Blitzerakten gefunden.</div>"+
    "<div>Gesamt Strafe: STRAFE$</div>"+
    "<div>Gesamt Geschwindigkeiten Innerorts: GESCHWIkm/h</div>" +
    "<div>Gesamt Geschwindigkeiten Außerorts: GESCHWAkm/h</div>"+
    "<details><summary>Auflistung</summary>LISTE</details>"+
    "</div>";
    let blitzerListeTeil = "<div>ORT (WAS) mit GESCHWkm/h in einem \"AUTO\" Strafe: STRAFE$";
    let eingriffAlert = "<div class='alert alert-info'>"+
    "<div>ANZAHL offene Gefährliche Eingriffe gefunden.</div>"+
    "<div>Gesamt Strafe: STRAFE$</div>"+
    "<div>Gesamt Geschwindigkeiten Innerorts: GESCHWIkm/h</div>" +
    "<div>Gesamt Geschwindigkeiten Außerorts: GESCHWAkm/h</div>"+
    "<details><summary>Auflistung</summary>LISTE</details>"+
    "</div>";
    let eingriffListeTeil = "<div>ORT (WAS) mit GESCHWkm/h in einem \"AUTO\" Strafe: STRAFE$";
    let steuerAlert = "<div class='alert alert-info'>"+
    "<div>ANZAHL offene Steuerhinterziehungen durch System gefunden.</div>"+
    "<div>Gesamt Strafe: STRAFE$</div>"+
    "<details><summary>Auflistung</summary>LISTE</details>"+
    "</div>";
    let steuerListeTeil = "<div>Fahrzeug: \"AUTO\" Nicht einziehbarer Betrag: STRAFE$";
    let kraftstoffAlert = "<div class='alert alert-info'>"+
    "<div>ANZAHL offene Kraftstoffdiebstähle durch System gefunden.</div>"+
    "<div>Gesamter Betrag: BETRAG$</div>"+
    "<div>Gesamter Kraftstoff: STOFF</div>"+
    "<details><summary>Auflistung</summary>LISTE</details>"+
    "</div>";
    let kraftstoffListeTeil = "<div>Kennzeichen: \"KENNZEICHEN\" Kraftstoffmenge: STOFF Betrag: GELD$";

    let fehlerAlert = "<div class='alert alert-danger'>FEHLER BEI DER AKTEN ABFRAGE</div>";
    let nichtsAlert = "<div class='alert alert-success'>Keine offenen System Akten gefunden</div>";

    blitzerAlert = blitzerAlert.replace("ANZAHL", blitzer.count);
    blitzerAlert = blitzerAlert.replace("STRAFE", blitzer.summeGeld);
    blitzerAlert = blitzerAlert.replace("GESCHWI", blitzer.summeGeschwindigkeitInner);
    blitzerAlert = blitzerAlert.replace("GESCHWA", blitzer.summeGeschwindigkeitAuser);
    var blitzerListe = "";
    for(const akte of blitzer.akten) {
        let text = blitzerListeTeil;
        text = text.replace("ORT", akte.einsatzort).replace("WAS", akte.bussgeld.includes("innerorts") ? "innerorts" : "außerorts");
        text = text.replace("GESCHW", akte.geschw).replace("AUTO", akte.auto).replace("STRAFE", akte.strafe);
        blitzerListe += text;
    }
    blitzerAlert = blitzerAlert.replace("LISTE", blitzerListe);

    eingriffAlert = eingriffAlert.replace("ANZAHL", eingriff.count);
    eingriffAlert = eingriffAlert.replace("STRAFE", eingriff.summeGeld);
    eingriffAlert = eingriffAlert.replace("GESCHWI", eingriff.summeGeschwindigkeitInner);
    eingriffAlert = eingriffAlert.replace("GESCHWA", eingriff.summeGeschwindigkeitAuser);
    var eingriffListe = "";
    for(const akte of eingriff.akten) {
        let text = eingriffListeTeil;
        text = text.replace("ORT", akte.einsatzort).replace("WAS", akte.bussgeld.includes("innerorts") ? "innerorts" : "außerorts");
        text = text.replace("GESCHW", akte.geschw).replace("AUTO", akte.auto).replace("STRAFE", akte.geld);
        eingriffListe += text;
    }
    eingriffAlert = eingriffAlert.replace("LISTE", eingriffListe);

    steuerAlert = steuerAlert.replace("ANZAHL", steuer.count);
    steuerAlert = steuerAlert.replace("STRAFE", steuer.summeGeld);
    var steuerListe = "";
    for(const akte of steuer.akten) {
        let text = steuerListeTeil;
        text = text.replace("AUTO", akte.auto).replace("STRAFE", akte.geld);
        steuerListe += text;
    }
    steuerAlert = steuerAlert.replace("LISTE", steuerListe);

    kraftstoffAlert = kraftstoffAlert.replace("ANZAHL", kraftstoff.count);
    kraftstoffAlert = kraftstoffAlert.replace("BETRAG", kraftstoff.summeGeld);
    kraftstoffAlert = kraftstoffAlert.replace("STOFF", kraftstoff.summeKraftstoff);
    var kraftstoffListe = "";
    for(const akte of kraftstoff.akten) {
        let text = kraftstoffListeTeil;
        text = text.replace("KENNZEICHEN", akte.kennzeichen).replace("STOFF", akte.stoff).replace("GELD", akte.geld);
        kraftstoffListe += text;
    }
    kraftstoffAlert = kraftstoffAlert.replace("LISTE", kraftstoffListe);


    console.log(blitzer.count + " gefundene Blitzer");
    console.log(eingriff.count + " gefundene Gefährliche Eingriffe");

    var finaleErweiterung = "<br/><br/>";
    if(blitzer.count === 0 && eingriff.count === 0 && steuer.count === 0 && kraftstoff.count === 0){
        finaleErweiterung += nichtsAlert;
    }
    if(blitzer.count > 0) {
        finaleErweiterung += blitzerAlert;
    }
    if(eingriff.count > 0) {
        finaleErweiterung += eingriffAlert;
    }
    if(steuer.count > 0) {
        finaleErweiterung += steuerAlert;
    }
    if(kraftstoff.count > 0) {
        finaleErweiterung += kraftstoffAlert;
    }

    if(fehler) {
        finaleErweiterung = fehlerAlert;
    }

    bussgeldliste.outerHTML += finaleErweiterung;
}
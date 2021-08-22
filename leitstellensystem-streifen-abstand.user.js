// ==UserScript==
// @name         Dirty-Gaming.com Leitstellenverbesserung: Streifen Abstand
// @version      1.0.0
// @description  Gibt je Distpacht die maximal 5 nähesten Streifen.
// @author       martincodes & gnamly
// @match        https://leitstelle.dirty-gaming.com/dispatch
// @icon         https://i.imgur.com/q2zMMHS.png
// @updateURL    https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/leitstellensystem-streifen-abstand.user.js
// @downloadURL  https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/leitstellensystem-streifen-abstand.user.js
// @grant        none
// @run-at       document-body
// ==/UserScript==

// var alertDiv = document.querySelector("div.state");
// alertDiv.innerHTML += "<b class='stateButton' id='waffenschein-alert'>Kein Waffenschein</b>";

var url_pfad = window.location.pathname;

var streifenBox = "<div class='alert alert-info'><div>Streifenabstand zum Dispatch.</div>STREIFENDIST</div>";
var streifendist = "<div>STREIFE (CODE): DIST</div>";

var alleDispatches = [];
var alleStreifen = [];
var fehler = false;

//Abfrage aller Bußgeldakten
var dispatchAbfrage = new XMLHttpRequest();
dispatchAbfrage.open("GET", "https://leitstelle.dirty-gaming.com/allDispatches", false);
dispatchAbfrage.onload = function () {
    if (this.status === 200) {
        const dispatches = JSON.parse(this.responseText);
        for (const dispatch of dispatches) {
            alleDispatches.push({
                id: dispatch.id,
                pos: dispatch.pos
            });
        }
        alleStreifenAbfragen();
    }
    else fehler = true;

};
dispatchAbfrage.send();

function alleStreifenAbfragen() {
    var streifenAbfrage = new XMLHttpRequest();
    streifenAbfrage.open("GET", "https://leitstelle.dirty-gaming.com/allPoses", false);
    streifenAbfrage.onload = function () {
        if (this.status === 200) {
            const streifen = JSON.parse(this.responseText);
            for (const streife of Object.values(streifen)) {
                if (streife.code != 'Code 10')
                    alleStreifen.push({
                        id: streife.id,
                        pos: streife.pos,
                        name: streife.streifennamen,
                        code: streife.code,
                    });
            }
            abstaendeBerechnen();
            infoHinzufügen();
            console.log(alleDispatches);
        }
        else fehler = true;

    };
    streifenAbfrage.send();
}

function abstaendeBerechnen() {
    for (let dispatch of alleDispatches) {
        let streifen = [];
        for (let streife of alleStreifen) {
            let distpatchPos = JSON.parse(dispatch.pos);
            let pos = JSON.parse(streife.pos);
            let dist = Vec3Magnitude(subVecto3(distpatchPos, pos));
            streifen.push({
                id: streife.id,
                pos: streife.pos,
                name: streife.name,
                code: streife.code,
                dist: dist
            });
        }
        dispatch.streifen = streifen;
        dispatch.streifen.sort((a,b) => a.dist < b.dist ? -1 : (a.dist > b.dist ? 1 : 0));
    }
}

function subVecto3(a, b) {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
        z: a.z - b.z
    }
}

function Vec3Magnitude(a) {
    return Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2) + Math.pow(a.z, 2));
}

function infoHinzufügen() {
    for(const dispatch of alleDispatches) {
        var dispatchBox = document.querySelector("[data-dispatch='"+dispatch.id+"']");
        let box = streifenBox;
        let texts = "";
        for(var i = 0; i < dispatch.streifen.length;i++) {
            let text = streifendist;
            text = text.replace("DIST", (dispatch.streifen[i].dist/1000).toFixed(2)+"km");
            text = text.replace("STREIFE", dispatch.streifen[i].name);
            text = text.replace("CODE", dispatch.streifen[i].code);
            texts += text;
            if(i >= 4) break;
        }
        box = box.replace("STREIFENDIST", texts);
        dispatchBox.innerHTML += box;
    }
}
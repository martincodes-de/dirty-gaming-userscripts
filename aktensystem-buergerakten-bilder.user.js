// ==UserScript==
// @name         Dirty-Gaming.com Aktensystemverbesserung: Bürgeraktenbilder
// @version      1.0.1
// @description  Fügt eine Verknüpfung mit dem LSPDPSYS hinzu.
// @author       martincodes
// @match        https://akte.dirty-gaming.com/buerger/*
// @match        file:///C:/Users/Martin/Desktop/Dirty-Aktensystem/*
// @icon         https://i.imgur.com/q2zMMHS.png
// @updateURL
// @downloadURL
// @grant        none
// @run-at       document-end
// ==/UserScript==

var url_pfad = window.location.pathname;
var personalausweis_id = url_pfad.replace("/buerger/", "");

var buerger = [
    {personalausweis_id: "4615", img: "https://picr.eu/images/2021/04/07/QzzBV.png"},
    {personalausweis_id: "857", img: "https://picr.eu/images/2021/05/16/QSl8u.png"},
    {personalausweis_id: "1673", img: "https://picr.eu/images/2021/05/16/QUiSp.png"},
    {personalausweis_id: "7100", img: "https://picr.eu/images/2021/03/30/QIFi9.png"},
];

var icon = "";
var hinweis = "Foto der Person<br>Demosystem - LSPDPSYS";
var bildurl = "https://www.senertec.de/wp-content/uploads/2020/04/blank-profile-picture-973460_1280.png";

for (let i = 0; i < buerger.length; i++) {
    if (buerger[i]["personalausweis_id"] == personalausweis_id) {
        bildurl = buerger[i]["img"];
    }
}

var letzteTableRow = document.querySelectorAll("div#buergerakteUebersicht table tr")[4];

var neueTableRow = "<tr><td>"+ icon +"</td><td>"+ hinweis +"</td><td><img src='"+ bildurl +"' class='img-fluid' alt='bild vom lspdpfsys'></td><tr>";

/* Zeile hinzufügen */

letzteTableRow.outerHTML += neueTableRow;

// document.querySelectorAll("div#buergerakteUebersicht table tr")[4].outerHTML += "<tr><td>t</td><td>LSPDPFSYS</td><td><img></td><tr>"
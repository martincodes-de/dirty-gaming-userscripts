// ==UserScript==
// @name         Dirty-Gaming.com Aktensystemverbesserung: Gangaktensystemsuche in Bürgerakte
// @version      1.0.0
// @description  Fügt Suchbutten für das Gangaktensystem in das Aktensystem bei Bürgerakten ein.
// @author       martincodes
// @match        https://akte.dirty-gaming.com/buerger/*
// @match        file:///C:/Users/Martin/Desktop/Dirty-Aktensystem/*
// @icon         https://i.imgur.com/q2zMMHS.png
// @updateURL    https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/aktensystem-gsys-buergerakte-abfrage.user.js
// @downloadURL  https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/aktensystem-gsys-buergerakte-abfrage.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

var url_pfad = window.location.pathname;
var personalausweis_id = url_pfad.replace("/buerger/", "");

var gsysBaseUrl = "https://gangakten.lspd-dirty.de";
var gsysUserscriptSucheUrl = gsysBaseUrl+"/backend/search/by/userscript/" + personalausweis_id;

var naviLeisteBuergerAkte = document.querySelector("ul.nav.nav-tabs.md-tabs.dirty-gradient");

var gsysBtn = "<li class='nav-item waves-effect waves-light'><a class='nav-link bg-primary' href="+gsysUserscriptSucheUrl+" target='_blank' role='tab'>Gangaktensystemsuche</a></li>";

naviLeisteBuergerAkte.innerHTML += gsysBtn;
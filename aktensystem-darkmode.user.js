// ==UserScript==
// @name         Dirty-Gaming.com Aktensystemverbesserung: Darkmode
// @version      1.0.1
// @description  Nutzt einen Darkmode im Aktensystem
// @author       martincodes
// @match        https://akte.dirty-gaming.com/*
// @match        file:///C:/Users/Martin/Desktop/Dirty-Aktensystem/*
// @icon         https://i.imgur.com/q2zMMHS.png
// @updateURL    https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/aktensystem-darkmode.user.js
// @downloadURL  https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/aktensystem-darkmode.user.js
// @grant        none
// ==/UserScript==

var headTag = document.getElementsByTagName("head")[0];
var neuesStyleTag = "<link rel='stylesheet' href='https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/aktensystem-darkmode.css'/>";
headTag.innerHTML += neuesStyleTag;
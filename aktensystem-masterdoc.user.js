// ==UserScript==
// @name         Dirty-Gaming.com Aktensystemverbesserung: Linksammlung
// @version      1.0.0
// @description  Ergänzt die Aktensystem um ein paar Links.
// @author       gnamly
// @match        https://akte.dirty-gaming.com/*
// @icon         https://i.imgur.com/q2zMMHS.png
// @updateURL    https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/aktensystem-masterdoc.user.js
// @downloadURL  https://raw.githubusercontent.com/martincodes-de/dirty-gaming-userscripts/main/aktensystem-masterdoc.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

function start() {
  html();
}

function html() {
  const navList = document.getElementById('navContainer').children[0];
  const border = `<li style="border-bottom: 2px solid rgba(153,153,153,.3);"><h6 id="navName" class="text-center mx-0 my-2"></h6></li>`
  navList.innerHTML += border;
  navList.innerHTML += getNavItem('https://docs.google.com/spreadsheets/d/1OjeNXUC13ciAv3YPX6NiGCHVLyjLrZx4Q1WkkejkmUc/edit#gid=424553797', 'Bußgeldrechner 2.0', 'fas fa-calculator');
  navList.innerHTML += getNavItem('http://lspdbsys.lspd-dirty.de/', 'Bußgeldrechner 3.0 | Bsys', 'fas fa-calculator');
  navList.innerHTML += getNavItem('https://docs.google.com/spreadsheets/d/11K2fFxPFQXXOrJ1EwF_FoUfOVnGT31dmCNCF6JtcuJM/edit#gid=1985602745', 'Copy Liste', 'fas fa-book');
  navList.innerHTML += getNavItem('https://docs.google.com/spreadsheets/d/1M8qI5G1p1CY0NdDB0LgZqL7581TTdUla1ofg7jecNzs/edit#gid=1725277514', 'Fahrzeugbeschlagnahmungsliste', 'fas fa-car')
}

function getNavItem(link, title, icon) {
  const iconHtml = `<i class="${icon}"></i>`;
  const linkHtml = `<a class="waves-effect mainNav" target="_blank" valnav="none" href="${link}">${iconHtml}<span>${title}</span></a>`;
  return `<li>${linkHtml}</li>`
}

start();
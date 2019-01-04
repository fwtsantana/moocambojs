'use strict';

var server = document.createElement("script");
server.type = "application/javascript";
server.src = "../client/server.js";
document.head.appendChild(server);

var util = document.createElement("script");
util.type = "application/javascript";
util.src = "../client/util.js";
document.head.appendChild(util);
'use strict';

/*
	Moocambo Socket Server Listener
*/
var server = require("./core/websocket_connection"),
    config = require("./core/config"),
    moduleViewObjectName = "view";
    
server.listen(config.port, config.host, function (wsConnection) {
    
    var app = wsConnection.application;
    
	console.info("*** CONNECTED ON " + config.host + "(" + config.port + ") --- SessionID #" + app.sessionID + " ***");
    
    wsConnection.loadModule = function(moduleName) {
        return loadModule(moduleName, wsConnection.api);
    }
    
	wsConnection.on("data", function (opcode, data) {
        var incomingData = JSON.parse(data), type = incomingData.req.type;
        
        if (!app.name) {
            loadApplication(wsConnection, incomingData);
        }
        
        //Processing request
        if (type === "html") {
            wsConnection.api.server.page.load(incomingData.req.file, incomingData.res.uiRef);
        } else if (type === "js") {
            wsConnection.api.server.javascript.execute(incomingData.req.file, incomingData.req.jsFunction);
        }
	});
	
	wsConnection.on("close", function (code, reason) {
        wsConnection.api.server.dataConnections.mongoDB.close();
        
        if (code && reason) {
            wsConnection.api.server.logging.log("Session #" + app.sessionID + " closed: " + code + " - " + reason);
        } else {
            wsConnection.api.server.logging.log("Session #" + app.sessionID + " closed!");
        }
	});
    
});

var loadApplication = function(wsConnection, incomingData) {
    var appName = incomingData.req.app;

    wsConnection.api.server.logging.log("Loading App " + appName + "...");

    var appModules = loadModule("./apps/" + appName + "/" + appName, wsConnection.api);
    
    wsConnection.application.name = appName;
    wsConnection.application.modules = appModules;
}

function loadModule(moduleName, api) {
    uncache(moduleName);
    
    var module = null;
    if (api) {
        api.server.logging.log("Loading module " + moduleName);
        module = require(moduleName)(api);
    } else {
        module = require(moduleName);
    }
    
    module.path = moduleName;
    
    return module;
}

function uncache(moduleName) {
    // Run over the cache looking for the files loaded by the specified module name
    searchCache(moduleName, function (mod) {
        delete require.cache[mod.id];
    });
}

/**
 * Runs over the cache to search for all the cached files.
 */
function searchCache(moduleName, callback) {
    // Resolve the module identified by the specified name
    var mod = require.resolve(moduleName);
 
    // Check if the module has been resolved and found within the cache
    if (mod && ((mod = require.cache[mod]) !== undefined)) {
        // Recursively go over the results
        (function run(mod) {
            // Go over each of the module's children and run over it
            mod.children.forEach(function (child) {
                run(child);
            });
 
            // Call the specified callback providing the found module
            callback(mod);
        }(mod));
    }
}
/*
	Moocambo Socket Server Listener
*/
var initFunction = "init",
    moocambo_socket_server = require("./moocambo_socket_server"),
    host = "localhost"; //Change to the real IP in production environment

moocambo_socket_server.listen(9999, host, function(ctx) {
    var app;
    
	console.log("#####################################################\nCONNECTED ON " + host);
    
    ctx.loadPage = function(ctx, path, uiOper, uiRef, initArgs) {
        'use strict';
        console.log("loadPage function");
        
        try {
            var fs = require("fs"), jsFunction = initFunction + "(" + initArgs + ")";
            
            var uiFragment = fs.readFileSync(app.appName + "/" + path + ".html", 'utf-8');
            
            this.loadFragment(uiFragment, uiOper, uiRef);
            
            loadJS(app, ctx, path, jsFunction);
            
        } catch(err) {
            console.log("[LOAD_PAGE_ERROR] = " + err);
        }
    };
    
    ctx.loadFragment = function(uiFragment, uiOper, uiRef) {
        'use strict';        
        var ret  ='{"uiOper":"' + uiOper + '", "uiRef":"' +  uiRef +'","uiFragment":"' + encodeURI(uiFragment) + '"}';
        
        this.send(ret);
    };
    
	ctx.on("data", function(opcode, dados) {
        console.log("Receiving data...");
        
        var incomingData = JSON.parse(dados);
        
        if (!app) app = loadApp(ctx, incomingData);
                
        processRequest(app, ctx, incomingData);
	});
	
	ctx.on("close", function(code, reason) {
        console.log("Connection closed: ", code, reason);
	});
});

function processRequest(app, ctx, incomingData) {
    var type = incomingData.req.type;
    if (type == "html"){
        ctx.loadPage(ctx
                        , incomingData.req.file
                        , incomingData.res.uiOper
                        , incomingData.res.uiRef
                        , incomingData.req.initArgs);
        
    } else if (type == "js"){
        loadJS(app
                           , ctx
                           , incomingData.req.file
                           , incomingData.req.jsFunction);
    }
}

function loadApp(ctx, incomingData) {
    var appName = incomingData.req.app;
    
    console.log("Loading App " + appName + "...");
    
    var aplic = reloadModule("./" + appName + "/" + appName, ctx);
    
    aplic.appName = appName;
    
    return aplic;
}

function loadJS(app, ctx, jsModule, jsFunction) {
    try {
        var caminhoModuloJS = "./" + app.appName + "/" + jsModule + ".js";
        
        var js = reloadModule(caminhoModuloJS, ctx, app);
        
        console.log(jsModule + " loaded");

        console.log("Calling " + 'js.' + jsFunction);
        
        eval('js.' + jsFunction);

    } catch(err) {
        console.log("ERROR = " + err);
    }
}

function reloadModule(nomeModulo, ctx, app) {
    'use strict';
    console.log("reloadModule function");
    
    uncache(nomeModulo);
    
    if (app) {
        return require(nomeModulo)(app, ctx);
    } else {
        return require(nomeModulo)(ctx);
    }
}

function uncache(moduleName) {
    // Run over the cache looking for the files
    // loaded by the specified module name
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
 
    // Check if the module has been resolved and found within
    // the cache
    if (mod && ((mod = require.cache[mod]) !== undefined)) {
        // Recursively go over the results
        (function run(mod) {
            // Go over each of the module's children and
            // run over it
            mod.children.forEach(function (child) {
                run(child);
            });
 
            // Call the specified callback providing the found module
            callback(mod);
        })(mod);
    }
};

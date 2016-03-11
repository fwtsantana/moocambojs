/*
	Moocambo Socket Server Listener
*/
var initFunction = "init",
    moocambo_socket_server = require("./moocambo_socket_server"),
    host = "localhost";

moocambo_socket_server.listen(9999, host, function(ctx) {
    'use strict';
    
    var app, lastFragment, mongodb;
    
	console.log("#####################################################\nCONNECTED ON " + host);
    
    ctx.setMongoDB = function(newDB) {
        this.mongodb = newDB;
    };
    
    ctx.db = function() {
        return this.mongodb;
    }
    
    ctx.loadPage = function(path, uiOper, uiRef, initArgs) {
        'use strict';
        
        try {
            this.lastFragment = path;
            
            if (!initArgs) initArgs="";
            
            var fs = require("fs"), jsFunction = initFunction + "(" + initArgs + ")";
            
            var uiFragment = fs.readFileSync(app.appName + "/" + this.lastFragment + ".html", 'utf-8');
            
            this.loadFragment(uiFragment, uiOper, uiRef);
            
            this.executeJS(app, this.lastFragment, jsFunction);
            
        } catch(err) {
            console.log("[LOAD_PAGE_ERROR] = " + err);
            this.lastFragment = "";
        }
    };
    
    ctx.loadFragment = function(uiFragment, uiOper, uiRef) {
        'use strict';
        console.log("loadFragment function");
        
        var ret  ='{"uiOper":"' + uiOper + '", "uiRef":"' +  uiRef +'","uiFragment":"' + encodeURI(uiFragment) + '","path":"' + this.lastFragment + '"}';
        
        this.send(ret);
    };
    
    ctx.executeJS = function(app, jsModule, jsFunction) {
        'use strict';

        try {
            var caminhoModuloJS = "./" + app.appName + "/" + jsModule + ".js";
            var js = reloadModule(caminhoModuloJS, this, app);

            console.log(jsModule + " loaded");

            console.log("Calling " + 'js.' + jsFunction);

            eval('js.' + jsFunction);

        } catch(err) {
            console.log("ERROR = " + err);
        }
    }
    
    ctx.log = function(obj) {
        console.log("[LOG@" + ctx.sessionID + "--" + new Date().toISOString() + "]:  ", Object.keys(obj).slice(-1)[0] + " function");
    };
    
	ctx.on("data", function(opcode, dados) {
        console.log("Receiving data...");
        
        var incomingData = JSON.parse(dados);
        
        if (!app) app = loadApp(this, incomingData);
        
        //Processing request
        var type = incomingData.req.type;
        if (type == "html"){
            this.loadPage(incomingData.req.file
                            , incomingData.res.uiOper
                            , incomingData.res.uiRef
                            , incomingData.req.initArgs);

        } else if (type == "js"){
            this.executeJS(app, incomingData.req.file, incomingData.req.jsFunction);
        }
	});
	
	ctx.on("close", function(code, reason) {
        if (this.db()) this.db().close();
        console.log("Connection closed: ", code, reason);
	});
});

function loadApp(ctx, incomingData) {
    'use strict';
    
    var appName = incomingData.req.app;
    
    console.log("Loading App " + appName + "...");
    
    var aplic = reloadModule("./" + appName + "/" + appName, ctx);
    
    aplic.appName = appName;
    
    return aplic;
}

function reloadModule(nomeModulo, ctx, app) {
    'use strict';
    
    uncache(nomeModulo);
    
    if (app) {
        return require(nomeModulo)(app, ctx);
    } else {
        return require(nomeModulo)(ctx);
    }
}

function uncache(moduleName) {
    'use strict';
    
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
    'use strict';
    
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


//var crypto = require('crypto');
//
//function randomValueHex (len) {
//    return crypto.randomBytes(Math.ceil(len/2))
//        .toString('hex') // convert to hexadecimal format
//        .slice(0,len);   // return required number of characters
//}
//
//var value1 = randomValueHex(12) // value 'd5be8583137b'
//var value2 = randomValueHex(2)  // value 'd9'
//var value3 = randomValueHex(7)  // value 'ad0fc8c'

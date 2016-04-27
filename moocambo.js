// WebSocket Object
var	wsocket;

//Client context
var ctx = {
    app : location.pathname.replace(/\//g, ""),
    path : "",
    eventID : ""
};

var privatefunctions = {
    prepareStringValue: function(strValue) {
        'use strict';

        strValue = strValue.split("\\").join("");

        var parts = strValue.trim().split("'");

        if (parts.length == 1) return strValue;

        var outcome = "";
        for(var i in parts) {
            if (i == 0) {
                outcome += parts[i];
            } else {
                outcome += "\\'" + parts[i];
            }
        }

        return outcome;
    }
    , prepareJSFunction: function(jsFunction) {
        if (!jsFunction) return "";

        var index = jsFunction.indexOf('(');

        var args = jsFunction.substring(jsFunction.indexOf('(') + 1, jsFunction.lastIndexOf(')'));
        
        
        
        if (index == -1) return jsFunction;
        
        var funcao = jsFunction.split('(')[0];
        
        return funcao + '(' + privatefunctions.prepareArguments(args) + ')';
    }
    , validateConnection: function(websocket, file, uiRef, initArgs) {
        'use strict';
        if (websocket.readyState != 1) {
            console.log("Connecting again...");
            connect(file,uiRef,initArgs);

            if (websocket.readyState != 1) {
                console.log("Unable to connect!");
            }

            return false;
        }
        return true;
    }
    , updateElem: function(elem, uiFragment) {
        'use strict';
        elem.parentNode.replaceChild(privatefunctions.text2dom(uiFragment), elem);
    }
    , validateUIReference: function(uiRef) {
        'use strict';
        //Verifying element existence
        if (!document.getElementById(uiRef)) {
            console.log("Invalid UI Reference (" + uiRef + ")");
            return false;
        }

        return true;
    }
    , validateUIOperation: function(uiOper) {
        'use strict';

        switch(uiOper) {
            case "add", "replace":
                return true;
            default:
                console.log("Invalid UI operation!");
                return false;
        }
    }
    , processResponse: function(data) {
        'use strict';

        var obj = JSON.parse(data),
            uiFragment = decodeURI(obj.uiFragment),
            elem = document.getElementById(obj.uiRef);

        if (obj.path != "undefined") ctx.path = obj.path;

        if (!elem) return;

        if (obj.uiOper === "add") {
            elem.appendChild(privatefunctions.text2dom(uiFragment));
        } else if (obj.uiOper === "replace") {
            privatefunctions.updateElem(elem, uiFragment);
        }
    }
    , text2dom: function(text) {
        'use strict';
        var tmp = document.createElement("div");
        tmp.innerHTML = text;
        return tmp.childNodes[0];
    }
    , sendRequest: function(type, file, uiOper, uiRef, jsFunction, initArgs) {
        var validate = false;

        if (!file) file = ctx.path;

        //Validate connection to the websocket
        validate = privatefunctions.validateConnection(wsocket, file, uiRef, initArgs);

        if (type === "html") {
            validate &= privatefunctions.validateUIReference(uiRef);
            validate &= privatefunctions.validateUIOperation(uiOper);
        }

        if (!validate) return;

        ctx.eventID = ctx.app + type + file + uiOper + uiRef + initArgs;

        var objEnviar = {
        req: {
            app: ctx.app
            , type: type
            , file: file
            , jsFunction: jsFunction
            , initArgs: initArgs
        }, res: {
            uiOper: uiOper
            , uiRef: uiRef
                }
        },
        dados = JSON.stringify(objEnviar);
        
        wsocket.send(dados);
    }
    , validateArgumentsListSize: function () {
        'use strict';
        if (args.length >= 3) {
            console.log("Invalid args list size!");
        }
        return (args.length >= 3);
    }
    , validateJSCommand: function(comandoJS) {
        'use strict';
        //TODO: validate

        return true;
    }
    , prepareArguments: function(args) {
        'use strict';

        if (!args) return "";

        var argz = [];
        
        try {
            argz = args.replace(/,/g,', ').split(',');
        } catch(e) {
            argz[0] = args;
        }
        
        args = "";
        for(var i in argz) {
            if (i>0) args += ', ';
            
            var res;
            
            console.log(typeof argz[i], argz[i]);
            
            try {
                res = eval(argz[i]);
            } catch(e) {
                res = argz[i];
            }
            
            res = "'" + res + "'";
            
//            if (typeof(argz[i] === 'string')) {
//                res = "'" + argz[i] + "'";
//            } else {
//                res = eval(argz[i]);
//            }
            
            args += res;
        }
        
        console.log(args);
        
        return args;
    }
};

function connect(htmlFile, uiRef, initArgs) {
	// Initialize WebSocket connection and event handlers	
	console.log("Connecting " + ctx.app);
	
//	wsocket = new WebSocket("wss://" + location.host);   // Secure connection WSS!
    wsocket = new WebSocket("ws://" + location.host);
	
	// Listen for the connection open event
	wsocket.onopen = function (e) {
		console.log("Connected");
        
		if (htmlFile) {
            replaceHtml(htmlFile, uiRef, initArgs);
		}
        
        document.body.onunload = function () {
            if (wsocket) {
                wsocket.close();
            }
        };
	};
	
    // Listen for the close connection event
	wsocket.onclose = function (e) {
		console.log("Disconnected: " + e.reason);
	};
    
	// Listen for connection errors
	wsocket.onerror = function (e) {
		console.log("Error - connecting failure");
	};
    
	// Listen for new messages arriving at the client
	wsocket.onmessage = function (e) {
        privatefunctions.processResponse(e.data);
		ctx.eventID = "";
	};
}

function addHtml(file, uiRef, initArgs) {
    'use strict';
    
    privatefunctions.sendRequest("html", file, "add", uiRef, "", privatefunctions.prepareArguments(initArgs));
}

function replaceHtml(file, uiRef, initArgs) {
    'use strict';
    
    privatefunctions.sendRequest("html", file, "replace", uiRef, "", privatefunctions.prepareArguments(initArgs));
}

function executeJS(jsFunction, file) {
    'use strict';
    
    console.log(jsFunction);
    
    privatefunctions.sendRequest("js", file, "", "", privatefunctions.prepareJSFunction(jsFunction));
}

function getValue(elem) {
    var tents = [elem.value, elem.getAttribute('data-value'), elem.textContent];
    
    var value;
    for (var i=0; i <= tents.length;i++) {
        value = tents[i];
        
        if (value != undefined) break;
    }
    
    if(typeof value == "string") {
        value = privatefunctions.prepareStringValue(value);
    }
    
    return value;
}
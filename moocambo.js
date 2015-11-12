// WebSocket Object
var	wsocket;

//Define application name
var url_parts = location.pathname.split("/");

//Client context
var ctx = {
    app : url_parts[1],
    eventID : ""
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
        processResponse(e.data);
		ctx.eventID = "";
	};
}

function processResponse(data) {
    'use strict';
    
    var obj = JSON.parse(data),
        uiFragment = decodeURI(obj.uiFragment),
        elem = document.getElementById(obj.uiRef);

    if (!elem) return;
    
	if (obj.uiOper === "add") {
		elem.appendChild(text2dom(uiFragment));
	} else if (obj.uiOper === "replace") {
        updateElem(elem, uiFragment);
	}
}

function text2dom(text) {
    'use strict';
	var tmp = document.createElement("div");
	tmp.innerHTML = text;
	return tmp.childNodes[0];
}

function validateArgumentsListSize() {
    'use strict';
    if (args.length >= 3) {
        console.log("Invalid args list size!");
    }
    return (args.length >= 3);
}

function validateUIOperation(uiOper) {
    'use strict';
	
    switch(uiOper) {
        case "add", "replace":
            return true;
        default:
            console.log("Invalid UI operation!");
            return false;
    }
}

function validateConnection(websocket, file, uiRef, initArgs) {
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

function validateUIReference(uiRef) {
    'use strict';
    //Verifying element existence
    if (!document.getElementById(uiRef)) {
        console.log("Invalid UI Reference (" + uiRef + ")");
        return false;
    }
    
	return true;
}

function validateJSCommand(comandoJS) {
    'use strict';
    //TODO: validate
    
    return true;
}

function sendRequest(app, type, file, uiOper, uiRef, jsFunction, initArgs) {
    var validate = false;
    
    //Validate connection to the websocket
    validate = validateConnection(wsocket, file, uiRef, initArgs);
    
    if (type === "html") {
        validate &= validateUIReference(uiRef);
        validate &= validateUIOperation(uiOper);
    }
    
    if (!validate) return;
    
	ctx.eventID = app + type + file + uiOper + uiRef + initArgs;
    
    var objEnviar = {
    req: {
        app: app
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

function addHtml(file, uiRef, initArgs) {
    'use strict';
    sendRequest(ctx.app, "html", file, "add", uiRef, "", prepareArguments(initArgs));
}

function replaceHtml(file, uiRef, initArgs) {
    'use strict';
    console.log('replaceHtml');
    sendRequest(ctx.app, "html", file, "replace", uiRef, "", prepareArguments(initArgs));
}

function updateElem(elem, uiFragment) {
    'use strict';
    
    elem.parentNode.replaceChild(text2dom(uiFragment), elem);
}

function executeJS(file, jsFunction) {
    'use strict';
    
    console.log(jsFunction);
    
    sendRequest(ctx.app, "js", file, "", "", prepareJSFunction(jsFunction));
}

function prepareArguments(args) {
    'use strict';
    
    if (!args) return "";
    
    var argz = args.replace(/,/g,', ').split(',');
    
    args = "";
    for(var i in argz) {
        if (i>0) args += ', ';
        
        var res = eval(argz[i]);
        
        if (parseInt(res) != res && parseFloat(res) != res) {
            res = "'" + res + "'";
        }
        
        args += res;
    }
    
    return args;
}

function prepareJSFunction(jsFunction) {
    if (!jsFunction) return "";
    
    var index = jsFunction.indexOf('(');
    
    var args = jsFunction.substring(jsFunction.indexOf('(') + 1, jsFunction.lastIndexOf(')'));
    
    if (index == -1) return jsFunction;
    
    var funcao = jsFunction.split('(')[0];
    
    return funcao + '(' + prepareArguments(args) + ')';
}

function getValue(elem) {
    var tents = [elem.value, elem.getAttribute('data-value'), elem.textContent];
    
    var valor;
    for (var i=0; i <= tents.length;i++) {
        valor = tents[i];
        if (valor) break;
    }
    
    console.log(elem + " - " + valor);
    
    return valor;
}

'use strict';

// WebSocket Object
var	wsocket;

//Client context
var ctx = {
    app : location.pathname.replace(/\//g, ""),
    currentPath : "",
    currentJsFunction : ""
};

var privatefunctions = {
    prepareStringValue: function (strValue) {
        strValue = strValue.split("\\").join("");
    
        var parts = strValue.trim().split("'"), outcome = "";

        if (parts.length == 1) {
            return strValue;
        }

        var i;
        for (i in parts) {
            if (i === 0) {
                outcome += parts[i];
            } else {
                outcome += "\\'" + parts[i];
            }
        }

        return outcome;
    }
    , prepareJSFunction: function (jsFunction) {
        if (!jsFunction) return "";

        var index = jsFunction.indexOf('(');

        var args = jsFunction.substring(jsFunction.indexOf('(') + 1, jsFunction.lastIndexOf(')'));
        
        if (index == -1) return jsFunction;
        
        var funktion = jsFunction.split('(')[0];
        
        var realArgs = privatefunctions.prepareArguments(args);
        
        return funktion + '(' + realArgs + ')';
    }
    , validateConnection: function (websocket, file, uiRef) {
        if (websocket.readyState != 1) {
            console.info("Connecting again...");
            connect();

            if (websocket.readyState != 1) {
                console.info("Unable to connect!");
            }
            return false;
        }
        
        return true;
    }
    , updateElem: function (elem, uiFragment) {
        var newElemNode = privatefunctions.text2dom(uiFragment);
        var resultElem = elem.parentNode.replaceChild(newElemNode, elem);
        
        var autoFocusElem = document.querySelectorAll("*[autofocus]")[0];
        
        if (autoFocusElem) {
            autoFocusElem.focus();    
        }
    }
    , validateUIReference: function (uiRef) {
        //Verifying element existence
        if (!document.getElementById(uiRef)) {
            console.info("Invalid UI Reference (" + uiRef + ")");
            return false;
        }

        return true;
    }
    , validateUIOperation: function (uiOper) {
        switch(uiOper) {
            case "add", "replace":
                return true;
            default:
                console.info("Invalid UI operation!");
                return false;
        }
    }
    , processResponse: function (data) {
        var obj = JSON.parse(data),
            uiFragment = decodeURI(obj.uiFragment),
            elem = document.getElementById(obj.uiRef);
        
        ctx.currentPath = obj.path;
        
        if (!elem) return;

        if (obj.uiOper === "add") {
            elem.appendChild(privatefunctions.text2dom(uiFragment));
        } else if (obj.uiOper === "replace") {
            privatefunctions.updateElem(elem, uiFragment);
        }
        //document.activeElement.blur();
    }
    , text2dom: function(text) {
        var tmp = document.createElement("div");
        tmp.innerHTML = text;
        return tmp.childNodes[0];
    }
    , sendRequest: function(type, file, uiOper, uiRef, jsFunction) {
        var validate = false;
        
        //Validate connection to the websocket
        validate = privatefunctions.validateConnection(wsocket, file, uiRef);

        if (type === "html") {
            validate &= privatefunctions.validateUIReference(uiRef);
            validate &= privatefunctions.validateUIOperation(uiOper);
        }

        if (!validate) return;
        
        var objEnviar = {
            req: {
                app: ctx.app
                , type: type
                , file: file
                , jsFunction: jsFunction
                , page: document.getElementById("page").innerHTML
            }
            , res: {
                uiOper: uiOper
                , uiRef: uiRef
            }
        },
        dados = JSON.stringify(objEnviar);
        
        wsocket.send(dados);
        
    }
    , validateArgumentsListSize: function () {
        if (args.length >= 3) {
            console.info("Invalid args list size!");
        }
        return (args.length >= 3);
    }
    , prepareArguments: function(args) {
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
            
            try {
                res = eval(argz[i]);
            } catch(e) {
                res = argz[i];
            }
            
            res = "'" + res + "'";
            
            args += res;
        }
        
        return args;
    }
};

var $server = {
    connect: function(htmlFile, uiRef) {
        // Initialize WebSocket connection and event handlers
        console.info("Connecting " + ctx.app);

//        wsocket = new WebSocket("wss://" + location.host);   // Secure connection WSS!
        wsocket = new WebSocket("ws://" + location.host);

        // Listen for the connection open event
        wsocket.onopen = function (e) {
            console.info("Connected");

            if (htmlFile) {
                privatefunctions.sendRequest("html", htmlFile, "replace", uiRef, "");
            } else if (ctx.currentJsFunction) {
                $server.run(ctx.currentJsFunction, ctx.currentPath);
            }

            document.body.onunload = function () {
                if (wsocket) {
                    wsocket.close();
                }
            };
        };
        
        // Listen for the close connection event
        wsocket.onclose = function (e) {
            console.info("Disconnected: " + e.reason);
        };

        // Listen for connection errors
        wsocket.onerror = function (e) {
            console.info("Error - connecting failure. " + e);
        };

        // Listen for new messages arriving at the client
        wsocket.onmessage = function (e) {
            privatefunctions.processResponse(e.data);
        };
    }
    , run: function(jsFunction, file) {
        try {
            ctx.currentJsFunction = jsFunction;

            if (!file) {
                file = ctx.currentPath;
            }

            privatefunctions.sendRequest("js", file, "", "", privatefunctions.prepareJSFunction(jsFunction));
        } catch (err) {
            console.log("----------------\n [ERROR]: " + err + " --> function: run\n----------------");
            throw err;
        }
    }
    , redirect: function(page, elemId, jsFunction) {
        if (!page) {
            page = ctx.currentPath;
        }
        if (!elemId) {
            elemId = "page";
        }
        
        privatefunctions.sendRequest("html", page, "replace", elemId, jsFunction);
    }
    , refresh: function() {
        
        return redirect();
    }
}

//Main functions aliases
var run = $server.run;
var connect = $server.connect;
var redirect = $server.redirect;
var refresh = $server.refresh;
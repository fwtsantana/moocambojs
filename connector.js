// WebSocket Object
var	wsocket;

//Client context
var ctx = {
    app : location.pathname.replace(/\//g, ""),
    currentPath : "",
    currentJsFunction : ""
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
            console.info("Connecting again...");
            connect();

            if (websocket.readyState != 1) {
                console.info("Unable to connect!");
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
            console.info("Invalid UI Reference (" + uiRef + ")");
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
                console.info("Invalid UI operation!");
                return false;
        }
    }
    , processResponse: function(data) {
        'use strict';
        
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
        
    }
    , text2dom: function(text) {
        'use strict';
        var tmp = document.createElement("div");
        tmp.innerHTML = text;
        return tmp.childNodes[0];
    }
    , sendRequest: function(type, file, uiOper, uiRef, jsFunction, initArgs) {
        var validate = false;
        
        console.info("Validate connection to the websocket");
        
        //Validate connection to the websocket
        validate = privatefunctions.validateConnection(wsocket, file, uiRef, initArgs);

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
            console.info("Invalid args list size!");
        }
        return (args.length >= 3);
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

function connect(htmlFile, uiRef, initArgs) {
	// Initialize WebSocket connection and event handlers	
	console.info("Connecting " + ctx.app);
	
//	wsocket = new WebSocket("wss://" + location.host);   // Secure connection WSS!
    wsocket = new WebSocket("ws://" + location.host);
	
	// Listen for the connection open event
	wsocket.onopen = function (e) {
		console.info("Connected");
        
		if (htmlFile) {
            privatefunctions.sendRequest("html", htmlFile, "replace", uiRef, "", privatefunctions.prepareArguments(initArgs));
		} else if (ctx.currentJsFunction) {
            $(ctx.currentJsFunction, ctx.currentPath);
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
		console.info("Error - connecting failure");
	};
    
	// Listen for new messages arriving at the client
	wsocket.onmessage = function (e) {
        privatefunctions.processResponse(e.data);
	};
}

function $(jsFunction, file) {
    'use strict';
    
    ctx.currentJsFunction = jsFunction;
    
    if (!file) {
        file = ctx.currentPath;
    }
    
    privatefunctions.sendRequest("js", file, "", "", privatefunctions.prepareJSFunction(jsFunction));
}

const DECIMAL_SIGN = ',';

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

function emptyDiv(elem) {
    var e = document.getElementById(elem);
    
    if (e) {
        var newDiv = document.createElement("div");
        newDiv.setAttribute("id", elem);

        e.parentNode.replaceChild(newDiv, e);
    }
}

var inputInteger = {
    handleInput: function(e) {
        var notPermittedKeyArray = "'=qwertyuiop´[asdfghjklç~]\zxcvbnm.;/*-+."
        + "!@#$%*()_+QWERTYUIOP`{ASDFGHJKLÇ^}|ZXCVBNM<>:?"
        + "¬¹²³£¢\§/?€®ŧ←↓→øþ´ªæßðđŋħłº«»©“”nµ·";
        
        var permittedCodesWordArray = "DeleteHomeEndArrowUpArrowRightArrowDownArrowLeftBackspaceNumpadTab";
        
        var permitCodes = (permittedCodesWordArray.indexOf(e.code) > -1)
                        || (e.code.indexOf("Numpad") > -1)
                        || (e.code.indexOf("Digit") > -1);
        
        var notPermitted = ((!permitCodes)
            || (notPermittedKeyArray.indexOf(e.key) > -1)
        );
        
        if (notPermitted) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }
}

var inputDecimal = {
    formatInput: function(e) {
        
        var texto = e.target.value;
        
        if (texto === DECIMAL_SIGN) {
            texto = "0";
        } else {
            texto = e.target.value.replace(/\,/g,".");
        }
        
        texto = new Intl.NumberFormat("pt-BR", {minimumFractionDigits:2}).format(texto);
        
        e.target.value = texto;
        
    }
    , handleInput: function(e) {
        var isDecimalSign = (e.code === "Comma" ||  e.code === "NumpadDecimal");
        
        var notPermittedKeyArray = "'=qwertyuiop´[asdfghjklç~]\zxcvbnm.;/*-+."
        + "!@#$%*()_+QWERTYUIOP`{ASDFGHJKLÇ^}|ZXCVBNM<>:?"
        + "¬¹²³£¢\§/?€®ŧ←↓→øþ´ªæßðđŋħłº«»©“”nµ·";
        
        var permittedCodesWordArray = "DeleteHomeEndArrowUpArrowRightArrowDownArrowLeftCommaBackspaceNumpadDecimalTab";
        
        var permitCodes = (permittedCodesWordArray.indexOf(e.code) > -1)
                        || (e.code.indexOf("Numpad") > -1)
                        || (e.code.indexOf("Digit") > -1);
        
        var notPermitted = (
            (isDecimalSign && e.target.value.split(DECIMAL_SIGN).length > 1) //Permitir apenas um sinal de decimal
            || (!permitCodes)
            || (notPermittedKeyArray.indexOf(e.key) > -1)
        );
        
        if (notPermitted) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }
};

var notification = {
    remove: function() {
        'use strict';
        
        var notif = document.getElementById("notificacao");
        if (notif) {
            notif.parentElement.removeChild(notif);
        }
    }
};
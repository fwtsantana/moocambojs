'use strict';

var fs = require("fs");

module.exports = function(wsConnection) {
    
    var app = wsConnection.application;
    
    var module = {
        view: function() {
            return app.modules.view;
        }
        , util: function() {
            return app.modules.util;
        }
        , services: function() {
            return app.modules.services;
        }
        ,
        config: {
            getLocal: function(key) {
                if (key) {
                    return app.config.local[key];
                } else {
                    return app.config.local;
                }
            }
            , getGlobal: function(key) {
                if (key) {
                    return app.config.global[key];
                } else {
                    return app.config.global;
                }
            }
        }
        , server: {
            logging: {
                log: function(msg) {
                    var data = new Date().toLocaleDateString(), timestamp = data.split('-')[2] + '/' + data.split('-')[1] + '/' + data.split('-')[0];
                    console.info("[", timestamp, new Date().toLocaleTimeString(), "][LOG@", app.sessionID, "]: ", msg);
                }
                , javascript: function(functionName) {
                    var msg = "Calling function --> " + functionName;
                    this.log(msg);
                }
                , html: function(pageName) {
                    var msg = "Loading page or fragment " + pageName;
                    this.log(msg);
                }
            }
            , properties: {
                set: function(key, value) {
                    app.properties[key] = value;
                }
                , get: function(key) {
                    return app.properties[key];
                }
                , clear: function() {
                    app.properties = {};
                }
            }
            , dataConnections: {
                mongoDB: {
                    get: function() {
                        return app.dataConnections.mongoDB.instance;
                    }
                    , set: function(url) {
                        if (!app.dataConnections.mongoDB.instance) {

                            var MongoClient = require('mongodb').MongoClient;

                            MongoClient.connect(url, function (error, dbConnection) {

                                if (error) {
                                    module.server.logging.log("Could not connect to database!");
                                    return;
                                }

                                module.server.logging.log('Successfully connected to MongoDB (at ' + url + ')');

                                app.dataConnections.mongoDB.instance = dbConnection;
                            });
                        }
                    }
                    , close: function() {
                        if (app.dataConnections.mongoDB.instance) {
                            app.dataConnections.mongoDB.instance.close();
                        }
                    }
                }    
            }
            , javascript: {
                execute: function(jsModule, jsFunction) {
                    try {
                        
                        if (!jsModule) {
                            jsModule = app.config.global.pagesDir + app.currentPage.path;
                        } else {
                            app.currentPage.path = jsModule;
                            jsModule = app.config.global.pagesDir + jsModule;
                        }
                        
                        var jsModulePath = "./apps/" + app.name + "/" + jsModule + ".js";
                        
                        if ((!app.currentJSModule) || app.currentJSModule.path !== jsModulePath) {
                            app.currentJSModule = wsConnection.loadModule(jsModulePath);
                        }
                        
                        module.server.logging.javascript(jsModule + "/" + jsFunction);
                        
                        return eval("app.currentJSModule." + jsFunction);
                        
                    } catch (error) {
                        module.server.logging.log("ERROR: " + error + " Module: [" + jsModule + "], Function: " + jsFunction);
                    }
                }
            }
            , page: {
                add: function(pagePath, addedElement, initArgs) {
                    changeFromPage(wsConnection, pagePath, "add", addedElement, initArgs);
                }
                , load: function(pagePath, replacedElement, initArgs) {
                    changeFromPage(wsConnection, pagePath, "replace", replacedElement, initArgs);
                }
                , reload: function(initArgs) {
                    changeFromPage(wsConnection, app.currentPage.path, "replace", app.currentPage.replacedElement, initArgs);
                }
            }
            , fragment: {
                add: function(fragmentFile, addedElement) {
                    changeFromFragment(wsConnection, fragmentFile, "add", addedElement);
                }
                , addFromText: function(text, addedElement) {
                    changeFromText(wsConnection, text, "add", addedElement);
                }
                , load: function(fragmentFile, replacedElement) {
                    changeFromFragment(wsConnection, fragmentFile, "replace", replacedElement);
                }
                , loadFromText: function(text, replacedElement) {
                    changeFromText(wsConnection, text, "replace", replacedElement);
                }
            }
        }
    }
    return module;
}

function changeFromPage(wsConnection, pagePath, uiOper, element, initArgs) {
    var previousPage = {}, oldFileName, fileName, fragmentText, argsText, jsFunction;
    
    try {
        
        previousPage = wsConnection.application.currentPage;
        
        fileName = "apps/" + wsConnection.application.name + "/" + wsConnection.application.config.global.pagesDir + pagePath + ".html";
        
        var rawFragmentText = fs.readFileSync(fileName, 'utf-8');
        
        var fragmentText = replaceELStatements(wsConnection.api, rawFragmentText, pagePath);
        
        wsConnection.application.currentPage = {
            path: pagePath
            , content: fragmentText
            , replacedElement: element
        };
        
        wsConnection.application.previousPage = previousPage;
        
        changeFromText(wsConnection, fragmentText, uiOper, element);
        
        if (!initArgs) {
            initArgs = [];
        }
        
        argsText = "";
        if (Array.isArray(initArgs) && initArgs.length > 0) {
            argsText = "'" + initArgs.join("', '") + "'";
        }
        
        jsFunction = wsConnection.application.config.global.initFunction + "(" + argsText + ")";
        
        wsConnection.api.server.javascript.execute(pagePath, jsFunction);
        
    } catch (error) {
        wsConnection.api.server.logging.log("[LOAD_PAGE_ERROR]: " + error);
        wsConnection.application.currentPage = previousPage;
    }
}

function changeFromFragment(wsConnection, fragmentFile, uiOper, element) {
    try {
        var text = fs.readFileSync("apps/" + wsConnection.application.name + "/" + wsConnection.application.config.global.fragmentsDir + fragmentFile + ".html", 'utf-8');
        changeFromText(wsConnection, text, uiOper, element);
    } catch (error) {
        wsConnection.api.server.logging.log("[LOAD_PAGE_ERROR]: " + error);
    }
}

function changeFromText(wsConnection, text, uiOper, element) {
    var ret = '{"uiOper":"' + uiOper + '", "uiRef":"' + element + '","uiFragment":"' + encodeURI(text) + '","path":"' + wsConnection.application.currentPage.path + '"}';
    
    wsConnection.send(ret);
}

function replaceELStatements(api, text, pagePath) {
    var strSet, jsFunction, uiFragment;
    
    strSet = text.match(/\#\{(.*)\}/g);
    
    if (strSet) {
        for(var item of strSet) {
            jsFunction = item.replace("#{", "").replace("}", "");
            uiFragment = api.server.javascript.execute(pagePath, moduleViewObjectName + "." + jsFunction + "()");
            
            if (uiFragment) {
                text = text.replace(item, uiFragment);
            }
        }
    }
    
    return text;
}
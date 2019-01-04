'use strict';

module.exports = function(moo) {
    
    var module = {
        services: require("./api/#appName#_services") (moo)
        , util : require("./api/#appName#_util") (moo)
        , view: require("./api/#appName#_view") (moo)
    };
    
    //Centralize logging
    console.log = function(msg) {
        moo.server.logging.log(msg);
    }
    
    return module;
};
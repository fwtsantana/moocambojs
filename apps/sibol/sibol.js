'use strict';

module.exports = function(moo) {
    
    var module = {
        services: require("./api/sibol_services") (moo)
        , util : require("./api/sibol_util") (moo)
        , view: require("./api/sibol_view") (moo)
    };
    
    //Centralize logging
    console.log = function(msg) {
        moo.server.logging.log(msg);
    }
    
    return module;
};
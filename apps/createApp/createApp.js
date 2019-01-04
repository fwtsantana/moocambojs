'use strict';

module.exports = function(moo) {
    
    var module = {
        services: require("./api/createApp_services") (moo)
        , util : require("./api/createApp_util") (moo)
        , view: require("./api/createApp_view") (moo)
    };
    
    //Centralize logging
    console.log = function(msg) {
        moo.server.logging.log(msg);
    }
    
    return module;
};
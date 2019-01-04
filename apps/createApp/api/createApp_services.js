'use strict';

module.exports = function(moo) {
    var data = require("../../../fapi/data")(moo);
    
    //Initialize MongoDB
    //moo.server.dataConnections.mongoDB.set("mongodb://localhost:27017/debitus");
    
    var modulo = {
        builder: require("../services/builderService")(moo, data)
    };
    
    return modulo;
};
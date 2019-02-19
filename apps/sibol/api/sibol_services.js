'use strict';

module.exports = function(moo) {
    var data = require("../../../fapi/data")(moo);
    
    initializeDatabaseConnectionInstances(moo);
    
    var modulo = {
        usuario: require("../services/usuarioService")(moo, data)
    };
    
    return modulo;
};

/*
* Use this function to initialize the database connection instances with methods defined in 'moo.server.dataConnections'
* e.g.: for MongoDB, use 'moo.server.dataConnections.mongoDB.set("mongodb://<host>:<port>/<dbName>");'
*/
function initializeDatabaseConnectionInstances(moo) {
    //Initialize MongoDB instance
    moo.server.dataConnections.mongoDB.set("mongodb://localhost:27017/sibol");
}
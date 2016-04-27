module.exports = function(ctx) {
    
    var modulo = {
        executeSQL: function(app, ctx, dbConfig, sql, onError, onSuccess) {
            var Connection = require('tedious').Connection;
            var connection = new Connection(dbConfig);

            connection.on('connect', function(err) {
                if (err) {
                    onError(app, ctx, err);
                } else {
                    var data = new Array();

                    var Request = require('tedious').Request;

                    var request = new Request(sql, function(err, rowCount) {
                        if (err) {
                            onError(app, ctx, err);
                        } else {
                            onSuccess(rowCount, data);
                        }
                    });

                    request.on('row', function(columns) {
                        data.push(columns);
                    });

                    connection.execSql(request);
                }
            });
        }
//        , dataUIElement: function(ctx, elementoUI, elemId, dataArray) {
//            'use strict';
//
//            ctx.loadFragment(elementoUI(elemId, dataArray), "replace", elemId);
//        }
        , SQL: {
            format: {
                duplicateApostrophe: function(strValue) {
                    var parts = (strValue+"").split("'");

                    if (parts.length == 1) return strValue;

                    var outcome = "";
                    for(var i in parts) {
                        if (i == parts.length - 1) {
                            outcome += parts[i];
                        } else {
                            outcome += parts[i] + "''";
                        }
                    }

                    return outcome;
                }
                , toAlphanumericText: function(strValue) {
                    return "'" + this.duplicateApostrophe(strValue) + "'";
                }
            }
        }    
        , initMongoDB: function(url) {
            'use strict';

            if (!ctx.mongodb()) {
                var MongoClient = require('mongodb').MongoClient;

                MongoClient.connect(url, function (err, db) {

                    if (err) {
                        console.info("Could not connect to database!");
                        return;
                    }

                    console.info('Successfully connected to MongoDB (at ' + url + ')');

                    ctx.setMongoDB(db);
                });

            }
        }    
    }
    
    return modulo;
}
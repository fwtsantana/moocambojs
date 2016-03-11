module.exports = {
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
    , dataUIElement: function(app, ctx, dbConfig, elemId, elementoUI, uiOper, uiRef, query, onError) {
        'use strict';
        var onSuccess = function(rowCount, data) {
            console.log(rowCount + ' rows returned.');
            ctx.loadFragment(elementoUI(elemId, data), uiOper, uiRef);
        };
        
        this.executeSQL(app, ctx, dbConfig, query, onError, onSuccess);
    }
    , dataHTMLSelect : function(app, ctx, dbConfig, sqlQuery, elemId) {
        'use strict';
        
        this.dataUIElement(app, ctx, dbConfig, elemId, app.ui.listaSuspensa, "replace", elemId, sqlQuery);
    }
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
    , mongodb: function(url, ctx, dbFunction, uiReprFunction) {
        'use strict';
        
        var execMongo = function(db, uiReprFunction) {
            
            if (uiReprFunction) {
                return uiReprFunction(dbFunction(db));
            } else {
                return dbFunction(db);
            }
            
        }
        
        if (!ctx.db()) {
            var MongoClient = require('mongodb').MongoClient;
            
            MongoClient.connect(url, function (err, db) {
                
                if (err) {
                    console.info("Could not connect to database!");
                    return;
                }
                
                console.info('Successfully connected to MongoDB (at ' + url + ')');

                ctx.setMongoDB(db);
                
                execMongo(ctx.db, uiReprFunction);
            });
            
        } else {
            
            execMongo(ctx.db, uiReprFunction);
            
        }
    }
}
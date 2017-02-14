module.exports = function(ctx) {
    
    var modulo = {
        mongo: {
            initMongoDB: {}
            , find: {}
            , exists: {}
            , insertOne: {}
            , updateField: {}
            , updateArray: {}
        }
    }
    
    modulo.mongo.initMongoDB = function(url) {
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
    
    modulo.mongo.find = function(collection, filter, onSuccess, onError) {
        ctx.mongodb().collection(collection).find(filter).toArray(function(err, docs){
            if (err) {
                onError(err);
            } else {
                onSuccess(docs);
            }
        });
    }
    
    modulo.mongo.exists = function(collection, filter, onExists, onNotExists) {
        ctx.mongodb().collection(collection).count(filter).then(function(count) {
            if (count > 0) {
                onExists(count);
            } else {
                onNotExists();
            }
        });
    }
    
    modulo.mongo.insertOne = function(collection, objectToInsert, onSuccess, onError) {
        var coll = ctx.mongodb().collection(collection);

        coll.insertOne(objectToInsert, function(err, docs){

            if(err) {
                onError(err);
            } else {
                onSuccess(docs);
            }
            
        });
    }
    
    modulo.mongo.updateField = function(collection, filter, fieldName, newValue, onSuccess, onError) {
        
        var newObject = {};
        
        newObject[fieldName] = newValue;
        
        ctx.mongodb().collection(collection).update(filter, {$set: newObject}, function(err, docs){
            if (err) {
                onError(err);
            } else {
                onSuccess(docs);
            }
        });
    }
    
    modulo.mongo.updateArray = function(collection, filter, arrayName, newValue, onSuccess, onError) {
        
        var newObject = {};
        
        newObject[arrayName] = newValue;
        
        ctx.mongodb().collection(collection).updateOne(filter, {$push: newObject}, function(err, docs){
            if (err) {
                onError(err);
            } else {
                onSuccess(docs);
            }
        });
    }
    
    return modulo;
}
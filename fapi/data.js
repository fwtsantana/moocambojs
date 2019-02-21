'use strict';

module.exports = function(moo) {
    
    var module = {
        mongo: {
            find: function(collection, filter, onSuccess, onError) {
                moo.server.dataConnections.mongoDB.get().collection(collection).find(filter).toArray(function(err, docs){
                    if (err) {
                        return onError(err);
                    } else {
                        return onSuccess(docs);
                    }
                });
            }
            , findAttributes: function(collection, filter, attribute, onSuccess, onError) {
                moo.server.dataConnections.mongoDB.get().collection(collection).find(filter, attribute).toArray(function(err, docs){
                    if (err) {
                        return onError(err);
                    } else {
                        return onSuccess(docs);
                    }
                });
            }
            , exists: function(collection, filter, onExists, onNotExists) {
                moo.server.dataConnections.mongoDB.get().collection(collection).count(filter).then(function(count) {
                    if (count > 0) {
                        return onExists(count);
                    } else {
                        return onNotExists();
                    }
                });
            }
            , insertOne: function(collection, objectToInsert, onSuccess, onError) {
                var coll = moo.server.dataConnections.mongoDB.get().collection(collection);

                coll.insertOne(objectToInsert, function(err, docs){

                    if(err) {
                        return onError(err);
                    } else {
                        return onSuccess(docs);
                    }

                });
            }
            , updateField: function(collection, filter, fieldName, newValue, onSuccess, onError) {

                var newObject = {};

                newObject[fieldName] = newValue;

                moo.server.dataConnections.mongoDB.get().collection(collection).update(filter, {$set: newObject}, function(err, docs){
                    if (err) {
                        return onError(err);
                    } else {
                        return onSuccess(docs);
                    }
                });
            }
            , updateArray: function(collection, filter, arrayName, newValue, onSuccess, onError) {

                var newObject = {};

                newObject[arrayName] = newValue;

                moo.server.dataConnections.mongoDB.get().collection(collection).updateOne(filter, {$push: newObject}, function(err, docs){
                    if (err) {
                        return onError(err);
                    } else {
                        return onSuccess(docs);
                    }
                });
            }
        }
    }
    
    return module;
}
'use strict';

module.exports = function(moo) {
    
    var module = {
        mongo: {
            getCollection: function(collection) {
                return moo.server.dataConnections.mongoDB.get().collection(collection);
            }
            , find: function(collection, filter, onSuccess, onError) {
                this.getCollection(collection).find(filter).toArray(function(err, docs){
                    if (err) {
                        return onError(err);
                    } else {
                        return onSuccess(docs);
                    }
                });
            }
            , findOne: function(collection, filter, onSuccess, onError) {
                this.getCollection(collection).findOne(filter, function(err, result) {
                   if (err) {
                       return onError(err);
                   } else {
                       return onSuccess(result);
                   }
                });
            }
            , findAttributes: function(collection, filter, attribute, onSuccess, onError) {
                this.getCollection(collection).find(filter, attribute).toArray(function(err, docs){
                    if (err) {
                        return onError(err);
                    } else {
                        return onSuccess(docs);
                    }
                });
            }
            , exists: function(collection, filter, onExists, onNotExists) {
                this.getCollection(collection).count(filter).then(function(count) {
                    if (count > 0) {
                        return onExists(count);
                    } else {
                        return onNotExists();
                    }
                });
            }
            , insertOne: function(collection, objectToInsert, onSuccess, onError) {
                this.getCollection(collection).insertOne(objectToInsert, function(err, docs){

                    if(err) {
                        return onError(err);
                    } else {
                        return onSuccess(docs);
                    }

                });
            }
            , updateObject: function(collection, filter, object, onSuccess, onError) {
                this.getCollection(collection).update(filter, {$set: object}, function(err, docs){
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

                this.getCollection(collection).updateOne(filter, {$push: newObject}, function(err, docs){
                    if (err) {
                        return onError(err);
                    } else {
                        return onSuccess(docs);
                    }
                });
            }
            , deleteOne: function(collection, filter, onSuccess, onError) {
                this.getCollection(collection).deleteOne(filter
                    , function(err, res) {
                        if (err) {
                            return onError(err);
                        } else {
                            return onSuccess(res.deletedCount);
                        }
                    }
                );
            }
            , listDocumentsStartingWith: function(collection, field, startsWith, onSuccess, onError) {
                var filter = {}
                filter[field] = { $regex: "^" + startsWith};

                moo.server.dataConnections.mongoDB.get().collection(collection).find(filter).toArray(function(err, docs) {
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
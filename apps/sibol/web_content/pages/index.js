module.exports = function (moo) {
    'use strict';
    var module = {
        view : {}
        , init : function() {
            console.log("Index loaded!");
        }
        , manterUsuarios: function() {
            moo.server.page.load("usuarios/manterUsuarios", "page");
        }
        , manterTiposBoleto: function() {
            moo.server.page.load("manterTiposBoleto", "page");
        }
        , manterModelosEmail: function() {
            moo.server.page.load("manterModelosEmail", "page");
        }
    };
    
    return module;
};
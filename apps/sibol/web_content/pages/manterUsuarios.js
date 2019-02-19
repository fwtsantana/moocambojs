module.exports = function (moo) {
    'use strict';
    var module = {
        view : {}
        , init : function() {}
        , digitouTexto: function(campo, texto) {
            
            console.log("campo " + campo);
            console.log("texto " + texto);
            
            var onSuccess = function(docs) {
                console.log(moo.view().fichaUsuario(docs[0]));
                
                moo.server.fragment.addFromText(moo.view().fichaUsuario(docs[0]), "tabUsuarios");
                
                console.log(docs);
            };
            
            var onError = function(err) {
                console.log(err);
            }
            
            moo.services().usuario.listarUsuariosQueComecamCom(campo, texto, onSuccess, onError);
        }
    };
    
    return module;
};
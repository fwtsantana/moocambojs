module.exports = function (moo) {
    'use strict';
    var module = {
        view : {}
        , init : function() {}
        , digitouTexto: function(campo, texto) {
            try {
                var onSuccess = function(docs) {
                    moo.server.fragment.loadFromText(moo.view().base.div("tabUsuarios",["class='grid'"],""), "tabUsuarios");

                    docs.forEach(function(item, index) {
                        moo.server.fragment.addFromText(moo.view().fichaUsuario(item), "tabUsuarios");
                    });
                };
                
                var onError = function(err) {
                    console.log(err);
                }
                
                moo.services().usuario.listarUsuariosQueComecamCom(campo, texto, onSuccess, onError);
            } catch (e) {
                console.log(e);
            }
            
        }
        , mudouCampo: function() {
            moo.server.fragment.loadFromText(moo.view().base.div("tabUsuarios",["class='grid'"],""), "tabUsuarios");
        }
    };
    
    return module;
};
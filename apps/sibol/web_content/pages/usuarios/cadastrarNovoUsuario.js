module.exports = function (moo) {
    'use strict';
    var module = {
        view : {}
        , init : function() {}
        , cadastrarNovoUsuario: function(email, senha, perfil) {            
            var onSuccess = function(docs) {
                moo.server.page.load("usuarios/manterUsuarios", "page");
            };
            
            var onError = function(error) {
                var err = moo.view().base.div("err", [], error);
                moo.server.fragment.loadFromText(err, "err");
            };
            
            moo.services().usuario.inserirNovoUsuario(email, senha, perfil, onSuccess, onError);
        }
    };
    
    return module;
};
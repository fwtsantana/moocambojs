module.exports = function (moo) {
    'use strict';
    var module = {
        view : {}
        , init : function() {}
        , cadastrarNovoUsuario: function(email, senha, perfil) {            
            moo.services().usuario.inserirNovoUsuario(email, senha, perfil, function(){
                moo.server.page.load("usuarios/manterUsuarios", "page");
            }, function(error){
                var err = moo.view().base.div("err", [], error);
                moo.server.fragment.loadFromText(err, "err");
            });
        }
    };
    
    return module;
};
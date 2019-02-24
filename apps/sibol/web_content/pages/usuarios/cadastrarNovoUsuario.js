module.exports = function (moo) {
    'use strict';
    var module = {
        view : {}
        , init : function() {}
        , cadastrarNovoUsuario: function(email, senha, perfil) {
            
            console.log(email);
            console.log(senha);
            console.log(perfil);
            
            if (!validarEmail(moo, email)) {
                return;
            }
            
            var onSuccess = function(docs) {
                console.log("deu certo!");
                console.log(docs);
            };

            var onError = function(error) {
                console.log("não deu certo!");
                console.log(error);
            };

            moo.services().usuario.inserirNovoUsuario(email, senha, perfil, onSuccess, onError);
        }
    };
    
    return module;
};

function validarEmail(moo, email) {
    if (!moo.util().base.email.validate(email)) {
        var err = moo.view().base.div("err", [], "E-mail incorreto!");
        moo.server.fragment.loadFromText(err, "err");
        return false;
    }
    return true;
    
    
}
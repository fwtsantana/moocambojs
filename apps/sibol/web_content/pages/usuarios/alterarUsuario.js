module.exports = function (moo) {
    'use strict';
    var module = {
        view : {}
        , init : function(id) {
            console.log("Init alterarUsuario: " + id);
            
            moo.services().usuario.obterUsuarioPorID(id, function(objUsuario) {
                console.log(objUsuario);
                if (!objUsuario) {
                    moo.server.page.load("usuarios/manterUsuarios", "page");
                    moo.server.fragment.loadFromText("<div id=\"err\">Usuário não encontrado!</div>", "err");
                    return;
                }
                
                moo.server.fragment.loadFromText(objUsuario.txEmail, "txEmail");
                var checked = moo.view().base.input(objUsuario.txPerfil, ["type='radio'", "name='perfil'", "value='" + objUsuario.txPerfil + "'", "checked"], "");
                moo.server.fragment.loadFromText(checked, objUsuario.txPerfil);
                
            }, function(err) {
                moo.server.page.load("usuarios/manterUsuarios", "page");
            });
            
            
        }
        , alterarUsuario: function(id, senha, perfil) {
            console.log("alterarUsuario: " + id);
        }
    };
    
    return module;
};
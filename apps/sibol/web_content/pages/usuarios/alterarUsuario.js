module.exports = function (moo) {
    'use strict';
    var module = {
        view : {}
        , init : function(id) {
            moo.services().usuario.obterUsuarioPorID(id, function(objUsuario) {
                if (!objUsuario) {
                    moo.server.page.load("usuarios/manterUsuarios", "page");
                    var errDiv = moo.view().base.div("err",[], "Usuário não encontrado!");
                    moo.server.fragment.loadFromText(errDiv, "err");
                    return;
                }
                
                moo.server.fragment.loadFromText(objUsuario.txEmail, "txEmail");
                
                var senha = moo.view().base.input("txtSenha",
                    ["type='password'", "maxlength='8'", "placeholder='Informe a senha'", "value='" + objUsuario.txSenha + "'"],"");
                moo.server.fragment.loadFromText(senha, "txtSenha");
                
                var perfil = moo.view().base.input(objUsuario.txPerfil,
                    ["type='radio'", "name='perfil'", "value='" + objUsuario.txPerfil + "'", "checked"], "");
                moo.server.fragment.loadFromText(perfil, objUsuario.txPerfil);
                
                var situacao = moo.view().base.input(objUsuario.stUsuario, ["type='radio'", "name='situacao'", "value='" + objUsuario.stUsuario + "'", "checked"], "");
                moo.server.fragment.loadFromText(situacao, objUsuario.stUsuario);
                
                moo.server.properties.set("alterarUsuario::idUsuario", id);
                
            }, function(err) {
                moo.server.page.load("usuarios/manterUsuarios", "page");
            });
        }
        , alterarUsuario: function(senha, perfil, situacao) {
            
            var id = moo.server.properties.get("alterarUsuario::idUsuario")
            
            moo.services().usuario.alterarUsuario(id, senha, perfil, situacao, function(docs) {
                moo.server.properties.clear();
                moo.server.page.load("usuarios/manterUsuarios", "page");
            }, function(error) {
                var err = moo.view().base.div("err", [], error);
                moo.server.fragment.loadFromText(err, "err");
            });
            
            
        }
    };
    
    return module;
};
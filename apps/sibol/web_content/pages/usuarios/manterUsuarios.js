module.exports = function (moo) {
    'use strict';
    var module = {
        view : {}
        , init : function() {
            moo.services().usuario.listarTodos(function(docs){
                carregarTabelaUsuarios(moo, docs);
            }, function(err){
                console.log(err);
            });
        }
        , digitouTexto: function(campo, texto) {
            moo.services().usuario.listarUsuariosQueComecamCom(campo, texto, function(docs){
                carregarTabelaUsuarios(moo, docs);
            }, function(err){
                console.log(err);
            });
        }
        , mudouCampo: function() {
            moo.server.fragment.loadFromText(moo.view().base.div("tabUsuarios",["class='grid'"],""), "tabUsuarios");
        }
        , exibirAlterarUsuario: function(id) {
            moo.server.page.load("usuarios/alterarUsuario", "page", [id]);
        }
    };
    
    return module;
};

function carregarTabelaUsuarios(moo, docs) {
    moo.server.fragment.loadFromText(moo.view().base.div("tabUsuarios",["class='grid'"],""), "tabUsuarios");
    docs.forEach(function(item, index) {
        moo.server.fragment.addFromText(moo.view().fichaUsuario(item), "tabUsuarios");
    });
}
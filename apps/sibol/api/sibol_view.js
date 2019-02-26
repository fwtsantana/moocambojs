'use strict';

module.exports = function(moo) {    
    var module = {
        base: require("../../../fapi/view")(moo)
        , fichaUsuario: function(objUsuario) {
            
            var editar = module.base.button("", [], "Editar");
            var divActions = module.base.div("", ["class='grid_actions'", "onclick=\"run('exibirAlterarUsuario(\\\'" + objUsuario._id + "\\\')\')\""], editar);

            var email = "<span><label class='grid_label'>E:mail:  </label>" + objUsuario.txEmail + "</span>";
            var dtCadastro = "<span><label class='grid_label'>Data de Cadastro:  </label>" + objUsuario.dtCadastro + "</span>";
            var situacao = "<span><label class='grid_label'>Situação:  </label>" + objUsuario.stUsuario + "</span>";
            var perfil = "<span><label class='grid_label'>Perfil:  </label>" + objUsuario.txPerfil + "</span>";
            
            var divContents = module.base.div("", ["class='grid_contents'"], email + dtCadastro + situacao + perfil);
            
            var divFicha = module.base.div(objUsuario._id, ["class='grid_record'"], divContents + divActions);
            
            return divFicha;
        }
    };
    
    return module;
};
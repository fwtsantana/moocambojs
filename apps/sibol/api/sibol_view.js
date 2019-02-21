'use strict';

module.exports = function(moo) {    
    var module = {
        base: require("../../../fapi/view")(moo)
        , fichaUsuario: function(objUsuario) {
            
            var editar = module.base.button("", ["class='grid_button'"], "Editar");
            var divActions = module.base.div("", ["class='grid_actions'", "onclick=\"alert('ok')\""], editar);
            
            var email = "<span><label>E:mail:  </label>" + objUsuario.txEmail + "</span>";
            var dtCadastro = "<span><label>Data de Cadastro:  </label>" + objUsuario.dtCadastro + "</span>";
            var situacao = "<span><label>Situação:  </label>" + objUsuario.stUsuario + "</span>";
            var perfil = "<span><label>Perfil:  </label>" + objUsuario.perfil + "</span>";
            
            var divContents = module.base.div("", ["class='grid_contents'"], email + dtCadastro + situacao + perfil);
            
            var divFicha = module.base.div(objUsuario._id, ["class='grid_record'"], divContents + divActions);
            
            return divFicha;
        }
    };
    
    return module;
};
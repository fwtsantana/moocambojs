'use strict';

module.exports = function(moo) {    
    var module = {
        base: require("../../../fapi/view")(moo)
        , fichaUsuario: function(objUsuario) {
            var divActions = module.base.div("actions::" + objUsuario._id, ["class='actions'"], "Funções");
            
            return divActions;
        }
    };
    
    return module;
};
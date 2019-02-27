'use strict';

module.exports = function(moo) {
    var modulo = {
        base: require("../../../fapi/util")(moo)
        , obterDataHoraLocal: function() {
            var dataHora = new Date();
            
            dataHora = dataHora = dataHora.getDate().toString().padStart(2, '0') + "/"
                + (dataHora.getMonth() + 1).toString().padStart(2, '0') + "/"
                + dataHora.getFullYear() + " "
                + dataHora.getHours().toString().padStart(2, '0') + ":"
                + dataHora.getMinutes().toString().padStart(2, '0') + ":"
                + dataHora.getSeconds().toString().padStart(2, '0');
            
            return dataHora;
        }
    };
    
    return modulo;
};
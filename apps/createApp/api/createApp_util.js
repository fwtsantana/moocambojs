module.exports = function(moo) {
    var modulo = {
        base : require("../../../fapi/util") (moo)
        , texto: {
            paraNumero: function(str) {
                str = str.replace(/,/g,'.');

                return parseFloat(str);
            }
        }
        , numero: {
            maiorDoQueZero: function(num) {
                num = modulo.texto.paraNumero(num);

                return (num != NaN && num > 0);
            }
        }
    };
    
    return modulo;
};
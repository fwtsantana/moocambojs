'use strict';

const DECIMAL_SIGN = ',';

var $util = {
    getValue: function(elem) {
        var tents = [elem.value, elem.getAttribute('data-value'), elem.textContent];

        var value;
        for (var i=0; i <= tents.length;i++) {
            value = tents[i];

            if (value != undefined) break;
        }

        if(typeof value == "string") {
            value = privatefunctions.prepareStringValue(value);
        }

        return value;
    }
    , getSessionArg: function(index) {
        return sessionStorage.getItem("arg" + index);
    }
    , emptyDiv: function(elemId) {
        var e = document.getElementById(elemId);

        if (e) {
            var newDiv = document.createElement("div");
            newDiv.setAttribute("id", elemId);

            e.parentNode.replaceChild(newDiv, e);
        }
    }
    , inputInteger: {
        handleInput: function(e) {
            var notPermittedKeyArray = "'=qwertyuiop´[asdfghjklç~]\zxcvbnm.;/*-+."
            + "!@#$%*()_+QWERTYUIOP`{ASDFGHJKLÇ^}|ZXCVBNM<>:?"
            + "¬¹²³£¢\§/?€®ŧ←↓→øþ´ªæßðđŋħłº«»©“”nµ·";

            var permittedCodesWordArray = "DeleteHomeEndArrowUpArrowRightArrowDownArrowLeftBackspaceNumpadTab";

            var permitCodes = (permittedCodesWordArray.indexOf(e.code) > -1)
                            || (e.code.indexOf("Numpad") > -1)
                            || (e.code.indexOf("Digit") > -1);

            var notPermitted = ((!permitCodes)
                || (notPermittedKeyArray.indexOf(e.key) > -1)
            );

            if (notPermitted) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }
    }
    , inputDecimal: {
        formatInput: function(e) {

            var texto = e.target.value;

            if (texto === DECIMAL_SIGN) {
                texto = "0";
            } else {
                texto = e.target.value.replace(/\,/g,".");
            }

            texto = new Intl.NumberFormat("pt-BR", {minimumFractionDigits:2}).format(texto);

            e.target.value = texto;

        }
        , handleInput: function(e) {
            var isDecimalSign = (e.code === "Comma" ||  e.code === "NumpadDecimal");

            var notPermittedKeyArray = "'=qwertyuiop´[asdfghjklç~]\zxcvbnm.;/*-+."
            + "!@#$%*()_+QWERTYUIOP`{ASDFGHJKLÇ^}|ZXCVBNM<>:?"
            + "¬¹²³£¢\§/?€®ŧ←↓→øþ´ªæßðđŋħłº«»©“”nµ·";

            var permittedCodesWordArray = "DeleteHomeEndArrowUpArrowRightArrowDownArrowLeftCommaBackspaceNumpadDecimalTab";

            var permitCodes = (permittedCodesWordArray.indexOf(e.code) > -1)
                            || (e.code.indexOf("Numpad") > -1)
                            || (e.code.indexOf("Digit") > -1);

            var notPermitted = (
                (isDecimalSign && e.target.value.split(DECIMAL_SIGN).length > 1) //Permitir apenas um sinal de decimal
                || (!permitCodes)
                || (notPermittedKeyArray.indexOf(e.key) > -1)
            );

            if (notPermitted) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }
    }
    , notification: {
        remove: function() {
            'use strict';

            var notif = document.getElementById("notification");
            if (notif) {
                notif.parentElement.removeChild(notif);
            }
        }
    }
}
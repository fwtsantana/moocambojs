module.exports = {
    date: {
        getLastDayOfMonth: function(mes, ano) {
            'use strict';
            
            var dt = new Date();
            dt.setDate(1);
            dt.setFullYear(ano);
            dt.setMonth(mes);
            dt.setHours(-24);
            return dt.getDate();
        }
        , getWeekdayPosition: function(dia, mes, ano) {
            'use strict';
            
            var dt = new Date();
            dt.setDate(dia);
            dt.setMonth(mes - 1);
            dt.setFullYear(ano);
            
            return dt.getDay();
        }
    }
    , email: {
        validate: function(strEmail){
            'use strict';
            
            var regEx = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            return regEx.test(strEmail);
        }
    }
    , array: {
        toDataArray: function(simpleArray) {
            'use strict';
            
            var newDataArray = [];
            
            for(var i in simpleArray) {
                var registro = [];
                for(var j in simpleArray[i]) {
                    registro.push({value:simpleArray[i][j]});
                }
                newDataArray.push(registro);
            }
            return newDataArray;
        }
    }
    , string: {
        isEmpty : function(str) {
            if (!str) return true;
            
            return (str+"").trim().length == 0;
        }
    }
    , boolean: {
        fromStringBooleanToBitValue: function(strBoolean) {
            if (strBoolean == "true") {
                return 1;
            } else {
                return 0;
            }
        }
    }
    , ui: {
        emptyDiv: function(ctx, elemId, ui) {
            'use strict';
            
            ctx.loadFragment(ui.div(elemId,[],""), "replace", elemId);
        }
    }
}
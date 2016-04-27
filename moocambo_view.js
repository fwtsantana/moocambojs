module.exports = function(ctx) {
    var modulo = {
        select: function(elemId, elemAttr, elemContents) {
            return createElem("select", elemId, elemAttr, elemContents);
        }
        , div: function(elemId, elemAttr, elemContents) {
            return createElem("div", elemId, elemAttr, elemContents);
        }
        , label: function(elemId, elemAttr, elemContents) {
            return createElem("label", elemId, elemAttr, elemContents);
        }
        , span: function(elemId, elemAttr, elemContents) {
            return createElem("span", elemId, elemAttr, elemContents);
        }
        , input: function(elemId, elemAttr, elemContents) {
            return createElem("input", elemId, elemAttr, elemContents);
        }
        , a: function(elemId, elemAttr, elemContents) {
            return createElem("a", elemId, elemAttr, elemContents);
        }
        , button: function(elemId, elemAttr, elemContents) {
            return createElem("button", elemId, elemAttr, elemContents);
        }
        , json: {
            select: function(elemId, dataArray) {
                'use strict';
                
                if (dataArray == null) return this.select(elemId, {}, "");
                
                var content = "";
                
                for(var i = 0; i < dataArray.length; i++){
                    
                    var obj = dataArray[i];
                    
                    content += "<option value='" + obj[Object.keys(obj)[0]] + "'>" + obj[Object.keys(obj)[1]] + "</option>";
                }

                return modulo.select(elemId, [], content);
            }
        }
    }
    
    return modulo;
}

//**********************************************************************************************************

function createElem(elemTag, elemId, elemAttr, elemContents) {
    var elemStr = "<#tag# #id# #attr#>#contents#</#tag#>";
    
    if (elemId.length > 0)
        elemStr = elemStr.replace(/#id#/g, "id='" + elemId + "'");
    else
        elemStr = elemStr.replace(/#id#/g, "");
    
    elemStr = elemStr.replace(/#tag#/g, elemTag);
    elemStr = elemStr.replace(/#attr#/g, elemAttr.join(" "));
    elemStr = elemStr.replace(/#contents#/g, elemContents);
    
    return elemStr;
}
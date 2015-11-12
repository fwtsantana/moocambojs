module.exports = {
    select: function(idObjeto, arrayDados) {
        var ret = "<select id='" + idObjeto + "'>";

        for(var i=0; i<arrayDados.length; i++) {
            ret += "<option value='" + arrayDados[i][0].value + "'>" + arrayDados[i][1].value + "</option>";
        }
        ret += "</select>";
        
        return ret;
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
    
}

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

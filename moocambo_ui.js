module.exports = {
    mongodb:{
        select: function(elemId, elemAttr, data) {
            
            if (data == null) return this.select(elemId, elemAttr, "");
            
            var content="";
            for(var i=0; i< Object.keys(data).length; i++) {
                content += "<option value='" + data[i][0].value + "'>" + data[i][1].value + "</option>";
            }
            
            return this.select(elemId, elemAttr, content);
        }
    }
    , select: function(elemId, elemAttr, elemContents) {
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
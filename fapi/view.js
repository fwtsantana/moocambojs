'use strict';

module.exports = function(moo) {
    var module = {
        form: function(elemId, elemAttr, elemContents) {
            return createElem("form", elemId, elemAttr, elemContents);
        }
        , fieldset: function(elemId, elemAttr, elemContents) {
            return createElem("fieldset", elemId, elemAttr, elemContents);
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
        , dateInput: function (elemId) {
            var currentDate = moo.util().base.date.getCurrentDateYYYYMMDD();
            return module.input(elemId, ["type='date'","min='2000-01-01'", "max='3000-01-01'", "value='" + currentDate + "'" ], "");
        }
        , a: function(elemId, elemAttr, elemContents) {
            return createElem("a", elemId, elemAttr, elemContents);
        }
        , button: function(elemId, elemAttr, elemContents) {
            return createElem("button", elemId, elemAttr, elemContents);
        }
        , field_validator: function(elemId, validationMsg) {
            return module.div(elemId, ["class='field-validator'"], validationMsg);
        }
        , json: {
            select: function(elemId, dataArray, placeholder, attributes) {
                if (dataArray == null) return this.select(elemId, {}, "");
                
                var attr = [];
                if (attributes) {
                    attr = attributes;
                }
                
                var content = "";
                if (placeholder) {
                    content += "<option value='' disabled selected>" + placeholder + "</option>";
                }
                
                for(var i = 0; i < dataArray.length; i++){
                    var obj = dataArray[i];
                    content += "<option value='" + obj[Object.keys(obj)[0]] + "'>" + obj[Object.keys(obj)[1]] + "</option>";
                }
                
                return module.select(elemId, attr, content);
            }
        }
        , messages: {
            notification: function(msg, type) {
                
                var msgElem = module.div("msg_panel", ["class='msg-notification'"], msg);
                
                var hiddenInput = module.input("hidden", ["type='hidden'", "autofocus"], "");
                
                var content = module.div("msg", ["class='notification-panel " + type + "'"], hiddenInput + msgElem);
                
                return module.div("modal", ["class='modal'", "onclick=\"modal.remove('modal', 'main')\"", "onkeydown=\"modal.remove('modal', 'main')\""], content);
            }
        }
    }
    
    return module;
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
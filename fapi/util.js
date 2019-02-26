'use strict';

module.exports = function(moo) {
    var module = {
        date: {
            getLastDayOfMonth: function(mes, ano) {
                var dt = new Date();
                dt.setDate(1);
                dt.setFullYear(ano);
                dt.setMonth(mes);
                dt.setHours(-24);
                return dt.getDate();
            }
            , getWeekdayPosition: function(dia, mes, ano) {
                var dt = new Date();
                dt.setDate(dia);
                dt.setMonth(mes - 1);
                dt.setFullYear(ano);

                return dt.getDay();
            }
            , getCurrentDateYYYYMMDD: function() {
                return new Date().toISOString().split("T")[0];
            }
        }
        , email: {
            validate: function(strEmail){
                var regEx = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
                return regEx.test(strEmail);
            }
            , send: function(host, user, pass, from, to, subject, content, isContentHTML, onSuccess, onError) {
                var smtpConfig = {
                    host: host,
                    port: 465,
                    secure: true, // use SSL
                    auth: {
                        user: user,
                        pass: pass,
                    }
                };

                var nodemailer = require('nodemailer');

                var transporter = nodemailer.createTransport(smtpConfig);

                var mailOptions = {
                    from: from,
                    to: to,
                    subject: subject
                };

                if (isContentHTML) {
                    mailOptions.html = content;
                } else {
                    mailOptions.text = content;
                }

                transporter.sendMail(mailOptions, function(err, info){
                    if(err){
                        return onError(err);
                    } else {
                        return onSuccess(info);
                    }
                });
            }
        }
        , array: {
            toDataArray: function(simpleArray) {
                var newDataArray = [];

                for(var i in simpleArray) {
                    var record = [];
                    for(var j in simpleArray[i]) {
                        record.push({value:simpleArray[i][j]});
                    }
                    newDataArray.push(record);
                }
                return newDataArray;
            }
        }
        , string: {
            isEmpty : function(str) {

                if (!str) return true;

                return (str+"").trim().length == 0;
            }
            , zeroOrEmpty: function(str) {

                if (this.isEmpty(str)) {
                    str = "0";
                }

                return (parseInt(str) == 0);
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
        , random: {
            generateRandomNumber: function(tamanho) {
                var crypto = require('crypto'),
                    biguint = require('biguint-format');

                return biguint(crypto.randomBytes(tamanho), 'dec');
            }
        }
        , filesystem: {
            createDir: function(parentPath, dirName, onError, onSuccess) {
                var fs = require('fs');

                fs.mkdir(parentPath + "/" + dirName, {recursive: true}, (err) => {
                    if (err) {
                        return onError(err);
                    } else {
                        return onSuccess(parentPath + "/" + dirName);
                    }
                });
            }
            , createFile: function(parentPath, fileName, data, onError, onSuccess) {
                var fs = require('fs');
                
                fs.writeFile(parentPath + '/' + fileName, data, (err) => {
                    if (err) throw err;

                    onSuccess();
                });
            }
        }
        , messages: {
            notify: function(msg, tipoMsg) {
                
                var notification = moo.view().base.messages.notification(msg,tipoMsg);
                
                console.log("Notification = " + notification);
                
                moo.server.fragment.addFromText(notification, "main");
            }
            , interact: function(msg, tipoMsg, funcaoPositiva, funcaoNegativa) {


                if(funcaoNegativa) {
                    funcaoNegativa = ", '" + funcaoNegativa + "'";
                } else {
                    funcaoNegativa = ", undefined";
                }

                var parent = "main";

                moo.server.page.load("web_content/pages/dialogo", "add", parent 
                    , "'" + msg + "', '" + tipoMsg + "', '" + funcaoPositiva + "'" + funcaoNegativa + ", '" + parent + "'");
            }
        }
    }
    return module;
}
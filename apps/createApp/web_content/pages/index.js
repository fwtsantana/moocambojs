module.exports = function (moo) {
    
    var module = {
        init: function() {
            console.log("Load index");
            
            var onclick = "onclick=\"run('create($util.getValue(txtWorkspaceDir), $util.getValue(txtAppName))')\"";
            
            var button = moo.view().base.button("btnCreateApp", [onclick], "CREATE");

            var fieldset = moo.view().base.fieldset("fdsCreateApp", [], formFieldWorkspaceDir(moo) + formFieldAppName(moo) + formFieldFirstPage(moo) + button);
            
            var form = moo.view().base.form("frmCreateApp", [], fieldset);
            
            moo.server.fragment.loadFromText(form, "form");
        }
        , create: function(workspaceDir, appName) {
            const fs = require("fs");
            
            appName = appName.toLowerCase();
            
            var onError = function(err) {
                moo.util().base.messages.notify(err, "error");
            };
            
            var mkdir = moo.util().base.filesystem.createDir;
            
            mkdir(workspaceDir, appName, onError, (path) => {
                console.log("Created root directory of " + appName + " application.");
                
                const createFile = moo.util().base.filesystem.createFile;
                const pathResolve = require("path");
                const firstPage = "index";
                
                var htmlData = fs.readFileSync(pathResolve.resolve(__dirname, "../templates/app.html"), 'utf-8');
                const capitalizedAppName = appName.charAt(0).toUpperCase() + appName.slice(1);
                htmlData = htmlData.replace(/#capitalizedAppName#/g, capitalizedAppName);
                htmlData = htmlData.replace(/#appName#/g, appName);
                htmlData = htmlData.replace(/#firstPage#/g, firstPage);
                createFile(workspaceDir + '/' + appName, appName + ".html", htmlData, onError, () => {
                    console.log("Created main html file.");
                });
                
                var jsData = fs.readFileSync(pathResolve.resolve(__dirname, "../templates/app.js"), 'utf-8');
                jsData = jsData.replace(/#appName#/g, appName);
                createFile(workspaceDir + '/' + appName, appName + ".js", jsData, onError, () => {
                    console.log("Created main javascript file.");
                });
                
                var configData = fs.readFileSync(pathResolve.resolve(__dirname, "../templates/config.json"), 'utf-8');
                createFile(workspaceDir + '/' + appName, "config.json", configData, onError, () => {
                    console.log("Created app config file.");
                });
                
                fs.copyFile(pathResolve.resolve(__dirname, "../templates/favicon.ico"), workspaceDir + '/' + appName + '/favicon.ico', (err) => {
                    if (err) throw err;
                    console.log("Created application's favorite icon. (default moo icon)");
                });
                
                mkdir(path, "api", onError, (path) => {
                    console.log("Created 'api' subdirectory.");
                    
                    var servicesJsData = fs.readFileSync(pathResolve.resolve(__dirname, "../templates/app_services.js"), 'utf-8');
                    servicesJsData = servicesJsData.replace(/#appName#/g, appName);
                    createFile(path, appName + "_services.js", servicesJsData, onError, () => {
                        console.log("Created application's service layer javascript file.");
                    });
                    
                    var utilJsData = fs.readFileSync(pathResolve.resolve(__dirname, "../templates/app_util.js"), 'utf-8');
                    createFile(path, appName + "_util.js", utilJsData, onError, () => {
                        console.log("Created application's utility layer javascript file.");
                    });
                    
                    var viewJsData = fs.readFileSync(pathResolve.resolve(__dirname, "../templates/app_view.js"), 'utf-8');
                    createFile(path, appName + "_view.js", viewJsData, onError, () => {
                        console.log("Created application's view layer javascript file.");
                    });
                });

                mkdir(path, "services", onError, (path) => {
                    console.log("Created 'services' subdirectory.");
                });

                mkdir(path, "web_content", onError, (path) => {
                    console.log("Created 'web_content' subdirectory.");

                    mkdir(path, "fonts", onError, (path) => {
                        console.log("Created 'fonts' subdirectory.");
                    });

                    mkdir(path, "fragments", onError, (path) => {
                        console.log("Created 'fragments' subdirectory.");
                    });

                    mkdir(path, "images", onError, (path) => {
                        console.log("Created 'images' subdirectory.");
                    });
                    
                    mkdir(path, "css", onError, (path) => {
                        console.log("Created 'css' subdirectory.");
                        
                        var cssData = "/* Enter the CSS of your application here. */";
                        createFile(path, appName + ".css", cssData, onError, () => {
                            console.log("Created main css file.");
                        });
                    });
                    
                    mkdir(path, "pages", onError, (path) => {
                        console.log("Created 'pages' subdirectory.");
                        
                        var firstPageHtmlData = fs.readFileSync(pathResolve.resolve(__dirname, "../templates/firstPage.html"), 'utf-8');
                        firstPageHtmlData = firstPageHtmlData.replace(/#capitalizedAppName#/g, capitalizedAppName);
                        createFile(path, firstPage + ".html", firstPageHtmlData, onError, () => {
                            console.log("Created first page html.");
                        });
                        
                        var firstPageJsData = fs.readFileSync(pathResolve.resolve(__dirname, "../templates/firstPage.js"), 'utf-8');
                        createFile(path, firstPage + ".js", firstPageJsData, onError, () => {
                            console.log("Created first page javascript.");
                        });
                    });
                });

                moo.util().base.messages.notify("Project created!", "success");
            });
        }
    };
        
    return module;
};

function formFieldWorkspaceDir(moo) {
    var label = moo.view().base.label("lblWorkspaceDir", ["for='txtWorkspaceDir'", "class='" + moo.config.getLocal("theme") + " label'"], "Workspace Directory");
    var input = moo.view().base.input("txtWorkspaceDir", ["type='text'", "disabled", "value='C:/Temp'", "class='" + moo.config.getLocal("theme") + " input'"], "");
    var div = moo.view().base.div("divWorkspaceDir", [], label + input);
    
    return div;
}

function formFieldAppName(moo) {
    var label = moo.view().base.label("lblAppName", ["for='txtAppName'", "class='" + moo.config.getLocal("theme") + " label'"], "Application Name");
    var input = moo.view().base.input("txtAppName", ["type='text'", "autofocus", "class='" + moo.config.getLocal("theme") + " input'"], "");
    var div = moo.view().base.div("divAppName", [], label + input);
    
    return div;
}

function formFieldFirstPage(moo) {
    var label = moo.view().base.label("lblFirstPage", ["for='txtFirstPage'", "class='" + moo.config.getLocal("theme") + " label'"], "First Page");
    var input = moo.view().base.input("txtFirstPage", ["type='text'", "disabled", "value='index.html'", "class='" + moo.config.getLocal("theme") + " input'"], "");
    var div = moo.view().base.div("divFirstPage", [], label + input);
    
    return div;
}
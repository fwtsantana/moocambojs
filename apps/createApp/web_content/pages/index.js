module.exports = function (moo) {
    var module = {
        view: {}
        , init: {}
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
                
                var cssData = "/* Enter the CSS of your application here. */";
                createFile(workspaceDir + '/' + appName, appName + ".css", cssData, onError, () => {
                    console.log("Created main css file.");
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
    
    module.init = function() {
        console.log("Load index");
    }; 
    
    return module;
};
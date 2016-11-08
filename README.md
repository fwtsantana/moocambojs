# MoocamboJS
web framework (websocket + nodejs)

Moocambo Server Prototype (<b>server.js</b>): Javascript websocket server prototype.

Moocambo Server (<b>moocambo.js</b>): server-side javascript that enables websockets connections. It has the following important elements:
- app: object that represents the application activated by NodeJS
- initFunction: the name of the initialization function executed each time an HTML page is loaded
- pageDir: pages directory
- fragmentDir: fragment directory
- host: defines the host in which the server is executed

When a connection is done, the corresponding application is loaded (if not already loaded)
and a context object (ctx) is associated to the new user session. The context object (ctx) has the following main functions:
- loadPage: loads an HTML page and its corresponding code behind (same name JS file), executing the initFunction
- loadFragment: loads an HTML fragment without loading a code behind. 
- executeJS: loads an JS file and executes the specified function.
- log: logs to the console.


Moocambo (<b>moocambo.js</b>): client-side javascript intended to communicate to the server using the following operations:
- connect: establishes the connection with the moocambo websocket server
- addHtml: appends an HTML file content (fragment) to the element specified
- replaceHtml: replaces the element specified with an HTML file content (fragment)
- executeJS: execute functions on remotes javascript files

Moocambo View (<b>moocambo_view.js</b>): UI functions and objects used by an application.

Moocambo Data (<b>moocambo_data.js</b>): Data functions and objects used by an application.

Moocambo Util (<b>moocambo_util.js</b>): Utility functions and objects used by an application.

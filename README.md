# MoocamboJS
web framework (websocket + nodejs)

Moocambo Server (moocambo_socket.js): server-side javascript that enables websockets connections. It has the following important elements:
- app: object that represents the application activated by NodeJS
- initFunction: the name of the initialization function executed each time an HTML file or fragment is returned
- host: defines the host in which the server is executed

When a connection is done, the corresponding application is loaded (if not already loaded)
and a context object (ctx) is associated to the new connection user. 


Moocambo (moocambo.js): client-side javascript intended to communicate to the server using the following operations:
- connect: establishes the connection with the moocambo websocket server
- addHtml: appends an HTML file content (fragment) to the element specified
- replaceHtml: replaces the element specified with an HTML file content (fragment)
- executeJS: execute functions on remotes javascript files

# MoocamboJS
Framework SPA (nodejs + websocket)

Moocambo Server Prototype (<b>server.js</b>): Javascript websocket server prototype.

Moocambo Server (<b>moocambo.js</b>): server-side javascript that enables websockets connections. It has the following important elements:
- app: object that represents the application activated by NodeJS
- initFunction: the name of the initialization function executed each time an HTML page is loaded
- pageDir: pages directory
- fragmentDir: fragment directory
- host: defines the host in which the server is executed


When a connection is done, the corresponding application is loaded (if not already loaded)
and a context object (ctx) is associated to the new user session. The context object (ctx) has the following main functions:
- loadPage: loads an HTML page and its corresponding code behind (same name JS file), executing the initFunction. It also defines the specified page as the current one.
- addPage: adds an HTML page into an specified parent element and its corresponding code behind (same name JS file), executing the initFunction. It also defines the specified page as the current one.
- loadFragment: loads an HTML fragment file content without loading a code behind.
- addFragment: adds an HTML fragment file content into an specified parent element, without loading a code behind.
- loadFragmentFromText: loads an HTML fragment text without loading a code behind.
- addFragmentFromText: adds an HTML fragment text into an specified parent element, without loading a code behind.
- executeJS: loads an JS file and executes the specified function.
- log: logs to the console.


Moocambo connector (<b>connector.js</b>): client-side javascript intended to connect to the server using the following operations:
- connect: establishes the connection with the moocambo websocket server.
- $: executes a remote javascript function contained in the code behind.

Moocambo FAPI (Framework API):
- Data (<b>data.js</b>): generic data functions and objects.
- Util (<b>util.js</b>): generic utility functions and objects.
- View (<b>view.js</b>): generic UI functions and objects.

# MoocamboJS
Framework SPA (nodejs + websocket)

Moocambo Server Prototype (<b>core/websocket_connection.js</b>): javascript websocket connection prototype.

Core API (<b>core/websocket_api.js</b>): main functions to interact with the server.

Global server configuration file (<b>core/config.json</b>): global configuration file.

Moocambo Server (<b>moocambo_init.js</b>): server-side javascript that initiates the web server via NodeJS.

Moocambo connector (<b>client/moocambo.js</b>): client-side javascript intended to connect to the server using the following elements:
- $server (<b>client/server.js</b>): interacts with the web server through the following operations:
  - connect: establishes the connection with the moocambo websocket server.
  - run: executes a server-side code-behind javascript function.
- $util (<b>client/util.js</b>): generic client-side utility functions, regardless of the application.

Moocambo FAPI (Framework API):
- Data (<b>fapi/data.js</b>): generic data functions and objects.
- Util (<b>fapi/util.js</b>): generic utility functions and objects.
- View (<b>fapi/view.js</b>): generic UI functions and objects.

When a connection is done, the corresponding application is loaded (if not already loaded) and a context object (moo) is associated to the new user session. The context object (moo) has the core api functions and a session's application object.

## Usage (Microsoft Windows)

- Download the Moocambo Project (unzip, if necessary)
- Enter the shell/command prompt
- Go to the moocambo project folder
- type 'node moocambo_init' (make sure NodeJS is installed)
- Create folder Temp in C: (if not already exists)
- Open any browser
- type url 'http://localhost:9999/CreateApp'
- type an example application name, say, 'helloworld', in the specified field
- Copy folder 'C:\Temp\helloworld' to '<moocambo project folder>\apps'
- Open new tab in the browser
- type url 'http://localhost:9999/helloworld'
- Congrats for the first application running on Moocambo!

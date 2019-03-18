# moocambojs
web framework javascript (websocket + nodejs)

MoocamboJS is a simple web SPA (single page application) that uses Websockets and NodeJS. It allows fast bidirectional client-server communication without the use of AJAX. Although developers can use other complementary frameworks altogether, MoocamboJS was made to improve performance in development process, using only the must-know technologies (HTML, Javascript, CSS) necessary for web development.

In order to create a new web application, after clone or download the project, open "http://localhost:9999/createApp". Define the workspace directory and the application name, then click on CREATE. It will be created the new project structure, as explained below:
- <b>api</b>: application programming interfaces layers for the app (services, util and view).
- <b>services</b>: put the service layer javascripts here.
- <b>web_content/css</b>: put css of the app here.
- <b>web_content/fonts</b>: put fonts of the app here.
- <b>web_content/fragments</b>: html fragments used for reutilization of components across pages of the app.
- <b>web_content/images</b>: put images of the app here.
- <b>web_content/pages</b>: put the pages of the app here.
- <b>config.json</b>: configuration file for the app.
- <b>\<appname\>.html</b>: page used for connection with websocket protocol (do not change it, unless you're going to use complementary technologies like Angular, Bootstrap etc)
- <b>\<appname\>.js</b>: code-behind used with the page above (do not change it!)

The first page created is placed in "web_content/pages/index.html". You can change it to do whatever you need the page to do, or navigate to another pages in "web_content/pages".
Be sure that every page has its corresponding javascript code-behind.
You may call the following functions within the pages:
- <b>connect</b>: connects to websocket protocol. Although you can use it, it is not needed, because it's used only once.
- <b>run</b>: call a javascript function defined in the corresponding code-behind.
- <b>redirect</b>: redirects to another page.
- <b>refresh</b>: redirects to the same page (used to "refresh" the page)


Every javascript code-behind uses the "moo" parameter as a context/session variable, as shown below:

```
  module.exports = function (moo) {
    var module = {
        init: function() {
        }
    }
    return module;
  };
  
```

The "moo" context/session variable brings a lot of global functionalities, as defined in "core/websocket_api.js". In fact, it is responsable for all the "magic" in the framework!

The "init()" function does the initial work when opening the page.

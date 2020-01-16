require('dotenv').config({ silent: true });

const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const http = require('http');

const moment = require('moment-timezone');
moment.tz.setDefault('UTC');

const serialize = require('serialize-javascript');

app.use('/public', express.static(path.join(__dirname, 'public')));

let events = [
  { description: 'Random event 1', date: moment('2020-01-06', 'YYYY-MM-DD') },
  { description: 'Random event 2', date: moment('2020-01-15', 'YYYY-MM-DD') },
  { description: 'Random event 3', date: moment('2020-02-14', 'YYYY-MM-DD') }
];

let renderer;

if (process.env.NODE_ENV === 'production') {
  let bundle = fs.readFileSync('./dist/node.bundle.js', 'utf8');
  renderer = require('vue-server-renderer').createBundleRenderer(bundle);
  app.use('/dist', express.static(path.join(__dirname, 'dist')));
}


//Note: app.get() and app.post() use the Express framework to repond to requests from the client

//send template file back as the reponse from a http get request having no path
app.get('/', (req, res) => {
  let template = fs.readFileSync(path.resolve('./index.html'), 'utf-8');

  //replace the APP marker in index.html template with a script containing an initial events array!
  let contentMarker = '<!--APP-->';
  if(renderer){
    renderer.renderToString({ events }, (err, html) => {
      if (err) {
        console.log(err);
      } else {
        console.log(html);
        res.send(template.replace(contentMarker, `<script>var __INITIAL_STATE__ = ${ serialize(events) }</script>\n${html}` ) ); 
      }
    });
  } else {
    res.send('<p>Awaiting compilation...</p><script src="/reload/reload.js"></script>');
  }
  

});


// require() is not part of the standard JavaScript API. But in Node.js, it's a built-in function with a special purpose: to load modules.
// require() reads a JavaScript file, executes the file, and then proceeds to return the module's exports object

//using Express we can use a parser that allows us to parse the incoming request body as json
app.use(require('body-parser').json());

//we added below code to handle post requests from our front end Vue App
app.post('/add_event', (req, res) => {
  events.push({
    description: req.body.description,
    date: moment(req.body.date)
  });
  res.sendStatus(200);
});

const server = http.createServer(app);

//if in development mode use the "reload" module
if (process.env.NODE_ENV === 'development') {
  const reload = require('reload');
  const reloadServer = reload(app);
  require('./webpack-dev-middleware').init(app);
  require('./webpack-server-compiler').init(function(bundle) {
    let needsReload = (renderer === undefined);
    renderer = require('vue-server-renderer').createBundleRenderer(bundle);
    if (needsReload) {
      reloadServer.reload();
    }
  });
}

server.listen(process.env.PORT, function () {
  console.log(`Example app listening on port ${process.env.PORT}!`);
  if (process.env.NODE_ENV === 'development') {
    require("opn")(`http://localhost:${process.env.PORT}`);
  }
});

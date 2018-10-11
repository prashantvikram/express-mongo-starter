var app = require("./app");
const http = require("http");
const port = require("./env-config").port;

app.set('port', port);
var server = http.createServer(app);
server.listen(port);

server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  console.error(error)
}

function onListening() {
  console.log('Listening on ' + server.address().port);
}
/*eslint no-undef: "error"*/
/*eslint-env node*/
var WebSocket = require("ws");
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
  port: port
});
var topic;
var messages = [];
console.log("websockets server started");

ws.on("connection", function (socket) {
  console.log("client connection established");
  if (topic) {
    socket.send("***topic is" + " '" + topic + "'");
  }

  messages.forEach(function (msg) {
    socket.send(msg);
  });

  socket.on("message", function (data) {
    console.log("message received: " + data);
    messages.push(data);
    ws.clients.forEach(function (clientSocket) {
      if (data.substring(0, 6) == "/topic") {
        clientSocket.send("*** Topic has changed to" + " '" + data.substring(7) + "'");
        topic = data.substring(7);
      } else {
        clientSocket.send(data);
      }
    });
  });
});
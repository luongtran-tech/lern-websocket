const { Server } = require("socket.io");
const { createClient } = require("redis");
const { createServer } = require("https");
const { createAdapter } = require("@socket.io/redis-adapter");
const { Emitter } = require("@socket.io/redis-emitter");
const express = require("express");
const { readFileSync } = require("fs");
const cors = require("cors");
const app = express();

app.use(cors());

const httpsServer = createServer(
  {
    key: readFileSync("./key.pem", "utf8"),
    cert: readFileSync("./cert.pem", "utf8"),
  },
  app
);

const io = new Server(httpsServer, {
  cors: { origin: "https://localhost:6868", credentials: true },
});

//config redis

const pubClient = createClient({ host: "localhost", port: 6379 });
const subClient = pubClient.duplicate();

// Sử dụng Redis Adapter cho Socket.IO
// io.adapter(createAdapter(pubClient, subClient));
Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
});

const emitter = new Emitter(pubClient);

io.on("connection", (socket) => {
  socket.on("chat_message", (msg) => emitter.emit("chat_message", msg));
});

//start server
const port = 6868;
app.get("/", (req, res, next) => {
  res.send("hello world");
});
httpsServer.listen(port, () => console.log("server listening on port", port));

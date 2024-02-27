const express = require("express");
const { createServer } = require("node:https");
// const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const { message } = require("./service/chat.service");
const helmet = require("helmet");
const { readFileSync } = require("fs");
const app = express();

const httpsServer = createServer(
  {
    key: readFileSync("./key.pem", "utf8"),
    cert: readFileSync("./cert.pem", "utf8"),
  },
  app
);
// const server = createServer(app);
//websocket
/**
 * Connection state recovery
    const io = new Server(server, { connectionStateRecovery: {} });
 * This feature will temporarily store all the events that are sent by the server and will try to restore the state of a client when it reconnects:
   - restore its rooms
   - send any missed events 
 */

// const io = new Server(server);
const io = new Server(httpsServer, {
  cors: { origin: "https://localhost:6969", credentials: true },
});

async function main() {
  //open the database file
  // const db = await open({
  //   filename: "chat.db",
  //   driver: sqlite3.Database,
  // });
  // create our 'messages' table (you can ignore the 'client_offset' column for now)
  // await db.exec(`
  //   CREATE TABLE IF NOT EXISTS messages (
  //       id INTEGER PRIMARY KEY AUTOINCREMENT,
  //       client_offset TEXT UNIQUE,
  //       content TEXTs
  //   );
  // `);
  // await db.exec(`
  //   CREATE TABLE IF NOT EXISTS notification (
  //       id INTEGER PRIMARY KEY AUTOINCREMENT,
  //       client_offset TEXT UNIQUE,
  //       content TEXT
  //   );
  // `);

  //check middleware
  // io.engine.use(helmet());
  // io.engine.use((req, res, next) => {
  //   // do something
  //   console.log("log", req._query.sid);
  //   next();
  // });
  // //check auth
  // io.use((socket, next) => {
  //   const token = socket.handshake.auth.token;
  //   if (token) {
  //     next();
  //   } else {
  //     const err = new Error("not auth");
  //     err.data = { content: "please retry later" };
  //     next(err);
  //   }
  // });

  // io.on("connection", async (socket) => {
  //   console.log("a user connect");
  //   socket.on("chat message", async (msg, clientOffset, callback) => {
  //     let result;
  //     // console.log("log", await io.fetchSockets());
  //     try {
  //       // store the message in the database
  //       result = await db.run(
  //         "INSERT INTO messages (content) VALUES (?)",
  //         msg
  //         // clientOffset
  //       );
  //     } catch (error) {
  //       // TODO handle the failure
  //       if (error.errno === 19 /* SQLITE_CONSTRAINT */) {
  //         console.log("here", error);
  //         // the message was already inserted, so we notify the client
  //         callback();
  //       } else {
  //         // nothing to do, just let the client retry
  //       }
  //       return;
  //     }
  //     console.log(result);
  //     socket.emit("chat message", msg, result.lastID);
  //     // acknowledge the event
  //     callback();
  //   });
  //   socket.on("notification", async (msg, callback) => {
  //     let result;
  //     try {
  //       // store the notification in the database
  //       result = await db.run(
  //         "INSERT INTO notification (content) VALUES (?)",
  //         msg
  //       );
  //     } catch (error) {
  //       if (error.errno === 19 /* SQLITE_CONSTRAINT */) {
  //         console.log("here", error);
  //         // the notification was already inserted, so we notify the client
  //         callback();
  //       } else {
  //         // nothing to do, just let the client retry
  //       }
  //       return;
  //     }
  //     io.emit("notification", msg, result.lastID);
  //     // acknowledge the event
  //     callback();
  //   });
  //   if (socket.recovered) {
  //     console.log("object");
  //   }
  //   if (!socket.recovered) {
  //     console.log("here");
  //     // if the connection state recovery was not successful
  //     try {
  //       await db.each(
  //         "SELECT id, content FROM messages WHERE id > ?",
  //         [socket.handshake.auth.serverOffset || 0],
  //         (_err, row) => {
  //           socket.emit("chat message", row.content, row.id);
  //         }
  //       );
  //       await db.each(
  //         "SELECT id, content FROM notification WHERE id > ?",
  //         [socket.handshake.auth.serverOffset || 0],
  //         (_err, row) => {
  //           socket.emit("notification", row.content, row.id);
  //         }
  //       );
  //     } catch (e) {
  //       // something went wrong
  //     }
  //   }
  // });

  const onConnection = (socket) => {
    console.log("conn");

    message(io, socket);
  };
  io.on("connection", onConnection);
  // io.on("connection", (socket) => {
  //   socket.broadcast.join
  //   socket.on("chat_message", (msg) => {
  //     console.log("message: " + msg);
  //   });
  // });
  app.get("/", (req, res) => res.sendFile(join(__dirname, "./index.html")));

  httpsServer.listen(6969, () => console.log("server running at port 6969"));
}

main();

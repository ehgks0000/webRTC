import { Server } from "./server";

const server = new Server();

server.listen((port) => {
  console.log(`Server is 듣는중 with 젠킨스! 22 ${port}`);
});
//0-----------------
// import express from "express";
// import * as fs from "fs";
// import * as https from "https";
// import * as socketio from "socket.io";
// // import {Server} from "socket.io";

// const credentials = {
//   key: fs.readFileSync("./cert.key"),
//   cert: fs.readFileSync("./cert.crt"),
// };

// const app = express();
// app.use(express.static("../public"));

// // app.get("/", (req: express.Request, res: express.Response) => {
// //   res.json({ "1st": "Asdfasdf" });
// // });

// const httpsServer = https.createServer(credentials, app);

// const port: number = Number(process.env.PORT) || 9999;
// httpsServer.listen(port, () => {
//   console.log(`HTTPS Server is dd running at ${port}!`);
// });

// const io = new socketio.Server(httpsServer);
// io.attach(httpsServer);

// io.sockets.on("connection", (socket) => {
//   console.log("Client connected!");
// });

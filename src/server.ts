import express, { Application } from "express";
import { Server as SocketIOServer } from "socket.io";
// import { createServer, Server as HTTPServer } from "http";
import { Server as HTTPServer, createServer } from "https";
import fs from "fs";
import path from "path";

export class Server {
  private httpServer: HTTPServer;
  private app: Application;
  private io: SocketIOServer;

  private readonly DEFAULT_PORT = 5000;

  private readonly credentials = {
    key: fs.readFileSync("./cert.key"),
    cert: fs.readFileSync("./cert.crt"),
  };

  private configureApp(): void {
    this.app.use(express.static(path.join(__dirname, "../public")));
  }

  constructor() {
    this.initialize();

    this.handleRoutes();
    this.handleSocketConnection();
  }

  private initialize(): void {
    this.app = express();
    this.httpServer = createServer(this.credentials, this.app);
    this.io = new SocketIOServer(this.httpServer);

    this.configureApp();
    this.handleSocketConnection();
  }

  private handleRoutes(): void {
    this.app.get("/", (req, res) => {
      res.send(`<h1>Hello World</h1>`);
    });
  }

  private handleSocketConnection(): void {
    this.io.on("connection", (socket) => {
      //   socket.on("login", (data) => {
      //     console.log(
      //       `클라이언트 로그인 이름: ${data.name} 유저아이디 : ${data.userid}`
      //     );
      //     socket.name = data.name;
      //     socket.userid = data.userid;
      //     this.io.emit("login", data.name);
      //   });

      console.log("Socket connected.");
    });
  }

  public listen(callback: (port: number) => void): void {
    this.httpServer.listen(this.DEFAULT_PORT, () =>
      callback(this.DEFAULT_PORT)
    );
  }
}

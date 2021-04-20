import express, { Application } from "express";
import { Server as SocketIOServer } from "socket.io";
// import { createServer, Server as HTTPServer } from "http";
import { Server as HTTPServer, createServer } from "https";
import fs from "fs";
import path from "path";

interface Credentials {
  key: Buffer;
  cert: Buffer;
}

export class Server {
  private httpServer: HTTPServer;
  private app: Application;
  private io: SocketIOServer;

  private activeSockets: string[] = [];

  private readonly DEFAULT_PORT: number = 5000;

  private readonly credentials: Credentials = {
    key: fs.readFileSync("./cert.key"),
    cert: fs.readFileSync("./cert.crt"),
  };

  private configureApp(): void {
    this.app.use(express.static(path.join(__dirname, "../public")));
  }

  constructor() {
    this.initialize();

    // this.handleRoutes();
    // this.handleSocketConnection();
  }

  private initialize(): void {
    this.app = express();
    this.httpServer = createServer(this.credentials, this.app);
    this.io = new SocketIOServer(this.httpServer, {
      cors: {
        origin: "https://localhost",
        methods: ["GET", "POST"],
        // transports: ["websocket", "polling"],
        credentials: true,
      },
      allowEIO3: true,
    });

    this.configureApp();
    this.handleRoutes();
    this.handleSocketConnection();
  }

  private handleRoutes(): void {
    this.app.get("/", (req, res) => {
      //   res.send(`<h1>Hello World</h1>`);
      res.sendFile("index.html");
    });
  }

  private handleSocketConnection(): void {
    this.io.on("connection", (socket) => {
      const existingSocket = this.activeSockets.find(
        (existingSocket) => existingSocket === socket.id
      );
      if (!existingSocket) {
        this.activeSockets.push(socket.id);

        socket.emit("update-user-list", {
          users: this.activeSockets.filter(
            (existingSocket) => existingSocket !== socket.id
          ),
        });

        socket.broadcast.emit("update-user-list", {
          users: [socket.id],
        });
      }
      socket.on("call-user", (data: any) => {
        socket.to(data.to).emit("call-made", {
          offer: data.offer,
          socket: socket.id,
        });
      });

      socket.on("make-answer", (data) => {
        socket.to(data.to).emit("answer-made", {
          socket: socket.id,
          answer: data.answer,
        });
      });

      socket.on("reject-call", (data) => {
        socket.to(data.from).emit("call-rejected", {
          socket: socket.id,
        });
      });

      socket.on("disconnect", () => {
        this.activeSockets = this.activeSockets.filter(
          (existingSocket) => existingSocket !== socket.id
        );
        socket.broadcast.emit("remove-user", {
          socketId: socket.id,
        });
      });
      console.log("Socket connected.");
    });
  }

  public listen(callback: (port: number) => void): void {
    this.httpServer.listen(this.DEFAULT_PORT, () =>
      callback(this.DEFAULT_PORT)
    );
  }
}

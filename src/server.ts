import express, { Application } from "express";
import { Server as SocketIOServer } from "socket.io";
// import { createServer, Server as HTTPServer } from "http";
import { Server as HTTPServer, createServer } from "https";
import fs from "fs";
import path from "path";
import cors from "cors";
import { v4 as uuidV4 } from "uuid";
import { Users } from "../utils/users";
import { formatMessage } from "../utils/message";

interface Credentials {
  key: Buffer;
  cert: Buffer;
}

export class Server {
  private users: Users;
  //   private message: formatMEssage;
  private httpServer: HTTPServer;
  private app: Application;
  private io: SocketIOServer;

  private readonly DEFAULT_PORT: number = 5000;
  private readonly DEFAULT_URL: string = `https://localhost:${this.DEFAULT_PORT}`;
  private readonly botname: string = "Chat Bot";

  private readonly credentials: Credentials = {
    key: fs.readFileSync("./cert.key"),
    cert: fs.readFileSync("./cert.crt"),
  };

  private configureApp(): void {
    this.app.use(express.static(path.join(__dirname, "../public")));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private readonly socketIoOptions = {
    cors: {
      origin: this.DEFAULT_URL,
      method: ["GET", "POST"],
      credentials: true,
    },
    allowEIO3: true,
  };

  //   private roomList = new Map();
  private roomList: string[] = [];
  private userList: string[] = [];

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    this.app = express();
    this.httpServer = createServer(this.credentials, this.app);
    this.io = new SocketIOServer(this.httpServer, this.socketIoOptions);

    this.configureApp();
    this.handleRoutes();
    this.handleSocketConnection();
  }

  private handleRoutes(): void {
    this.app.get("/", (req, res) => {
      //   res.send(`<h1>Hello World</h1>`);
      res.sendFile("index.html");
      //   res.redirect("")
    });

    this.app.get("/room", (req, res) => {
      res.send({ roomId: uuidV4() });
    });

    // 클라이언트에서 room id와 유저아이디

    // this.app.get("/:room", (req, res) => {
    //   res.render("room", { roomId: req.params.room });
    // });
  }

  private handleSocketConnection(): void {
    this.io.on("connection", (socket) => {
      console.log(`Socket connected.`);

      // 클라 접속 하면
      socket.emit("update-room-list", {
        roomList: this.roomList,
      });

      socket.on("join-room", ({ roomId, userId }) => {
        this.roomList.push(roomId);
        this.userList.push(userId);
        const user = this.users.userJoin(socket.id, userId, roomId);

        socket.join(user.room);

        this.io.emit("update-rooms-list", this.roomList);
        this.io.to(user.room).emit("update-users-list", this.userList);

        socket.emit("message", formatMessage(this.botname, "Welcome to Chat"));

        socket.broadcast
          .to(user.room)
          .emit(
            "message",
            formatMessage(this.botname, `${user.username} 접속 했습니다.`)
          );

        this.io.to(user.room).emit("room-users", {
          room: user.room,
          users: this.users.getRoomUsers(user.room),
        });
        // socket.to(roomId).emit("user-connected", userId);

        // socket.on("disconnect", () => {
        //   socket.to(roomId).emit("user-disconnected", userId);
        // });
      });

      socket.on("chatMessage", (msg) => {
        const user = this.users.getCurrentUser(socket.id);

        this.io
          .to(user.room)
          .emit("message", formatMessage(user.username, msg));
      });

      socket.on("disconnect", () => {
        const user = this.users.userLeave(socket.id);

        if (user) {
          this.io
            .to(user.room)
            .emit(
              "message",
              formatMessage(this.botname, `${user.username}가 떠났습니다.`)
            );
        }

        this.io.to(user.room).emit("room-users", {
          room: user.room,
          users: this.users.getRoomUsers(user.room),
        });
      });
    });
  }

  public listen(callback: (port: number) => void): void {
    this.httpServer.listen(this.DEFAULT_PORT, () =>
      callback(this.DEFAULT_PORT)
    );
  }
}

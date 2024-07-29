// pages/api/socket.js
import { Server } from "socket.io";

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket is already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    cors: {
      origin: "http://localhost:3000", // 클라이언트의 URL
      methods: ["GET", "POST"],
    },
  });

  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log("New user connected");

    socket.on("join", (room) => {
      socket.join(room);
      socket.to(room).emit("user joined", socket.id);
    });

    socket.on("message", (msg) => {
      socket.to(msg.room).emit("message", { user: socket.id, text: msg.text });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  res.end();
}

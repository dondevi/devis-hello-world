/**
 * Socket.io Hello World
 *
 * @author dondevi
 * @create 2017-12-28
 */

const socket = require("socket.io");
const io = socket();

io.sockets.on("connection", socket => {
  console.log("New client connected: ", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected: ", socket.id);
  });
  socket.on("mouse", data => {
    socket.broadcast.emit("mouse", data);
  });
});

io.listen(3000);

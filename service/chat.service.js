module.exports.message = (io, socket) => {
  const rooms = [];
  const newMessage = (payload) => {
    console.log(payload);
  };
  const checkPing = (payload) => {
    console.log(payload);
  };

  socket.on("chat_message", newMessage);
  // socket.on("ping", checkPing);
  socket.prependAny((eventName, ...args) => {
    console.log("args", args, "eventName", eventName);
  });

  socket.on("joinRoom", (roomId, userId) => {
    console.log(roomId, userId);
    socket.join(roomId);
    if (!rooms[roomId]) {
      rooms[roomId] = { owner: userId, members: [] };
    } else {
      rooms[roomId].members[userId] = socket.id;
    }

    console.log(`${userId} joined room ${roomId}`);
    console.log(`rooms`, rooms);
    io.to(roomId).emit("userJoined", userId);
  });
};

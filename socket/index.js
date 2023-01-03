const io = require("socket.io")(8080, {
    cors: {
      origin: "http://localhost:3000",
    },
  });
  
  let users = [];
  
  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };
  
  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };
  
  const getUserById = (userId) => {
    return users.find((user) => user.userId === userId);
  };
  
  io.on("connection", (socket) => {
  
    // add userId and socketId from user
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
    });
  
    // send and post message
    socket.on("sendMessage", ({ senderId, otherUserId, text }) => {
      const user = getUserById(otherUserId);
      console.log(senderId, otherUserId, text)
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    });
  
    //when someone disconnects
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });
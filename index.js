const io = require("socket.io", { transports: ["websocket"] })(
  8900,
  {
    cors: {
      origin: "*",
      credentials: true,
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
    },
  },
);

var  users = [];

const getUserfunc = (userId) => {
  return users.find((user) => {
    return user.userId === userId;
  });
};
const adduser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
  return users
};

//send Message

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {

    adduser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", ({ senderId, recieverId, text }) => {
    console.log("sending inside socked");
    const user = getUserfunc(recieverId);
   // console.log("---->>??????????", recieverId, senderId, text);
    try {
      io.to(socket.id).emit("getMessage", {
        senderId,
        text,
      });
      console.log("running getMwssage emit",senderId,text);
    } catch (err) {
      console.log("-->>", err);
    }
  });

  socket.on("disconnect", () => {
   let totalUsers= removeUser(socket.id);
   console.log('removed',totalUsers)
    io.emit("getUsers", totalUsers);
  });
});

const app = require("express")();
const http = require("http").Server(app);

const cors = require("cors");
app.use(cors());
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const port = process.env.PORT || 3000;

let users = [];
let rooms = [];
let gameStatus = {
  isPlaying: false,
};

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("waitingRoom", (option) => {
    const { game, id, character } = option;
    const existingGame = rooms.find((room) => room.key === game);
    if (!existingGame) {
      rooms.push({ key: game });
    }

    const user = {
      game,
      id,
      character,
      isPlaying: false,
      isOn: false,
    };
    const existingUser = users.find((user) => user.id === id);
    if (existingUser) {
      io.emit("waitingRoom", { status: "FAIL", message: "User aleady taken" });
    } else {
      users.push(user);
      io.emit("waitingRoom", {
        status: "SUCCESS",
        message: "Move to Page",
        key: user.game,
      });
    }
  });

  socket.on("gameRoom", (option) => {
    if (option.action === "CHECK_USERS") {
      io.emit("gameRoom", { action: option.action, users });
    }
    if (option.action === "UPDATE_USERS") {
      option.users.forEach((updateUser) => {
        users.forEach((user) => {
          if (user.id === updateUser.id) {
            user.isOn = true;
          }
        });
      });
    }
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

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

const ROOM = {
  GAME: "GAME_ROOM",
  MOVE: "MOVE_ROOM",
  ITEM: "ITEM_ROOM",
};
// action 또는 room 으로 구분해도 되는데 일단 둘다 구분
const ACTION = {
  JOIN_USER: "JOIN_USER",
  MOVE_CHARACTER: "MOVE_CHARACTER",
  CREATE_STARS: "CREATE_STARS",
  HIT_BOMB: "HIT_BOMB",
  CHECK_USER: "CHECK_USER",
};

let users = [];
let rooms = [];
let gameStatus = {
  isPlaying: false,
};

const handleItem = (option) => {
  const { action, player } = option;
  if (action === ACTION.CREATE_STARS) {
    io.emit(ROOM.ITEM, { status: "SUCCESS", action });
  }
  if (action === ACTION.HIT_BOMB) {
    io.emit(ROOM.ITEM, { status: "SUCCESS", action, player });
  }
};

const handleJoinUser = (option) => {
  const { game, id, action } = option;
  const existingGame = rooms.find((room) => room.key === game);
  if (!existingGame) {
    rooms.push({ key: game });
  }

  const user = {
    game,
    id,
    isPlaying: false,
  };
  const existingUser = users.find((user) => user.id === id);
  if (existingUser) {
    io.emit(ROOM.GAME, { status: "FAIL", message: "User aleady taken" });
  } else {
    users.push(user);
    io.emit(ROOM.GAME, {
      status: "SUCCESS",
      message: "",
      action,
      users,
      user,
    });
  }
};

const handleMoveCharacter = (option) => {
  io.emit(ROOM.MOVE, {
    status: "SUCCESS",
    option,
    action: option.action,
  });
};

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on(ROOM.GAME, (option) => {
    const { action } = option;
    if (action === ACTION.JOIN_USER) {
      handleJoinUser(option);
    }
  });
  socket.on(ROOM.MOVE, (option) => {
    handleMoveCharacter(option);
  });
  socket.on(ROOM.ITEM, (option) => {
    handleItem(option);
  });

  // socket.on("gameRoom", (option) => {
  //   if (option.action === "CHECK_USERS") {
  //     io.emit("gameRoom", { action: option.action, users });
  //   }
  //   if (option.action === "UPDATE_USERS") {
  //     option.users.forEach((updateUser) => {
  //       users.forEach((user) => {
  //         if (user.id === updateUser.id) {
  //           user.isOn = true;
  //         }
  //       });
  //     });
  //   }
  // });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

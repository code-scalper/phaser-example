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
  CHAT: "CHAT_ROOM",
  GAME: "GAME_ROOM",
  MOVE: "MOVE_ROOM",
  WAITING: "WAITING_ROOM",
  ITEM: "ITEM_ROOM",
};
// action 또는 room 으로 구분해도 되는데 일단 둘다 구분
const ACTION = {
  JOIN_USER: "JOIN_USER",
  MOVE_CHARACTER: "MOVE_CHARACTER",
  CREATE_STARS: "CREATE_STARS",
  UPDATE_SCORE: "UPDATE_SCORE",
  HIT_BOMB: "HIT_BOMB",
  CHECK_USER: "CHECK_USER",
  GAME_OVER: "GAME_OVER",
};

const PLAYER_NAMES = {
  player1: "Namgyu",
  player2: "Jaewon",
  player3: "Junwoo",
  player4: "Jin",
  player5: "Seyeon",
};

let users = [];
let usersScore = [];
let rooms = [];
let gameStatus = {
  isPlaying: false,
};
const handleGameOver = (option) => {
  const { action } = option;
  io.emit(ROOM.GAME, { status: "SUCCESS", action, usersScore });
};
const handleCheckUser = (option) => {
  const { action } = option;
  io.emit(ROOM.WAITING, { status: "SUCCESS", users, action });
};
const handleItem = (option) => {
  const { action, player } = option;
  if (action === ACTION.CREATE_STARS) {
    io.emit(ROOM.ITEM, { status: "SUCCESS", action });
  }
  if (action === ACTION.HIT_BOMB) {
    io.emit(ROOM.ITEM, { status: "SUCCESS", action, player });
  }
  if (action === ACTION.UPDATE_SCORE) {
    const target = usersScore.findIndex((user) => user.key === player);

    if (target > -1) {
      usersScore[target].score += 10;
    }
    io.emit(ROOM.ITEM, { status: "SUCCESS", action, usersScore });
  }
};

const handleJoinUser = (option, connId) => {
  const { game, id, action } = option;
  const existingGame = rooms.find((room) => room.key === game);
  if (!existingGame) {
    rooms.push({ key: game });
  }

  const user = {
    game,
    id,
    isPlaying: false,
    connId,
  };
  const existingUser = users.find((user) => user.id === id);
  if (existingUser) {
    io.emit(ROOM.GAME, { status: "FAIL", message: "User aleady taken" });
  } else {
    users.push(user);
    usersScore.push({ key: user.id, label: PLAYER_NAMES[user.id], score: 0 });
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
  socket.conn.on("close", (reason) => {
    io.emit(ROOM.ITEM, {
      status: "SUCCESS",
      action: ACTION.UPDATE_SCORE,
      usersScore,
    });
    const targetIndex = users.findIndex((user) => {
      return user.connId === socket.conn.id;
    });

    if (targetIndex > -1) {
      const user = users[targetIndex];
      const scoreIndex = usersScore.findIndex((score) => score.key === user.id);
      if (scoreIndex > -1) {
        usersScore.splice(scoreIndex, 1);
      }
      users.splice(targetIndex, 1);
    }
  });
  socket.on(ROOM.GAME, (option) => {
    const { action } = option;
    if (action === ACTION.JOIN_USER) {
      handleJoinUser(option, socket.conn.id);
    }
    if (action === ACTION.GAME_OVER) {
      handleGameOver(option);
    }
  });
  socket.on(ROOM.MOVE, (option) => {
    handleMoveCharacter(option);
  });
  socket.on(ROOM.ITEM, (option) => {
    handleItem(option);
  });
  socket.on(ROOM.WAITING, (option) => {
    const { action } = option;
    if (action === ACTION.CHECK_USER) {
      handleCheckUser(option);
    }
  });
  socket.on(ROOM.CHAT, (option) => {
    const { user, message } = option;
    io.emit(ROOM.CHAT, { user, message });
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

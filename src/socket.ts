import { io } from "socket.io-client";
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

let socket;
let option = {};
let _this = null;
let target = { count: 0 };
export const createSocket = (game: string, id: string, obj: any) => {
  socket = io("http://localhost:3000");
  _this = obj;
  option = {
    game,
    id,
    action: ACTION.JOIN_USER,
  };
  socket.emit(ROOM.GAME, option);
  socket.on(ROOM.GAME, (res: any) => {
    const { status, action } = res;
    if (status === "SUCCESS") {
      if (action === ACTION.JOIN_USER) {
        _this.joinUser(res.users);
      }
      // if (action === ACTION.MOVE_CHARACTER) {
      //   console.log(res, "from socket");
      //   _this.moveCharacter(res);
      // }
    } else {
      // do something
    }
  });

  socket.on(ROOM.MOVE, (res: any) => {
    const { status, action } = res;
    if (status === "SUCCESS") {
      if (action === ACTION.MOVE_CHARACTER) {
        _this.moveCharacter(res);
        target.count = 0;
      }
    } else {
      // do something
    }
  });

  socket.on(ROOM.ITEM, (res: any) => {
    const { status, action } = res;
    if (status === "SUCCESS") {
      if (action === ACTION.CREATE_STARS) {
        _this.createStars();
      }
      if (action === ACTION.HIT_BOMB) {
        _this.removePlayer(res.player);
      }
    } else {
      // do something
    }
  });
};

export const moveCharacterSocket = (option, obj) => {
  target = obj;
  option.action = ACTION.MOVE_CHARACTER;
  socket.emit(ROOM.MOVE, option);
  // obj.count = 0;
};

export const createStarsSocket = () => {
  socket.emit(ROOM.ITEM, { action: ACTION.CREATE_STARS });
  // obj.count = 0;
};

export const hitBombSocket = (player) => {
  socket.emit(ROOM.ITEM, { action: ACTION.HIT_BOMB, player });
  // obj.count = 0;
};

// export const joinGameRoom = (obj: any) => {
//   _this = obj;
//   socket.emit("gameRoom", { ...user, action: "CHECK_USERS" });
// };

// socket.on("gameRoom", (res: any) => {
//   if (_this === null) return;
//   if (res.action === "CHECK_USERS") {
//     _this.createPlayers(res.users);
//   }
// });

// export const updateGameRoom = (option: any) => {
//   if (_this === null) return;
//   socket.emit("gameRoom", { ...option });
// };

// form.addEventListener('submit', function(e) {
//     e.preventDefault();
//     if (input.value) {
//       socket.emit('chat message', input.value);
//       input.value = '';
//     }
//   });

//   socket.on('chat message', function(msg) {
//     var item = document.createElement('li');
//     item.textContent = msg;
//     messages.appendChild(item);
//     window.scrollTo(0, document.body.scrollHeight);
//   });

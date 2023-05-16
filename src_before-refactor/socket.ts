import { io } from "socket.io-client";
const socket = io("http://localhost:3000");
let user = {};
let _this: any = {};
export const joinUserSocket = (
  game: string,
  id: string,
  character: number,
  obj: any
) => {
  _this = obj;
  user = {
    game,
    id,
    character,
  };
  socket.emit("waitingRoom", user);
  socket.on("waitingRoom", (res: any) => {
    if (res.status === "SUCCESS") {
      _this.scene.start(res.key);
    } else {
      // do something
    }
  });
};

export const joinGameRoom = (obj: any) => {
  _this = obj;
  socket.emit("gameRoom", { ...user, action: "CHECK_USERS" });
};

socket.on("gameRoom", (res: any) => {
  if (_this === null) return;
  if (res.action === "CHECK_USERS") {
    _this.createPlayers(res.users);
  }
});

export const updateGameRoom = (option: any) => {
  if (_this === null) return;
  socket.emit("gameRoom", { ...option });
};

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

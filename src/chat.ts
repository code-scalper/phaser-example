import { ROOM, ACTION } from "./socket";

const userName: any = document.querySelector("#user-name");
const chatContainer = document.querySelector("#chat-container");
const chatContent: any = document.querySelector("#chat");
const chatButton = document.querySelector("#chat-submit");

let socket;

const displayChat = (user, message) => {
  const li = document.createElement("li");
  const content = `<span class="text-xs mr-2 text-indigo-300">${user}</span><span class="w-[80%] text-xs">${message}</span>`;
  li.innerHTML = content;
  li.classList.add("flex", "items-start", "justify-start");
  chatContainer.appendChild(li);
};

export const handleChat = (_socket) => {
  socket = _socket;
  socket.on(ROOM.CHAT, (res: any) => {
    const { user, message } = res;
    displayChat(user, message);
  });
};

chatButton.addEventListener("click", () => {
  if (chatContent.value === "") return;
  socket.emit(ROOM.CHAT, { user: userName.value, message: chatContent.value });
  chatContent.value = "";
});
chatContent.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    if (chatContent.value === "") return;
    socket.emit(ROOM.CHAT, {
      user: userName.value || "무명",
      message: chatContent.value,
    });
    chatContent.value = "";
  }
});

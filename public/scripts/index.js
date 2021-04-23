const socket = io.connect("https://localhost:5000");

const createRoomButton = document.getElementById("test");
// const createRoomButton = document.getElementsByClassName("create-room-btn");
const joinRoomButton = document.getElementById("join-room-btn");
const leaveRoomButton = document.getElementById("leave-room-btn");
const removeRoomButton = document.getElementById("remove-room-btn");

const myScreenSharingBtn = document.getElementById("my-screen-share");

const chatBtn = document.getElementById("chat-btn");

let myRoomId = null;

createRoomButton.addEventListener("click", (e) => {
  e.preventDefault();
  const roomId = prompt("방 이름을 입력하세요 :");
  const userId = prompt("유저 이름을 입력하세요 :");
  myRoomId = roomId;
  socket.emit("join-room", {
    roomId,
    userId,
  });
});

joinRoomButton.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("방참가 버튼");
});
leaveRoomButton.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("방나가기 버튼");
});

// removeRoomButton.addEventListener("click", (e) => {
//   e.preventDefault();
//   console.log("방제거 버튼");

//   socket.emit("remove-room", {
//     myRoomId,
//   });
// });

socket.on("update-list", (data) => {
  console.log("업데이트 리스트 : ", data);
});

socket.on("message", ({ username, text, time }) => {
  console.log(`${username} : ${text}, ${time}`);
});

chatBtn.addEventListener("click", (e) => {
  const msg = prompt("채팅 입력하세요");
  socket.emit("chatMessage", { msg });
});

socket.on("preChat");

socket.on("room-users", ({ users }) => {
  console.log("방 사람들 :", users);
});

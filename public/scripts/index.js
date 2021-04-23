const socket = io.connect("https://localhost:5000");

const createRoomButton = document.getElementById("test");
// const createRoomButton = document.getElementsByClassName("create-room-btn");
const joinRoomButton = document.getElementById("join-room-btn");
const leaveRoomButton = document.getElementById("leave-room-btn");
const removeRoomButton = document.getElementById("remove-room-btn");
const chatBtn = document.getElementById("chat-btn");

//

// const myPeer = new Peer(undefined, {
//   path: "/peerjs",
//   host: "/",
//   port: "443",
// });
const myPeer = new Peer();

const videoGrid = document.getElementById("screen-container");
const myScreen = document.createElement("video");
const peerScreen = document.getElementById("peer-screen-container");
myScreen.muted = true;
const peers = {};

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

  navigator.mediaDevices
    .getDisplayMedia({ video: true, audio: true })
    .then((stream) => {
      addVideoStream(myScreen, stream);

      myPeer.on("call", (call) => {
        call.answer(stream);
        const video = document.createElement("video");
        call.on("stream", (userVideoStream) => {
          addVideoStream(video, userVideoStream);
        });
      });
      socket.on("user-connected", (userId) => {
        connectToNewUser(userId, stream);
      });
    });
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

myPeer.on("open", (id) => {
  socket.emit("join-room", roomId, id);
});

const connectToNewUser = (userId, stream) => {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });
  peers[userId] = call;
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};

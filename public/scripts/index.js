// 방 리스트
function createRoomContainer(roomId) {
  const makeRoomElement = document.createElement("div");
  const makeRoom = document.createElement("p");

  makeRoomElement.setAttribute("class", "active-room");
  makeRoomElement.setAttribute("id", roomId);

  makeRoom.setAttribute("class", "roomName");
  makeRoom.innerHTML = `Socket: ${roomId}`;

  makeRoomElement.appendChild(makeRoom);

  makeRoomElement.addEventListener("click", () => {
    makeRoomElement.setAttribute("class", "active-room active-room--selected");
  });
}

const makeRoom = document.getElementById("make-room");
makeRoom.addEventListener("click", () => {
  const roomName = prompt("방 제목 입력");
  console.log("방 제목 : ", roomName);

  socket.emit("join-room", {
    roomId: roomName,
    userId: myName,
  });
});

//유저 접속하면 서버에 저장되어있는 룸 리스트 불러옴
function updateRoomList(roomList) {
  const activeRoomContainer = document.getElementById("active-room-container");

  console.log("룸리스트 목록 :", roomList);
  roomList.forEach((roomId) => {
    // 룸 리스트 반복
    const alreadyExistingRoom = document.getElementById(roomId);
    if (!alreadyExistingRoom) {
      const roomContainerEl = createRoomContainer(roomId);

      console.log("새로 만들 룸 목록 :", roomContainerEl);

      activeRoomContainer.appendChild(roomContainerEl);
    }
  });
}
const socket = io.connect("https://localhost:5000");

const myName = prompt("이름 입력");
console.log("내가 입력 받은 것 : ", myName);

// socket.emit("join-room", {
//   roomId: myName,
//   //   name: makeRandomName(),
//   userId: Math.floor(Math.random() * 100),
// });

// socket.on("join", (data) => {
//   console.log(`${data}가 접속 했습니다.`);
// });

socket.on("update-room-list", ({ roomList }) => {
  console.log("roomId :", roomList);
  updateRoomList(roomList);
});

interface User {
  id: string;
  username: string;
  room: string;
}
interface Chat {
  room: string;
  username: string;
  chat: string;
}

export class Users {
  private users: User[] = [];

  private chats: Chat[] = [];

  //   constructor(id: string, username: string, room: string) {
  //     this.userJoin(id, username, room);
  //     this.getCurrentUser(id);
  //     this.userLeave(id);
  //     this.getRoomUsers(room);
  //   }

  constructor() {}

  getUsers = () => {
    return this.users;
  };

  userJoin = (id: string, username: string, room: string): User => {
    const user = { id, username, room };

    this.users.push(user);

    return user;
  };

  //   getChat = (room: string) => {
  //     const chatList = this.chats.filter((chat) => {
  //       chat.room !== room;
  //     });
  //     return chatList;
  //   };
  //   pushChat = (room: string, username: string, chat: string) => {
  //     const chatList = { room, username, chat };
  //     this.chats.push(chatList);
  //     console.log("this.chats : ", this.chats);
  //   };

  getCurrentUser = (id: string): User => {
    return this.users.find((user) => user.id === id);
  };

  userLeave = (id: string): User => {
    const index = this.users.findIndex((user) => user.id === id);

    if (index !== -1) {
      return this.users.splice(index, 1)[0];
    }
  };

  getRoomUsers = (room: string): User[] => {
    return this.users.filter((user) => user.room === room);
  };
}

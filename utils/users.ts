interface User {
  id: string;
  username: string;
  room: string;
}

export class Users {
  private users: User[] = [];

  constructor(id: string, username: string, room: string) {
    this.userJoin(id, username, room);
    this.getCurrentUser(id);
    this.userLeave(id);
    this.getRoomUsers(room);
  }

  userJoin = (id: string, username: string, room: string): User => {
    const user = { id, username, room };

    this.users.push(user);

    return user;
  };

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

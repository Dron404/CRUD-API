import { v4 } from 'uuid';

export type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
};
export default class Storage {
  users: Map<string, User>;
  constructor() {
    this.users = new Map<string, User>();
  }

  addUser(args: User) {
    const id = this.generateUserId();
    this.users.set(id, args);
  }

  getUser(id: string) {
    return this.users.get(id);
  }

  getUsers() {
    return Array.from(this.users, ([, value]) => value);
  }

  updateUser(data: User) {
    if (!this.users.has(data.id)) {
      return undefined;
    }
    this.users.set(data.id, data);
  }

  deleteUser(id: string) {
    return this.users.delete(id);
  }

  generateUserId() {
    const id = v4();
    if (!this.users.has(id)) {
      return id;
    }
    return this.generateUserId();
  }
}

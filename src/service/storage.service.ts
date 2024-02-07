import { v4 } from 'uuid';
import { User } from 'src/common/types';

export default class StorageService {
  users: Map<string, User>;
  constructor() {
    this.users = new Map<string, User>();
  }

  addUser(args: User) {
    const id = this.generateUserId();
    this.users.set(id, { id, ...args });
    return this.users.get(id);
  }

  getUser(id: string) {
    return this.users.get(id);
  }

  getUsers() {
    return Array.from(this.users, ([, value]) => value);
  }

  updateUser(data: User) {
    if (!this.users.get(data.id)) {
      return undefined;
    }
    this.users.set(data.id, data);
    return this.users.get(data.id);
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

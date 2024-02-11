import { v4 } from 'uuid';
import { DB, User } from 'src/common/types';
import cluster from 'cluster';

export default class StorageService {
  users: Map<string, User>;
  constructor() {
    this.users = new Map<string, User>();
    if (cluster.isWorker) {
      process.on('message', (data: DB) => {
        this.users = new Map(data);
      });
    }
  }

  async save() {
    if (cluster.isWorker) {
      process.send(Array.from(this.users));
    }
  }

  async addUser(args: User) {
    const id = this.generateUserId();
    this.users.set(id, { id, ...args });
    const user = this.users.get(id);
    this.save();
    return user;
  }

  async getUser(id: string) {
    return this.users.get(id);
  }

  async getUsers() {
    return Array.from(this.users, ([, value]) => value);
  }

  async updateUser(data: User) {
    if (!this.users.get(data.id)) {
      return undefined;
    }
    this.users.set(data.id, data);
    await this.save();
    return this.users.get(data.id);
  }

  async deleteUser(id: string) {
    const result = this.users.delete(id);
    if (result) {
      await this.save();
    }
    return result;
  }

  generateUserId(): string {
    const id = v4();
    if (!this.users.has(id)) {
      return id;
    }
    return this.generateUserId();
  }
}

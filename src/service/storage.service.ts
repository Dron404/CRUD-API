import { v4 } from 'uuid';
import { DB, User } from 'src/common/types';
import { readFile, writeFile } from 'fs/promises';

export default class StorageService {
  users: Map<string, User>;
  constructor() {}

  async connect() {
    const db = await readFile('./src/DB/DB.json', 'utf8');
    return new Map(Object.entries(JSON.parse(db))) as Map<string, User>;
  }

  async save(data: Map<string, User>) {
    await writeFile('./src/DB/DB.json', JSON.stringify(Object.fromEntries(data)), 'utf8');
  }

  async addUser(args: User) {
    const db = await this.connect();
    const id = this.generateUserId(db);
    db.set(id, { id, ...args });
    const user = db.get(id);
    await this.save(db);
    return user;
  }

  async getUser(id: string) {
    const db = await this.connect();
    return db.get(id);
  }

  async getUsers() {
    const db = await this.connect();
    return Array.from(db, ([, value]) => value);
  }

  async updateUser(data: User) {
    const db = await this.connect();
    if (!db.get(data.id)) {
      return undefined;
    }
    db.set(data.id, data);
    await this.save(db);
    return db.get(data.id);
  }

  async deleteUser(id: string) {
    const db = await this.connect();
    const result = db.delete(id);
    if (result) {
      await this.save(db);
    }
    return result;
  }

  generateUserId(db: DB): string {
    const id = v4();
    if (!db.has(id)) {
      return id;
    }
    return this.generateUserId(db);
  }
}

import { validate } from 'uuid';
import StorageService from './storage.service';
import { ResDataType, User } from 'src/common/types';

export default class UserService {
  storage: StorageService;
  constructor(storage: StorageService) {
    this.storage = storage;
  }

  getUser(userId: string) {
    const isUUID = validate(userId);
    if (isUUID) {
      const data = this.storage.users.get(userId);
      return { code: data ? 200 : 404, data: data ? data : { message: 'User is not found' } };
    }
    return { code: 400, data: { message: 'id is not a valid UUID' } };
  }

  //getUsers() {}

  addUser(data: User): ResDataType {
    const isDataValid = this.isValidUserData(data);
    if (!isDataValid.success) {
      return { code: 400, data: { message: { ...isDataValid.message } } };
    }
    return { code: 201, data: this.storage.addUser(data) };
  }

  updateUser(data: User, id: string) {
    const isDataValid = this.isValidUserData(data);
    const isUUID = validate(id);
    if (!isDataValid.success || !isUUID) {
      isDataValid.message.unshift('id is not a valid UUID');
      return { code: 400, data: { message: { ...isDataValid.message } } };
    }
    const updatedUser = this.storage.updateUser({ ...data, id });
    return { code: updatedUser ? 200 : 404, data: updatedUser ? updatedUser : { message: 'User is not found' } };
  }

  //deleteUser(userId: string) {}

  //getUsers(){}

  isValidUserData(args: User) {
    const { username, age, hobbies, ...other } = args;
    const message = [];

    for (const property in other) {
      message.push(`property ${property} should not exist`);
    }

    if (typeof username !== 'string') {
      message.push('username is not a string');
    }
    if (username === '') {
      message.push('username is an empty string');
    }
    if (typeof age !== 'number') {
      message.push('age is not a number');
    }
    if (!Array.isArray(hobbies) || !hobbies.every((hobby) => typeof hobby === 'string')) {
      message.push('Invalid hobbies data type');
    }
    if (age < 1 || age > 120) {
      message.push('age must be between 0 and 120');
    }

    return { success: !message.length, message };
  }
}

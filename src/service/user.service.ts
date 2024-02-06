import { validate } from 'uuid';
import StorageService, { User } from './storage.service';

export default class UserService {
  storage: StorageService;
  constructor(storage: StorageService) {
    this.storage = storage;
  }

  isValidUserData(args: User) {
    const { username, age, hobbies, id } = args;
    const message = [];
    switch (true) {
      case typeof username !== 'string':
        message.push('username is not a string');
      case username === '':
        message.push('username is empty string');
      case typeof age !== 'number':
        message.push('age is not a number');
      case age < 0 || age > 120: {
        message.push('age must be between 0 and 120');
      }
      case !Array.isArray(hobbies) || !hobbies.every((hobby) => typeof hobby === 'string'):
        message.push('Invalid hobbies data type');
    }
    if (id) {
      const isIdValid = validate(id);
      !isIdValid && message.push('userId is not  a uuid');
    }
    return { success: !message.length, message };
  }
}

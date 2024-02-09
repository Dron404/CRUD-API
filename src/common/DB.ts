import { createWriteStream } from 'fs';
import { User } from './types';

export const initDB = async () => {
  createWriteStream('./src/DB/DB.json').write(JSON.stringify(Object.fromEntries(new Map<string, User>())));
};

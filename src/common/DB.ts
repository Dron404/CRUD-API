import { createWriteStream } from 'fs';

export const initDB = async () => {
  createWriteStream('./src/DB/DB.json').write('');
};

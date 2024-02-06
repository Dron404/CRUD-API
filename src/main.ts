import App from './app';
import dotenv from 'dotenv';

dotenv.config();
const port = +process.env.PORT || 3000;
console.log(`Port: ${process.env.PORT}`);
const app = new App({ port });

app.start();

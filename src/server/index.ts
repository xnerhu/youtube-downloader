import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';

dotenv.config();

import loginController from './controllers/login';
import callbackController from './controllers/callback';

const { EXPRESS_PORT } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(loginController);
app.use(callbackController);

app.listen(EXPRESS_PORT, () => {
  console.log(`Listening on port ${EXPRESS_PORT}!`);
});
